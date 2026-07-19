import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  buildTelegramMessage,
  getActiveSteps,
  isStepComplete,
  type Answers,
} from "@/lib/data/onboarding";
import { site } from "@/lib/data/site";

const TELEGRAM_API = "https://api.telegram.org";

/** Submissions faster than this are treated as bots (see the honeypot rationale). */
const MIN_ELAPSED_MS = 4000;

const isString = (v: unknown): v is string => typeof v === "string";
const isNullableString = (v: unknown): boolean => v === null || isString(v);

// ── Same-origin guard ───────────────────────────────────────────────────────
// Derived so it works whether site.url is the apex or the www host — always
// allows both, regardless of which one is canonical.
const BASE_HOST = new URL(site.url).host.replace(/^www\./, ""); // vantadevs.com
const ALLOWED_HOSTS = new Set([BASE_HOST, `www.${BASE_HOST}`]);

function hostFromHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

function isLocalhost(host: string): boolean {
  const name = host.split(":")[0];
  return name === "localhost" || name === "127.0.0.1" || name === "0.0.0.0";
}

/**
 * Reject cross-origin POSTs. The request must carry an Origin (or, failing
 * that, a Referer) whose host is either the canonical site domain, localhost,
 * or the exact host this request arrived on — the last case keeps Vercel
 * preview deployments and custom domains working without hardcoding them.
 * No origin context at all is treated as untrusted.
 */
function isSameOrigin(req: Request): boolean {
  const originHost =
    hostFromHeader(req.headers.get("origin")) ??
    hostFromHeader(req.headers.get("referer"));
  if (!originHost) return false;

  const selfHost = req.headers.get("host");
  if (selfHost && originHost === selfHost) return true;
  if (isLocalhost(originHost)) return true;
  return ALLOWED_HOSTS.has(originHost);
}

// ── Rate limiter (Upstash) ──────────────────────────────────────────────────
// Built once at module load. Null when Redis env is absent (e.g. a local dev
// machine without the keys) — in that case the limit is skipped rather than
// blocking legitimate users behind unconfigured infrastructure.
const redisUrl = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "vanta:start-project",
        analytics: false,
      })
    : null;

/** Per-IP key from x-forwarded-for; a shared bucket when the header is absent. */
function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first && first.length > 0 ? first : "shared";
}

// ── Contact format validation ───────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_RE = /^[+()\-.\s\d]{7,20}$/;

function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

function isValidPhone(value: string): boolean {
  const v = value.trim();
  const digits = v.replace(/\D/g, "");
  return PHONE_ALLOWED_RE.test(v) && digits.length >= 7 && digits.length <= 15;
}

/** Free-text human field: non-empty after trim, bounded, single line. */
function isValidText(value: string, max: number): boolean {
  const v = value.trim();
  return v.length >= 1 && v.length <= max && !/[\r\n]/.test(v);
}

/** Website is optional. Empty passes; otherwise it must resolve to a host with a dot. */
function isValidWebsite(value: string): boolean {
  const v = value.trim();
  if (v === "") return true;
  if (v.length > 200) return false;
  const candidate = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const host = new URL(candidate).host;
    return host.includes(".");
  } catch {
    return false;
  }
}

/** True when every contact field is well-formed. Distinct from the empty check. */
function hasValidContactFormat(a: Answers): boolean {
  const c = a.contact;
  const results = {
    name: isValidText(c.name, 100),
    company: isValidText(c.company, 120),
    email: isValidEmail(c.email),
    phone: isValidPhone(c.phone),
    website: isValidWebsite(c.website),
  };
  const failed = Object.entries(results)
    .filter(([, ok]) => !ok)
    .map(([field]) => field);
  if (failed.length > 0) {
    console.warn(
      `[telegram] validation detail: failed fields: ${failed.join(", ")}`,
      { name: c.name, company: c.company, email: c.email, phone: c.phone, website: c.website },
    );
  }
  return failed.length === 0;
}

/**
 * Shape-guard the untrusted JSON body before any Answers logic runs, so a
 * malformed payload returns 400 instead of throwing inside isStepComplete.
 */
function isAnswers(value: unknown): value is Answers {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;

  const nullableFields = [
    a.type,
    a.timeline,
    a.budget,
    a.branding,
    a.meeting,
    a.meetingPlatform,
  ];
  if (!nullableFields.every(isNullableString)) return false;

  if (!Array.isArray(a.goals) || !a.goals.every(isString)) return false;
  if (!isString(a.notes)) return false;

  const contact = a.contact;
  if (typeof contact !== "object" || contact === null) return false;
  const c = contact as Record<string, unknown>;
  const contactKeys = ["name", "company", "email", "phone", "website"] as const;
  return contactKeys.every((key) => isString(c[key]));
}

function invalid(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Silent accept: looks like a bot, but never reveal why it was dropped. */
function silentOk() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  // Origin check — reject cross-origin submissions outright.
  if (!isSameOrigin(req)) {
    console.warn("[telegram] blocked: origin mismatch");
    return invalid("Forbidden.", 403);
  }

  // Rate limit — per IP, sliding window. Skipped when Redis is unconfigured.
  // Wrapped in try-catch: if Upstash is down, fail open (let the request through)
  // rather than returning 500 to every user.
  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(clientIp(req));
      if (!success) {
        console.warn("[telegram] blocked: rate limit exceeded");
        return invalid("Too many requests. Please try again later.", 429);
      }
    } catch (err) {
      console.error("[telegram] rate limiter error (failing open):", err);
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    console.warn("[telegram] blocked: invalid JSON body");
    return invalid("Invalid request.", 400);
  }

  if (typeof body !== "object" || body === null) {
    console.warn("[telegram] blocked: body is not an object");
    return invalid("Invalid request.", 400);
  }

  const { answers, honeypot, startedAt } = body as {
    answers?: unknown;
    honeypot?: unknown;
    startedAt?: unknown;
  };

  // Bot trap: a filled hidden field means an automated submission. Accept with
  // 200 OK and send nothing — never signal to the bot that it was caught.
  if (isString(honeypot) && honeypot.trim() !== "") {
    console.warn("[telegram] silent drop: honeypot filled");
    return silentOk();
  }

  // Timing trap: a real person cannot complete the multi-step form in seconds.
  // A missing or implausibly-fast timestamp is handled exactly like the honeypot.
  // NOTE: negative elapsed values mean the client clock is ahead of the server —
  // that's clock skew, not a bot. Only reject small *positive* values.
  const elapsed =
    typeof startedAt === "number" && Number.isFinite(startedAt)
      ? Date.now() - startedAt
      : NaN;
  if (!Number.isFinite(elapsed) || (elapsed >= 0 && elapsed < MIN_ELAPSED_MS)) {
    console.warn(`[telegram] silent drop: timing trap (elapsed=${elapsed})`);
    return silentOk();
  }

  if (!isAnswers(answers)) {
    console.warn("[telegram] blocked: answers failed shape check");
    return invalid("Invalid request.", 400);
  }

  // Format validation — well-formed contact details, distinct from "field empty".
  if (!hasValidContactFormat(answers)) {
    console.warn("[telegram] blocked: contact format validation failed");
    return invalid("Please check your contact details.", 422);
  }

  // Reuse the exact client-side rule, including the conditional meetingPlatform
  // step, so server and client validation can never drift.
  const complete = getActiveSteps(answers).every((step) =>
    isStepComplete(step, answers),
  );
  if (!complete) {
    console.warn("[telegram] blocked: incomplete steps");
    return invalid("Please complete all required fields.", 422);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[telegram] env missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return invalid("Messaging is not configured.", 500);
  }

  try {
    console.info("[telegram] sending to Telegram...");
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        text: buildTelegramMessage(answers),
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "(unreadable)");
      // Log status + response body for debugging — the URL is NOT logged (contains token).
      console.error(`[telegram] sendMessage failed: ${res.status} — ${errBody}`);
      return invalid("Could not send your project. Please try again.", 502);
    }

    console.info("[telegram] sent successfully");
  } catch (err) {
    console.error("[telegram] fetch threw:", err);
    return invalid("Could not send your project. Please try again.", 502);
  }

  return NextResponse.json({ ok: true });
}

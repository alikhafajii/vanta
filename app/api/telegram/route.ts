import { NextResponse } from "next/server";
import {
  buildTelegramMessage,
  getActiveSteps,
  isStepComplete,
  type Answers,
} from "@/lib/data/onboarding";

const TELEGRAM_API = "https://api.telegram.org";

const isString = (v: unknown): v is string => typeof v === "string";
const isNullableString = (v: unknown): boolean => v === null || isString(v);

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

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return invalid("Invalid request.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return invalid("Invalid request.", 400);
  }

  const { answers, honeypot } = body as {
    answers?: unknown;
    honeypot?: unknown;
  };

  // Bot trap: a filled hidden field means an automated submission. Accept with
  // 200 OK and send nothing — never signal to the bot that it was caught.
  if (isString(honeypot) && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!isAnswers(answers)) {
    return invalid("Invalid request.", 400);
  }

  // Reuse the exact client-side rule, including the conditional meetingPlatform
  // step, so server and client validation can never drift.
  const complete = getActiveSteps(answers).every((step) =>
    isStepComplete(step, answers),
  );
  if (!complete) {
    return invalid("Please complete all required fields.", 422);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return invalid("Messaging is not configured.", 500);
  }

  try {
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
      // Log status only — the response body / URL must never surface the token.
      console.error(`Telegram sendMessage failed: ${res.status}`);
      return invalid("Could not send your project. Please try again.", 502);
    }
  } catch {
    return invalid("Could not send your project. Please try again.", 502);
  }

  return NextResponse.json({ ok: true });
}

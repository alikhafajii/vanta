/**
 * VANTA project onboarding — the single source of truth for the /start-project
 * flow. Every step, option and the outgoing Telegram message are derived from
 * here; the UI renders this config and holds no hard-coded copy.
 */

// ── Destinations ───────────────────────────────────────────────────────────
export const INSTAGRAM_URL = "https://instagram.com/vantadevs";

/**
 * Hidden bot-trap field name. Real users never see or fill it; automated
 * form-fillers often will. Kept out of the typed Answers model on purpose —
 * it's sent alongside the answers and checked server-side, never persisted.
 */
export const HONEYPOT_FIELD = "website_url_confirm";

// ── Step model ─────────────────────────────────────────────────────────────
export type StepId =
  | "type"
  | "timeline"
  | "budget"
  | "goals"
  | "meeting"
  | "meetingPlatform"
  | "notes"
  | "contact";

type StepBase = {
  id: StepId;
  title: string;
  /** One emphasised word inside the heading, set in the editorial serif. */
  accent?: string;
  subtitle?: string;
};

export type SingleStep = StepBase & {
  kind: "single";
  options: string[];
  /**
   * Optional per-option caption. When the matching option is selected, its
   * copy fades in below the pills to explain what that choice includes.
   */
  optionNotes?: Record<string, string>;
  /** Always-visible clarification shown beneath the options (e.g. pricing is negotiable). */
  disclaimer?: string;
};
export type MultiStep = StepBase & { kind: "multi"; options: string[] };
export type NotesStep = StepBase & { kind: "notes"; placeholder: string };
export type ContactFieldName =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "website";
export type ContactField = {
  name: ContactFieldName;
  label: string;
  type: "text" | "email" | "tel" | "url";
  placeholder: string;
  optional?: boolean;
};
export type ContactStep = StepBase & { kind: "contact"; fields: ContactField[] };

export type Step = SingleStep | MultiStep | NotesStep | ContactStep;

export const steps: Step[] = [
  {
    id: "type",
    kind: "single",
    title: "What are we building?",
    accent: "building",
    options: [
      "Business Website",
      "Landing Page",
      "E-commerce",
      "Web Application",
      "Portfolio",
      "Dashboard",
      "Something Else",
    ],
  },
  {
    id: "timeline",
    kind: "single",
    title: "When do you want it finished?",
    accent: "finished",
    options: ["ASAP", "2 Weeks", "1 Month", "2-3 Months", "No Deadline"],
  },
  {
    id: "budget",
    kind: "single",
    title: "What's the budget?",
    accent: "budget",
    options: [
      "Under $500",
      "$500–1,000",
      "$1,000–2,500",
      "$2,500–5,000",
      "$5,000+",
    ],
    optionNotes: {
      "Under $500":
        "A clean, fully-functional site — one design direction, no custom animation or motion. Built fast, built right.",
      "$500–1,000":
        "Everything above, plus a few additional pages and refined responsive polish.",
      "$1,000–2,500":
        "A custom-designed layout, not a template — light interface motion, closer attention to user flow.",
      "$2,500–5,000":
        "Full custom design system, richer motion and micro-interactions, UX considered at every screen.",
      "$5,000+":
        "The full VANTA treatment — bespoke design, complete motion choreography, craft at the level of our portfolio work.",
    },
    disclaimer:
      "These are starting points, not fixed quotes — every budget is open to discussion.",
  },
  {
    id: "goals",
    kind: "multi",
    title: "What's the primary goal?",
    accent: "goal",
    subtitle: "Choose all that apply.",
    options: [
      "Generate Leads",
      "Increase Sales",
      "Modernize Brand",
      "Build MVP",
      "Show Portfolio",
      "Launch Startup",
      "Improve UX",
      "Other",
    ],
  },
  {
    id: "meeting",
    kind: "single",
    title: "Would you like to book a meeting?",
    accent: "meeting",
    options: ["Yes", "No"],
  },
  {
    id: "meetingPlatform",
    kind: "single",
    title: "Preferred platform?",
    accent: "platform",
    options: ["Google Meet", "Zoom", "Discord", "WhatsApp", "Phone Call"],
  },
  {
    id: "notes",
    kind: "notes",
    title: "Anything else?",
    accent: "else",
    placeholder: "Share vision, references, links — anything that helps us understand...",
  },
  {
    id: "contact",
    kind: "contact",
    title: "Where do we reach you?",
    accent: "reach",
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Your name" },
      {
        name: "company",
        label: "Company",
        type: "text",
        placeholder: "Company or brand",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@company.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+1 555 000 0000",
      },
      {
        name: "website",
        label: "Website",
        type: "url",
        placeholder: "yourdomain.com",
        optional: true,
      },
    ],
  },
];

// ── Answer state ───────────────────────────────────────────────────────────
export type Answers = {
  type: string | null;
  timeline: string | null;
  budget: string | null;
  goals: string[];
  meeting: string | null;
  meetingPlatform: string | null;
  notes: string;
  contact: {
    name: string;
    company: string;
    email: string;
    phone: string;
    website: string;
  };
};

export const initialAnswers: Answers = {
  type: null,
  timeline: null,
  budget: null,
  goals: [],
  meeting: null,
  meetingPlatform: null,
  notes: "",
  contact: { name: "", company: "", email: "", phone: "", website: "" },
};

/**
 * The steps visible for the current answers. The meeting-platform step only
 * appears when the user wants a meeting.
 */
export function getActiveSteps(a: Answers): Step[] {
  return steps.filter(
    (s) => s.id !== "meetingPlatform" || a.meeting === "Yes",
  );
}

// ── Contact validation ───────────────────────────────────────────────────────
// Single source of truth for format rules — the client (inline field errors,
// button gating) and the server (route.ts) both import these, so they can
// never drift apart.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_RE = /^[+()\-.\s\d]{7,20}$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

export function isValidPhone(value: string): boolean {
  const v = value.trim();
  const digits = v.replace(/\D/g, "");
  return PHONE_ALLOWED_RE.test(v) && digits.length >= 7 && digits.length <= 15;
}

/** Website is optional. Empty passes; otherwise it must resolve to a host with a dot. */
export function isValidWebsite(value: string): boolean {
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

// ── Field bounds & option validation ─────────────────────────────────────────
// Shared with route.ts's shape guard so a scripted client bypassing the UI
// can't inject unbounded or off-menu values — client and server can't drift
// since both read from the same `steps` config and constants.
const NOTES_MAX = 2000;
const GOALS_MAX_ITEMS = 10;
const GOAL_MAX_LEN = 60;

function singleSelectOptions(id: StepId): readonly string[] {
  const step = steps.find((s) => s.id === id);
  return step && step.kind === "single" ? step.options : [];
}

/** True when a nullable single-select answer is unset or one of the real options for that step. */
export function isValidSingleSelect(id: StepId, value: string | null): boolean {
  return value === null || singleSelectOptions(id).includes(value);
}

export function isValidNotes(value: string): boolean {
  return value.length <= NOTES_MAX;
}

export function isValidGoals(value: string[]): boolean {
  return (
    value.length <= GOALS_MAX_ITEMS &&
    value.every((g) => g.length <= GOAL_MAX_LEN)
  );
}

/** True when the contact block is both filled in and well-formed. */
export function isContactValid(a: Answers): boolean {
  const c = a.contact;
  return (
    c.name.trim() !== "" &&
    c.company.trim() !== "" &&
    isValidEmail(c.email) &&
    isValidPhone(c.phone) &&
    isValidWebsite(c.website)
  );
}

/** True when the given step has enough input to advance. */
export function isStepComplete(step: Step, a: Answers): boolean {
  switch (step.id) {
    case "type":
      return a.type !== null;
    case "timeline":
      return a.timeline !== null;
    case "budget":
      return a.budget !== null;
    case "goals":
      return a.goals.length > 0;
    case "meeting":
      return a.meeting !== null;
    case "meetingPlatform":
      return a.meetingPlatform !== null;
    case "notes":
      return true; // optional
    case "contact":
      return isContactValid(a);
  }
}

// ── Message composition ─────────────────────────────────────────────────────
function meetingSummary(a: Answers): string {
  if (a.meeting !== "Yes") return a.meeting ?? "—";
  return a.meetingPlatform ? `Yes — ${a.meetingPlatform}` : "Yes";
}

type SummaryEntry = { label: string; values: string[]; bullet?: boolean };

/**
 * Single source of truth for the summary field list. Both the plain-text
 * summary and the Telegram HTML message derive from this, so a new step can
 * never appear in one channel and silently drop from the other.
 */
function summaryEntries(a: Answers): SummaryEntry[] {
  return [
    { label: "Building", values: [a.type ?? "—"] },
    { label: "Timeline", values: [a.timeline ?? "—"] },
    { label: "Budget", values: [a.budget ?? "—"] },
    { label: "Primary Goal", values: a.goals.length ? a.goals : ["—"], bullet: true },
    { label: "Meeting", values: [meetingSummary(a)] },
    { label: "Notes", values: [a.notes.trim() || "—"] },
    { label: "Name", values: [a.contact.name.trim() || "—"] },
    { label: "Company", values: [a.contact.company.trim() || "—"] },
    { label: "Email", values: [a.contact.email.trim() || "—"] },
    { label: "Phone", values: [a.contact.phone.trim() || "—"] },
    { label: "Website", values: [a.contact.website.trim() || "—"] },
  ];
}

/** Build types ambitious enough that a rushed, low-budget brief is worth flagging. */
const AMBITIOUS_TYPES = new Set([
  "E-commerce",
  "Web Application",
  "Dashboard",
]);

/**
 * A non-blocking heads-up for whoever reads the Telegram lead: an ASAP timeline
 * paired with the lowest budget on an ambitious build is usually a scope /
 * expectations mismatch worth a second look. Returns null when nothing is off.
 */
export function comboWarning(a: Answers): string | null {
  const rushed = a.timeline === "ASAP";
  const lowBudget = a.budget === "Under $500";
  const ambitious = a.type !== null && AMBITIOUS_TYPES.has(a.type);
  if (rushed && lowBudget && ambitious) {
    return `ASAP timeline on the lowest budget for an ambitious build (${a.type}) — scope and expectations likely need a reality check.`;
  }
  return null;
}

/**
 * Escape the three characters Telegram's HTML parse mode treats as markup.
 * Every user-supplied value (name, notes, etc.) must pass through this or the
 * message breaks — or worse, injects tags — when a value contains &, < or >.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * The message body sent to Telegram with parse_mode "HTML". Labels are static
 * and bolded; every dynamic value is HTML-escaped.
 */
export function buildTelegramMessage(a: Answers): string {
  const lines: string[] = ["<b>New VANTA Project</b>", ""];

  // Prepend the non-blocking combo heads-up (Telegram only, never blocks send).
  const warning = comboWarning(a);
  if (warning) lines.push(`⚠️ ${escapeHtml(warning)}`, "");

  for (const { label, values, bullet } of summaryEntries(a)) {
    lines.push(`<b>${label}:</b>`);
    for (const value of values) {
      const safe = escapeHtml(value);
      lines.push(bullet ? `• ${safe}` : safe);
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}

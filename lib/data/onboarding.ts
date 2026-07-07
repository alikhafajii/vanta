/**
 * VANTA project onboarding — the single source of truth for the /start flow.
 * Every step, option and the outgoing WhatsApp message are derived from here;
 * the UI renders this config and holds no hard-coded copy of its own.
 */

// ── Destination ────────────────────────────────────────────────────────────
// WhatsApp business number in full international form, digits only (no "+",
// spaces or dashes). REPLACE with the studio's real number before launch.
export const WHATSAPP_NUMBER = "0000000000";

// ── Step model ─────────────────────────────────────────────────────────────
export type StepId =
  | "type"
  | "goals"
  | "timeline"
  | "budget"
  | "prep"
  | "meeting"
  | "notes"
  | "contact";

type StepBase = {
  id: StepId;
  /** The step heading, e.g. "What are we building?". */
  title: string;
  /** One emphasised word inside the heading, rendered in the editorial serif. */
  accent?: string;
  subtitle?: string;
};

export type SingleStep = StepBase & { kind: "single"; options: string[] };
export type MultiStep = StepBase & {
  kind: "multi";
  options: string[];
  /** Rendered as checkboxes rather than pills. */
  checkbox?: boolean;
};
export type NotesStep = StepBase & { kind: "notes"; placeholder: string };
export type ContactField = {
  name: "name" | "whatsapp" | "email";
  label: string;
  type: "text" | "tel" | "email";
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
    id: "goals",
    kind: "multi",
    title: "What is your primary goal?",
    accent: "goal",
    subtitle: "Choose all that apply.",
    options: [
      "Generate Leads",
      "Sell Products",
      "Build Brand",
      "Redesign Existing Website",
      "Launch Startup",
      "Improve Conversion",
    ],
  },
  {
    id: "timeline",
    kind: "single",
    title: "What's your timeline?",
    accent: "timeline",
    options: ["ASAP", "2 Weeks", "1 Month", "2–3 Months", "Flexible"],
  },
  {
    id: "budget",
    kind: "single",
    title: "What's the budget?",
    accent: "budget",
    options: ["Under $1k", "$1k–3k", "$3k–5k", "$5k–10k", "$10k+", "Let's Discuss"],
  },
  {
    id: "prep",
    kind: "multi",
    checkbox: true,
    title: "How would you like us to prepare?",
    accent: "prepare",
    subtitle: "We'll bring these to our first conversation.",
    options: [
      "Homepage Concepts",
      "Competitor Analysis",
      "Visual Direction",
      "UI Inspiration",
      "Technical Architecture",
      "SEO Strategy",
      "Brand Direction",
    ],
  },
  {
    id: "meeting",
    kind: "single",
    title: "Would you like to book a meeting?",
    accent: "meeting",
    options: ["Yes — WhatsApp", "Yes — Google Meet", "Not Yet"],
  },
  {
    id: "notes",
    kind: "notes",
    title: "Anything else?",
    accent: "else",
    placeholder: "Tell us anything that will help us understand your vision...",
  },
  {
    id: "contact",
    kind: "contact",
    title: "Where do we reach you?",
    accent: "reach",
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Your name" },
      {
        name: "whatsapp",
        label: "WhatsApp Number",
        type: "tel",
        placeholder: "+1 555 000 0000",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@company.com",
        optional: true,
      },
    ],
  },
];

// ── Answer state ───────────────────────────────────────────────────────────
export type Answers = {
  type: string | null;
  goals: string[];
  timeline: string | null;
  budget: string | null;
  prep: string[];
  meeting: string | null;
  notes: string;
  contact: { name: string; whatsapp: string; email: string };
};

export const initialAnswers: Answers = {
  type: null,
  goals: [],
  timeline: null,
  budget: null,
  prep: [],
  meeting: null,
  notes: "",
  contact: { name: "", whatsapp: "", email: "" },
};

/** True when the given step has enough input to advance. */
export function isStepComplete(step: Step, a: Answers): boolean {
  switch (step.id) {
    case "type":
      return a.type !== null;
    case "goals":
      return a.goals.length > 0;
    case "timeline":
      return a.timeline !== null;
    case "budget":
      return a.budget !== null;
    case "prep":
      return a.prep.length > 0;
    case "meeting":
      return a.meeting !== null;
    case "notes":
      return true; // optional
    case "contact":
      return a.contact.name.trim() !== "" && a.contact.whatsapp.trim() !== "";
  }
}

// ── Outgoing message ───────────────────────────────────────────────────────
const RULE = "━━━━━━━━━━━━━━━━━━";

/** Strip the "Yes — " prefix from meeting choices for the summary. */
function meetingLabel(value: string | null): string {
  if (!value) return "—";
  return value.replace(/^Yes\s*—\s*/, "");
}

/** Build the formatted WhatsApp summary from the collected answers. */
export function buildWhatsappMessage(a: Answers): string {
  const lines: string[] = [RULE, "", "New Vanta Project", ""];

  const block = (label: string, body: string | string[], bullet = false) => {
    lines.push(`${label}:`);
    const items = Array.isArray(body) ? body : [body];
    for (const item of items) lines.push(bullet ? `• ${item}` : item);
    lines.push("");
  };

  block("Website", a.type ?? "—");
  block("Goal", a.goals.length ? a.goals : ["—"]);
  block("Timeline", a.timeline ?? "—");
  block("Budget", a.budget ?? "—");
  block("Preparation", a.prep.length ? a.prep : ["—"], true);
  block("Meeting", meetingLabel(a.meeting));
  block("Additional Notes", a.notes.trim() || "—");
  block("Name", a.contact.name.trim() || "—");
  block("WhatsApp", a.contact.whatsapp.trim() || "—");
  block("Email", a.contact.email.trim() || "—");

  lines.push(RULE);
  return lines.join("\n");
}

/** wa.me deep link with the summary pre-filled. */
export function buildWhatsappUrl(a: Answers): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsappMessage(a),
  )}`;
}

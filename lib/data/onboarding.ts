/**
 * VANTA project onboarding — the single source of truth for the /start-project
 * flow. Every step, option and the outgoing WhatsApp / email messages are
 * derived from here; the UI renders this config and holds no hard-coded copy.
 */

// ── Destinations ───────────────────────────────────────────────────────────
/** WhatsApp business number, digits only (international, no "+"). */
export const WHATSAPP_NUMBER = "96181049409";
/** Where the email draft is addressed. */
export const INQUIRY_EMAIL = "vantadevss@gmail.com";
export const INSTAGRAM_URL = "https://instagram.com/vantadevs";

// ── Step model ─────────────────────────────────────────────────────────────
export type StepId =
  | "type"
  | "timeline"
  | "budget"
  | "goals"
  | "branding"
  | "meeting"
  | "meetingPlatform"
  | "mockups"
  | "notes"
  | "contact";

type StepBase = {
  id: StepId;
  title: string;
  /** One emphasised word inside the heading, set in the editorial serif. */
  accent?: string;
  subtitle?: string;
};

export type SingleStep = StepBase & { kind: "single"; options: string[] };
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
    id: "branding",
    kind: "single",
    title: "Need branding too?",
    accent: "branding",
    options: ["Yes", "No", "Maybe"],
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
    id: "mockups",
    kind: "single",
    title: "Want free mockup concepts before committing?",
    accent: "free",
    options: ["Yes", "No"],
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
  branding: string | null;
  meeting: string | null;
  meetingPlatform: string | null;
  mockups: string | null;
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
  branding: null,
  meeting: null,
  meetingPlatform: null,
  mockups: null,
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
    case "branding":
      return a.branding !== null;
    case "meeting":
      return a.meeting !== null;
    case "meetingPlatform":
      return a.meetingPlatform !== null;
    case "mockups":
      return a.mockups !== null;
    case "notes":
      return true; // optional
    case "contact":
      return (
        a.contact.name.trim() !== "" &&
        a.contact.company.trim() !== "" &&
        a.contact.email.trim() !== "" &&
        a.contact.phone.trim() !== ""
      );
  }
}

// ── Message composition ─────────────────────────────────────────────────────
const RULE = "━━━━━━━━━━━━━━━━━━";

function meetingSummary(a: Answers): string {
  if (a.meeting !== "Yes") return a.meeting ?? "—";
  return a.meetingPlatform ? `Yes — ${a.meetingPlatform}` : "Yes";
}

/** The shared, human-readable summary used by both WhatsApp and email. */
export function buildSummary(a: Answers): string {
  const lines: string[] = [RULE, "", "New VANTA Project", ""];

  const block = (label: string, body: string | string[], bullet = false) => {
    lines.push(`${label}:`);
    const items = Array.isArray(body) ? body : [body];
    for (const item of items) lines.push(bullet ? `• ${item}` : item);
    lines.push("");
  };

  block("Building", a.type ?? "—");
  block("Timeline", a.timeline ?? "—");
  block("Budget", a.budget ?? "—");
  block("Primary Goal", a.goals.length ? a.goals : ["—"], true);
  block("Branding", a.branding ?? "—");
  block("Meeting", meetingSummary(a));
  block("Free Mockups", a.mockups ?? "—");
  block("Notes", a.notes.trim() || "—");
  block("Name", a.contact.name.trim() || "—");
  block("Company", a.contact.company.trim() || "—");
  block("Email", a.contact.email.trim() || "—");
  block("Phone", a.contact.phone.trim() || "—");
  block("Website", a.contact.website.trim() || "—");

  lines.push(RULE);
  return lines.join("\n");
}

/** wa.me deep link with the summary pre-filled. */
export function buildWhatsappUrl(a: Answers): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildSummary(a),
  )}`;
}

/** mailto: draft addressed to the studio with the full summary as the body. */
export function buildMailUrl(a: Answers): string {
  const subject = encodeURIComponent("New VANTA Project Inquiry");
  const body = encodeURIComponent(buildSummary(a));
  return `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  buildMailUrl,
  buildWhatsappUrl,
  getActiveSteps,
  initialAnswers,
  INSTAGRAM_URL,
  isStepComplete,
  type Answers,
  type ContactFieldName,
} from "@/lib/data/onboarding";
import Aurora from "@/components/start/Aurora";
import { StepFields } from "@/components/start/fields";
import { Wordmark } from "@/components/ui/Wordmark";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const block = {
  initial: { opacity: 0, y: 26, filter: "blur(9px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(9px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

/** Render the heading with its accent word set in the editorial serif. */
function Heading({ title, accent }: { title: string; accent?: string }) {
  if (!accent || !title.includes(accent)) return <>{title}</>;
  const [before, after] = title.split(accent);
  return (
    <>
      {before}
      <span className="serif">{accent}</span>
      {after}
    </>
  );
}

export function StartExperience() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const activeSteps = useMemo(() => getActiveSteps(answers), [answers]);
  const total = activeSteps.length;
  const clamped = Math.min(index, total - 1);
  const step = activeSteps[clamped];
  const isLast = clamped === total - 1;
  const complete = isStepComplete(step, answers);
  const showContinue = step.kind !== "single"; // single steps auto-advance

  // Aurora settles first; the flow fades in ~400ms later.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  // Move focus to each new question for screen-reader context.
  useEffect(() => {
    if (ready && !done) headingRef.current?.focus();
  }, [clamped, ready, done]);

  const goNext = () =>
    setIndex((i) =>
      Math.min(i + 1, getActiveSteps(answersRef.current).length - 1),
    );
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

  const onSingle = (value: string) => {
    setAnswers((a) => ({ ...a, [step.id]: value }));
    window.setTimeout(goNext, 380);
  };

  const onToggle = (value: string) => {
    setAnswers((a) => {
      const arr = a.goals;
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...a, goals: next };
    });
  };

  const onNotes = (value: string) =>
    setAnswers((a) => ({ ...a, notes: value }));

  const onContact = (name: ContactFieldName, value: string) =>
    setAnswers((a) => ({ ...a, contact: { ...a.contact, [name]: value } }));

  const submit = () => {
    if (submitting || done || !complete) return;
    // Fire both channels inside the click gesture so pop-up blockers allow it.
    window.open(buildWhatsappUrl(answers), "_blank", "noopener,noreferrer");
    const mail = document.createElement("a");
    mail.href = buildMailUrl(answers);
    mail.style.display = "none";
    document.body.appendChild(mail);
    mail.click();
    mail.remove();

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 2000);
  };

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#120F17] px-4 py-16 sm:px-6 sm:py-20">
      {/* Layer 0 — official React Bits Aurora: fixed, full viewport, behind all */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <Aurora
          colorStops={["#7cff67", "#B497CF", "#5227FF"]}
          amplitude={1.45}
          blend={0.68}
          speed={0.5}
        />
      </motion.div>

      {/* Layer 1 — dark overlay ABOVE Aurora (keeps it visible, text legible) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ background: "rgba(0,0,0,0.25)" }}
      />

      {/* Layer 2 — subtle noise texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.05]"
        style={{ backgroundImage: NOISE }}
      />

      {/* Back to site */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-7 left-6 z-20 sm:left-10"
      >
        <Link href="/" aria-label="VANTA — back to home" className="text-white" data-cursor="hover">
          <Wordmark className="h-3" strokeWidth={3} />
        </Link>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[760px] lg:translate-x-[80px] lg:translate-y-[100px]">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.section
              key="success"
              variants={block}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-start"
            >
              <span className="eyebrow mb-6 text-muted">VANTA</span>
              <h1 className="text-[clamp(2.6rem,7vw,5rem)] leading-[0.98] font-medium tracking-tight text-white">
                Thank <span className="serif">you.</span>
              </h1>
              <p className="mt-7 max-w-md text-lead text-muted">
                We&rsquo;ve received your project. We&rsquo;ll reach out shortly.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  data-cursor="hover"
                  className="rounded-full bg-white px-7 py-3.5 text-[0.95rem] font-medium text-void transition-colors duration-300 hover:bg-white/90"
                >
                  Back home
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="rounded-full border border-line-strong px-7 py-3.5 text-[0.95rem] font-medium text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/[0.04]"
                >
                  Instagram ↗
                </a>
              </div>
            </motion.section>
          ) : (
            <div>
              {/* Progress indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mb-10 flex items-center gap-4"
              >
                <span className="eyebrow text-muted">Project</span>
                <span className="h-px w-8 bg-line-strong" />
                <span className="eyebrow text-white">
                  {pad(clamped + 1)}{" "}
                  <span className="text-faint">/ {pad(total)}</span>
                </span>
              </motion.div>

              {/* Question */}
              <div className="min-h-[360px]">
                <AnimatePresence mode="wait">
                  {ready ? (
                    <motion.section
                      key={step.id}
                      variants={block}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      aria-labelledby="start-step-title"
                    >
                      <h1
                        id="start-step-title"
                        ref={headingRef}
                        tabIndex={-1}
                        className="max-w-[16ch] text-[clamp(2.1rem,4.8vw,3.6rem)] leading-[1.03] font-medium tracking-tight text-white outline-none"
                      >
                        <Heading title={step.title} accent={step.accent} />
                      </h1>

                      {"subtitle" in step && step.subtitle ? (
                        <p className="mt-4 text-lead text-muted">
                          {step.subtitle}
                        </p>
                      ) : null}

                      <div className="mt-10">
                        <StepFields
                          step={step}
                          answers={answers}
                          onSingle={onSingle}
                          onToggle={onToggle}
                          onNotes={onNotes}
                          onContact={onContact}
                        />
                      </div>
                    </motion.section>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 flex items-center justify-between"
              >
                <button
                  type="button"
                  onClick={goBack}
                  disabled={clamped === 0}
                  data-cursor="hover"
                  className="text-[0.9rem] text-muted transition-colors duration-300 hover:text-white disabled:pointer-events-none disabled:opacity-0"
                >
                  ← Back
                </button>

                {isLast ? (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={!complete}
                    data-cursor="hover"
                    className="rounded-full bg-white px-8 py-3.5 text-[0.95rem] font-medium text-void transition-all duration-300 hover:bg-white/90 disabled:pointer-events-none disabled:opacity-40"
                  >
                    Send Project →
                  </button>
                ) : showContinue ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!complete}
                    data-cursor="hover"
                    className="rounded-full border border-line-strong px-8 py-3.5 text-[0.95rem] font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/[0.04] disabled:pointer-events-none disabled:opacity-30"
                  >
                    Continue →
                  </button>
                ) : (
                  <span aria-hidden="true" />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit / sending overlay */}
      <AnimatePresence>
        {submitting ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#120F17]/85 backdrop-blur-md"
          >
            <motion.svg
              viewBox="0 0 48 48"
              className="h-12 w-12 text-white"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.15"
              />
              <path
                d="M44 24a20 20 0 0 0-20-20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.svg>
            <p className="eyebrow text-muted">Sending your project</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

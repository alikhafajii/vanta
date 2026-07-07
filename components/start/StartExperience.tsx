"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  buildWhatsappUrl,
  initialAnswers,
  isStepComplete,
  steps,
  type Answers,
  type ContactField,
} from "@/lib/data/onboarding";
import { Aurora } from "@/components/start/Aurora";
import { StepFields } from "@/components/start/fields";
import { Wordmark } from "@/components/ui/Wordmark";

const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL = steps.length;
const pad = (n: number) => String(n).padStart(2, "0");

const block = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(8px)",
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
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const step = steps[index];
  const isLast = index === TOTAL - 1;
  const complete = isStepComplete(step, answers);
  const showContinue = step.kind !== "single"; // single steps auto-advance

  // Aurora settles first; the flow fades in ~400ms later.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  // Move focus to each new question for screen-reader context.
  useEffect(() => {
    if (ready) headingRef.current?.focus();
  }, [index, ready]);

  const goNext = () => setIndex((i) => Math.min(i + 1, TOTAL - 1));
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

  const onSingle = (value: string) => {
    setAnswers((a) => ({ ...a, [step.id]: value }));
    if (!isLast) window.setTimeout(goNext, 380);
  };

  const onToggle = (value: string) => {
    setAnswers((a) => {
      const key = step.id as "goals" | "prep";
      const arr = a[key];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...a, [key]: next };
    });
  };

  const onNotes = (value: string) =>
    setAnswers((a) => ({ ...a, notes: value }));

  const onContact = (name: ContactField["name"], value: string) =>
    setAnswers((a) => ({ ...a, contact: { ...a.contact, [name]: value } }));

  const submit = () => {
    if (!complete || submitting) return;
    setSubmitting(true);
    const url = buildWhatsappUrl(answers);
    window.setTimeout(() => {
      window.location.href = url;
    }, 2000);
  };

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 py-16">
      {/* Aurora — fades in first, runs throughout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="fixed inset-0 z-0"
      >
        <Aurora className="h-full w-full" />
      </motion.div>

      {/* Soft radial vignette around the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 45%, transparent 42%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Escape hatch back to the site */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        aria-label="VANTA — back to home"
        data-cursor="hover"
        className="fixed top-7 left-6 z-20 text-white sm:left-10"
      >
        <Wordmark className="h-3" strokeWidth={3} />
      </motion.a>

      {/* Flow */}
      <div className="relative z-10 w-full max-w-[760px]">
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
            {pad(index + 1)} <span className="text-faint">/ {pad(TOTAL)}</span>
          </span>
        </motion.div>

        {/* Question */}
        <div className="min-h-[340px]">
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
                  className="max-w-[15ch] text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[1.03] font-medium tracking-tight text-white outline-none"
                >
                  <Heading title={step.title} accent={step.accent} />
                </h1>

                {"subtitle" in step && step.subtitle ? (
                  <p className="mt-4 text-lead text-muted">{step.subtitle}</p>
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
            disabled={index === 0}
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
              className="rounded-full bg-white px-7 py-3.5 text-[0.95rem] font-medium text-void transition-all duration-300 hover:bg-white/90 disabled:pointer-events-none disabled:opacity-40"
            >
              Build My Proposal
            </button>
          ) : showContinue ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!complete}
              data-cursor="hover"
              className="rounded-full border border-line-strong px-7 py-3.5 text-[0.95rem] font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/[0.04] disabled:pointer-events-none disabled:opacity-30"
            >
              Continue →
            </button>
          ) : (
            <span aria-hidden="true" />
          )}
        </motion.div>
      </div>

      {/* Submit / building overlay */}
      <AnimatePresence>
        {submitting ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#050505]/85 backdrop-blur-md"
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
            <p className="eyebrow text-muted">Building your proposal</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  HONEYPOT_FIELD,
  type Answers,
  type ContactField,
  type Step,
} from "@/lib/data/onboarding";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Staggered entrance for each option — "options fade one by one". */
const optionMotion = (i: number) => ({
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: 0.18 + i * 0.05, duration: 0.55, ease: EASE },
});

// ── Option primitives ──────────────────────────────────────────────────────
function Pill({
  label,
  selected,
  multi,
  index,
  onClick,
  onDoubleClick,
}: {
  label: string;
  selected: boolean;
  multi: boolean;
  index: number;
  onClick: () => void;
  onDoubleClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-cursor="hover"
      {...optionMotion(index)}
      className={cn(
        "rounded-full border px-5 py-3 text-[0.95rem] tracking-tight transition-colors duration-300 outline-none select-none",
        "focus-visible:border-white/70",
        selected
          ? "border-white/55 bg-white/[0.06] text-white"
          : "border-line text-muted hover:border-white/30 hover:text-white",
      )}
    >
      {label}
    </motion.button>
  );
}

// ── Text inputs ─────────────────────────────────────────────────────────────
function AutoTextarea({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };
  useEffect(resize, [value]);

  return (
    <motion.textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={resize}
      placeholder={placeholder}
      rows={2}
      aria-label="Additional notes"
      {...optionMotion(0)}
      className="w-full resize-none border-b border-line bg-transparent pb-3 text-lead text-white placeholder:text-faint focus:border-white/60 focus:outline-none"
    />
  );
}

function TextField({
  field,
  value,
  index,
  error,
  onChange,
}: {
  field: ContactField;
  value: string;
  index: number;
  error?: string;
  onChange: (v: string) => void;
}) {
  const [touched, setTouched] = useState(false);
  const id = `contact-${field.name}`;
  const errorId = `${id}-error`;
  const showError = touched && !!error;
  return (
    <motion.div {...optionMotion(index)} className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow">
        {field.label}
        {field.optional ? <span className="text-faint"> — optional</span> : null}
      </label>
      <input
        id={id}
        type={field.type}
        inputMode={
          field.type === "tel"
            ? "tel"
            : field.type === "email"
              ? "email"
              : field.type === "url"
                ? "url"
                : undefined
        }
        autoComplete={
          {
            name: "name",
            company: "organization",
            email: "email",
            phone: "tel",
            website: "url",
          }[field.name]
        }
        required={!field.optional}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        className={cn(
          "w-full border-b bg-transparent pb-2.5 text-subtitle text-white placeholder:text-faint focus:outline-none",
          showError
            ? "border-danger focus:border-danger"
            : "border-line focus:border-white/60",
        )}
      />
      {showError ? (
        <p id={errorId} role="alert" className="text-[0.8rem] text-danger">
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}

// ── Field switcher ──────────────────────────────────────────────────────────
export function StepFields({
  step,
  answers,
  honeypot,
  errors,
  onSingle,
  onSingleCommit,
  onToggle,
  onNotes,
  onContact,
  onHoneypot,
}: {
  step: Step;
  answers: Answers;
  honeypot: string;
  errors?: Partial<Record<ContactField["name"], string>>;
  onSingle: (value: string) => void;
  onSingleCommit: (value: string) => void;
  onToggle: (value: string) => void;
  onNotes: (value: string) => void;
  onContact: (name: ContactField["name"], value: string) => void;
  onHoneypot: (value: string) => void;
}) {
  switch (step.kind) {
    case "single": {
      const selected = answers[step.id as "type"] as string | null;
      const note = selected ? step.optionNotes?.[selected] : undefined;
      return (
        <div className="flex flex-col gap-6">
          <div role="radiogroup" aria-label={step.title} className="flex flex-wrap gap-3">
            {step.options.map((opt, i) => (
              <Pill
                key={opt}
                label={opt}
                multi={false}
                index={i}
                selected={selected === opt}
                onClick={() => onSingle(opt)}
                onDoubleClick={() => onSingleCommit(opt)}
              />
            ))}
          </div>
          {(note || step.disclaimer) && (
            <div className="flex flex-col gap-2">
              {/* Per-option scope caption — fades/swaps as the selection changes. */}
              <AnimatePresence mode="wait">
                {note && (
                  <motion.p
                    key={selected}
                    aria-live="polite"
                    initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="max-w-prose text-[0.9rem] leading-relaxed text-muted"
                  >
                    {note}
                  </motion.p>
                )}
              </AnimatePresence>
              {step.disclaimer && (
                <p className="max-w-prose text-[0.8rem] leading-relaxed text-faint">
                  {step.disclaimer}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    case "multi": {
      const selected = (answers[step.id as "goals"] as string[]) ?? [];
      return (
        <div role="group" aria-label={step.title} className="flex flex-wrap gap-3">
          {step.options.map((opt, i) => (
            <Pill
              key={opt}
              label={opt}
              multi
              index={i}
              selected={selected.includes(opt)}
              onClick={() => onToggle(opt)}
            />
          ))}
        </div>
      );
    }
    case "notes":
      return (
        <AutoTextarea
          value={answers.notes}
          placeholder={step.placeholder}
          onChange={onNotes}
        />
      );
    case "contact":
      return (
        <div className="flex flex-col gap-8">
          {step.fields.map((field, i) => (
            <TextField
              key={field.name}
              field={field}
              index={i}
              value={answers.contact[field.name]}
              error={errors?.[field.name]}
              onChange={(v) => onContact(field.name, v)}
            />
          ))}
          {/* Honeypot: off-screen, untabbable, hidden from AT. Bots fill it; humans can't. */}
          <input
            type="text"
            name={HONEYPOT_FIELD}
            value={honeypot}
            onChange={(e) => onHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
        </div>
      );
  }
}

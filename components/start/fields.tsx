"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { Answers, ContactField, Step } from "@/lib/data/onboarding";
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
}: {
  label: string;
  selected: boolean;
  multi: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      data-cursor="hover"
      {...optionMotion(index)}
      className={cn(
        "rounded-full border px-5 py-3 text-[0.95rem] tracking-tight transition-colors duration-300 outline-none",
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
  onChange,
}: {
  field: ContactField;
  value: string;
  index: number;
  onChange: (v: string) => void;
}) {
  const id = `contact-${field.name}`;
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
        className="w-full border-b border-line bg-transparent pb-2.5 text-subtitle text-white placeholder:text-faint focus:border-white/60 focus:outline-none"
      />
    </motion.div>
  );
}

// ── Field switcher ──────────────────────────────────────────────────────────
export function StepFields({
  step,
  answers,
  onSingle,
  onToggle,
  onNotes,
  onContact,
}: {
  step: Step;
  answers: Answers;
  onSingle: (value: string) => void;
  onToggle: (value: string) => void;
  onNotes: (value: string) => void;
  onContact: (name: ContactField["name"], value: string) => void;
}) {
  switch (step.kind) {
    case "single": {
      const selected = answers[step.id as "type"] as string | null;
      return (
        <div role="radiogroup" aria-label={step.title} className="flex flex-wrap gap-3">
          {step.options.map((opt, i) => (
            <Pill
              key={opt}
              label={opt}
              multi={false}
              index={i}
              selected={selected === opt}
              onClick={() => onSingle(opt)}
            />
          ))}
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
              onChange={(v) => onContact(field.name, v)}
            />
          ))}
        </div>
      );
  }
}

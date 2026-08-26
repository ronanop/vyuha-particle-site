"use client";

import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { FluidButton } from "@/components/FluidButton";
import type { ContactContent } from "@/content/contact";

type FormValues = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
};

const empty: FormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
};

const FORMSPREE_ID = "xaewrryg";

const fieldClass =
  "min-h-11 w-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[16px] text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/30 focus:border-cyan-400/50 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.25)] md:text-[15px]";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ContactForm({ content }: { content: ContactContent }) {
  const [state, handleSubmit, reset] = useForm(FORMSPREE_ID);
  const [values, setValues] = useState<FormValues>(empty);
  const [localError, setLocalError] = useState<string | null>(null);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setLocalError(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (values.name.trim().length < 2) {
      event.preventDefault();
      setLocalError("Please enter your name.");
      return;
    }
    if (!isValidEmail(values.email)) {
      event.preventDefault();
      setLocalError("Please enter a valid work email.");
      return;
    }
    if (values.company.trim().length < 2) {
      event.preventDefault();
      setLocalError("Please enter your company name.");
      return;
    }
    if (values.phone.trim().length < 7) {
      event.preventDefault();
      setLocalError("Please enter a valid phone number.");
      return;
    }
    await handleSubmit(event);
  }

  if (state.succeeded) {
    return (
      <div
        className="relative overflow-hidden border border-white/12 bg-white/[0.04] p-8 backdrop-blur-xl md:p-10"
        role="status"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%)]"
        />
        <p className="relative font-display text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
          Message sent
        </p>
        <h3 className="relative mt-4 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-medium tracking-[-0.03em] text-white">
          Thanks — we will follow up soon.
        </h3>
        <p className="relative mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
          Prefer email? Reach us at{" "}
          <a
            className="text-white underline-offset-4 hover:underline"
            href={`mailto:${content.email}`}
          >
            {content.email}
          </a>
          .
        </p>
        <button
          type="button"
          className="relative mt-8 text-[13px] tracking-wide text-white/55 underline-offset-4 hover:text-white hover:underline"
          onClick={() => {
            reset();
            setValues(empty);
            setLocalError(null);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
            Name
          </span>
          <input
            className={fieldClass}
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <ValidationError
            prefix="Name"
            field="name"
            errors={state.errors}
            className="mt-2 text-[13px] text-white/70"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
            Work email
          </span>
          <input
            className={fieldClass}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
            className="mt-2 text-[13px] text-white/70"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
            Company name
          </span>
          <input
            className={fieldClass}
            id="company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            required
          />
          <ValidationError
            prefix="Company"
            field="company"
            errors={state.errors}
            className="mt-2 text-[13px] text-white/70"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
            Phone
          </span>
          <input
            className={fieldClass}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
          />
          <ValidationError
            prefix="Phone"
            field="phone"
            errors={state.errors}
            className="mt-2 text-[13px] text-white/70"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
          Message
        </span>
        <textarea
          className={`${fieldClass} min-h-[160px] resize-y`}
          id="message"
          name="message"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-2 text-[13px] text-white/70"
        />
      </label>

      {localError ? (
        <p className="mt-4 text-[14px] text-white/70" role="alert">
          {localError}
        </p>
      ) : null}

      <ValidationError
        errors={state.errors}
        className="mt-4 text-[14px] text-white/70"
      />

      <div className="mt-8">
        <FluidButton
          text={state.submitting ? "Sending…" : "Send message"}
          type="submit"
          size="md"
          disabled={state.submitting}
          className="w-full sm:w-auto"
        />
      </div>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import { FluidButton } from "@/components/FluidButton";
import type { ContactContent } from "@/content/contact";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const fieldClass =
  "min-h-11 w-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[16px] text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/30 focus:border-cyan-400/50 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.25)] md:text-[15px]";

export function ContactForm({ content }: { content: ContactContent }) {
  const [values, setValues] = useState<FormState>(empty);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      values.name.trim().length > 1 &&
      values.email.includes("@") &&
      values.message.trim().length > 8
    );
  }, [values]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setError("Add your name, a work email, and a short message.");
      return;
    }

    const subject = "Vyuha contact";
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone || "-"}`,
      "",
      values.message,
    ].join("\n");

    window.location.href = `mailto:${content.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
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
          Message ready
        </p>
        <h3 className="relative mt-4 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-medium tracking-[-0.03em] text-white">
          Your mail client should open next.
        </h3>
        <p className="relative mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
          If nothing appears, write us at{" "}
          <a className="text-white underline-offset-4 hover:underline" href={`mailto:${content.email}`}>
            {content.email}
          </a>
          .
        </p>
        <button
          type="button"
          className="relative mt-8 text-[13px] tracking-wide text-white/55 underline-offset-4 hover:text-white hover:underline"
          onClick={() => {
            setSent(false);
            setValues(empty);
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
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
            Work email
          </span>
          <input
            className={fieldClass}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
            Phone
          </span>
          <input
            className={fieldClass}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
          Message
        </span>
        <textarea
          className={`${fieldClass} min-h-[160px] resize-y`}
          name="message"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          required
        />
      </label>

      {error ? (
        <p className="mt-4 text-[14px] text-white/70" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <FluidButton text="Send message" type="submit" size="md" disabled={!canSubmit} className="w-full sm:w-auto" />
        <p className="text-[13px] text-white/40">Opens {content.email}</p>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterTextProps = {
  text: string;
  className?: string;
  lang?: string;
  delayMs?: number;
  charMs?: number;
};

export function TypewriterText({
  text,
  className = "",
  lang,
  delayMs = 600,
  charMs = 160,
}: TypewriterTextProps) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const chars = Array.from(text);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(chars.length);
      setDone(true);
      setStarted(true);
      return;
    }

    let delayTimer = 0;
    let tickTimer = 0;
    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        delayTimer = window.setTimeout(() => {
          if (cancelled) return;
          setStarted(true);
        }, delayMs);
      },
      { threshold: 0.35 },
    );
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(delayTimer);
      window.clearTimeout(tickTimer);
    };
  }, [chars.length, delayMs]);

  useEffect(() => {
    if (!started || done) return;
    if (count >= chars.length) {
      setDone(true);
      return;
    }
    const tick = window.setTimeout(() => setCount((n) => n + 1), charMs);
    return () => window.clearTimeout(tick);
  }, [started, done, count, chars.length, charMs]);

  const visible = chars.slice(0, count).join("");

  return (
    <p ref={rootRef} lang={lang} className={`relative ${className}`.trim()}>
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {visible}
        {started && !done ? (
          <span className="ml-[0.06em] inline-block h-[0.92em] w-[0.08em] translate-y-[0.06em] animate-pulse bg-cyan-300 align-baseline" />
        ) : null}
      </span>
      <span className="sr-only">{text}</span>
    </p>
  );
}

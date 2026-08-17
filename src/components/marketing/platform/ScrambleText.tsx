"use client";

import { useEffect, useRef, useState } from "react";

const DIGITS = "0123456789";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MIX = `${DIGITS}${LETTERS}+×*`;

function randomGlyph(target: string): string {
  if (/\s/.test(target)) return target;
  if (/\d/.test(target)) {
    return DIGITS[Math.floor(Math.random() * DIGITS.length)] ?? "0";
  }
  if (/[A-Za-z]/.test(target)) {
    return LETTERS[Math.floor(Math.random() * LETTERS.length)] ?? "A";
  }
  return MIX[Math.floor(Math.random() * MIX.length)] ?? target;
}

function scrambleFrom(text: string, resolved: number): string {
  return text
    .split("")
    .map((char, i) => (i < resolved ? char : randomGlyph(char)))
    .join("");
}

type ScrambleTextProps = {
  text: string;
  className?: string;
  delay?: number;
  tickMs?: number;
  holdTicks?: number;
};

export function ScrambleText({
  text,
  className = "",
  delay = 0,
  tickMs = 32,
  holdTicks = 2,
}: ScrambleTextProps) {
  const [output, setOutput] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOutput(text);
      return;
    }

    setOutput(scrambleFrom(text, 0));

    let started = false;
    let timer = 0;

    const play = () => {
      let resolved = 0;
      let hold = 0;
      const introTicks = Math.max(8, text.length);

      const tick = () => {
        setOutput(scrambleFrom(text, resolved));
        if (resolved >= text.length) return;
        hold += 1;
        const needed = resolved === 0 ? introTicks : holdTicks;
        if (hold >= needed) {
          hold = 0;
          resolved += 1;
        }
        timer = window.setTimeout(tick, tickMs);
      };

      timer = window.setTimeout(tick, delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        play();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay, holdTicks, text, tickMs]);

  return (
    <span ref={ref} className={className} aria-hidden>
      {output}
    </span>
  );
}

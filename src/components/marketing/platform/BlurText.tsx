"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import "./BlurText.css";

type BlurSnapshot = {
  filter?: string;
  opacity?: number;
  y?: number;
};

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: BlurSnapshot;
  animationTo?: BlurSnapshot[];
  easing?: (value: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

function buildKeyframes(
  from: BlurSnapshot,
  steps: BlurSnapshot[],
): Record<string, Array<string | number>> {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((step) => Object.keys(step)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((key) => {
    const values = [
      from[key as keyof BlurSnapshot],
      ...steps.map((step) => step[key as keyof BlurSnapshot]),
    ].filter((value): value is string | number => value !== undefined);
    keyframes[key] = values;
  });
  return keyframes;
}

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (value) => value,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo<BlurSnapshot>(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo<BlurSnapshot[]>(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from(
    { length: stepCount },
    (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)),
  );

  return (
    <p ref={ref} className={`blur-text ${className}`.trim()}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        return (
          <motion.span
            className="blur-text-segment"
            key={`${segment}-${index}`}
            initial={fromSnapshot}
            animate={inView ? (animateKeyframes as never) : fromSnapshot}
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: easing,
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
}

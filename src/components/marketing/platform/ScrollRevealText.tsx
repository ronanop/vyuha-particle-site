"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import { getLenis } from "@/lib/utils/lenis";

type SplitMode = "Characters" | "Words" | "Lines";
type RevealDirection = "Left to Right" | "Right to Left";
type Trigger = "Scroll" | "On Load";

type SpanUnit = {
  char: string;
  unit: number;
  isSpace: boolean;
};

type WordGroup =
  | { type: "word"; spans: Array<SpanUnit & { idx: number }> }
  | { type: "space"; spans: Array<SpanUnit & { idx: number }> };

export type ScrollRevealTextProps = {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";
  className?: string;
  style?: CSSProperties;
  colorHidden?: string;
  colorRevealed?: string;
  trigger?: Trigger;
  onLoadDuration?: number;
  splitMode?: SplitMode;
  revealDirection?: RevealDirection;
  stagger?: number;
  xOffset?: number;
  yOffset?: number;
  blur?: number;
  rotateX?: number;
  perspective?: number;
  scale?: number;
  offsetStart?: number;
  offsetEnd?: number;
};

export default function ScrollRevealText({
  text,
  tag = "p",
  className = "",
  style,
  colorHidden = "rgba(255,255,255,0.22)",
  colorRevealed = "#f8f5ff",
  trigger = "Scroll",
  onLoadDuration = 1.5,
  splitMode = "Words",
  revealDirection = "Left to Right",
  stagger = 0.3,
  xOffset = 0,
  yOffset = 12,
  blur = 3,
  rotateX = 0,
  perspective = 800,
  scale = 1,
  offsetStart = 80,
  offsetEnd = 20,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isVisible = useRef(false);
  const rafId = useRef(0);
  const progressRef = useRef(0);
  const [lineGroups, setLineGroups] = useState<number[][] | null>(null);

  const isLinesMode = splitMode === "Lines";

  const { allSpans, unitCount, wordGroups } = useMemo(() => {
    const tokens = String(text).split(/(\s+)/);
    const spans: SpanUnit[] = [];
    let unitIdx = 0;

    tokens.forEach((token) => {
      const isSpace = /^\s+$/.test(token);
      const chars = Array.from(token);
      if (isSpace) {
        chars.forEach((ch) => spans.push({ char: ch, unit: -1, isSpace: true }));
      } else if (splitMode === "Words" || splitMode === "Lines") {
        const idx = unitIdx++;
        chars.forEach((ch) => spans.push({ char: ch, unit: idx, isSpace: false }));
      } else {
        chars.forEach((ch) => spans.push({ char: ch, unit: unitIdx++, isSpace: false }));
      }
    });

    const groups: WordGroup[] = [];
    let current: Extract<WordGroup, { type: "word" }> | null = null;

    spans.forEach((span, i) => {
      if (span.isSpace) {
        if (current) {
          groups.push(current);
          current = null;
        }
        groups.push({ type: "space", spans: [{ ...span, idx: i }] });
      } else {
        if (!current) current = { type: "word", spans: [] };
        current.spans.push({ ...span, idx: i });
      }
    });
    if (current) groups.push(current);

    if (revealDirection === "Right to Left" && !isLinesMode) {
      const max = unitIdx - 1;
      spans.forEach((s) => {
        if (!s.isSpace) s.unit = max - s.unit;
      });
    }

    return { allSpans: spans, unitCount: unitIdx, wordGroups: groups };
  }, [text, splitMode, revealDirection, isLinesMode]);

  useEffect(() => {
    if (!isLinesMode) {
      if (lineGroups !== null) setLineGroups(null);
      return;
    }

    const detect = () => {
      const container = containerRef.current;
      if (!container) return;
      const wordEls = container.querySelectorAll<HTMLElement>("[data-wg]");
      if (wordEls.length === 0) return;

      const positions: Array<{ gi: number; top: number }> = [];
      wordEls.forEach((el) => {
        positions.push({
          gi: parseInt(el.dataset.wg ?? "0", 10),
          top: Math.round(el.getBoundingClientRect().top),
        });
      });

      const lineWordGis: number[][] = [];
      let currentLine: number[] = [];
      let lastTop = -Infinity;
      positions.forEach(({ gi, top }) => {
        if (currentLine.length > 0 && Math.abs(top - lastTop) > 3) {
          lineWordGis.push([...currentLine]);
          currentLine = [];
        }
        currentLine.push(gi);
        lastTop = top;
      });
      if (currentLine.length > 0) lineWordGis.push([...currentLine]);

      const lines = lineWordGis.map((wordGis, li) => {
        const start = wordGis[0] ?? 0;
        const end = li < lineWordGis.length - 1 ? (lineWordGis[li + 1]?.[0] ?? wordGroups.length) : wordGroups.length;
        return Array.from({ length: end - start }, (_, k) => start + k);
      });
      if (revealDirection === "Right to Left") lines.reverse();
      setLineGroups(lines);
    };

    const id = requestAnimationFrame(() => requestAnimationFrame(detect));
    return () => cancelAnimationFrame(id);
  }, [text, splitMode, revealDirection, isLinesMode, wordGroups.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (isLinesMode && !lineGroups) return;

    const totalUnits = isLinesMode ? (lineGroups?.length ?? 0) : unitCount;
    if (totalUnits === 0) return;
    if (!isLinesMode) {
      spanRefs.current = spanRefs.current.slice(0, allSpans.length);
      wordRefs.current = wordRefs.current.slice(0, unitCount);
    }

    const dur = 1.15;
    const totalTime = dur + (totalUnits - 1) * stagger;
    const smoothP = (p: number) => p * p * (3 - 2 * p);

    const applyProgress = (scrollP: number) => {
      const time = scrollP * totalTime;
      const setUnit = (el: HTMLElement, unitIdx: number) => {
        const raw =
          totalUnits <= 1
            ? scrollP
            : Math.max(0, Math.min(1, (time - unitIdx * stagger) / dur));
        const p = smoothP(raw);
        const tx = -xOffset + xOffset * p;
        const ty = yOffset * (1 - p);
        let tf = "";
        if (rotateX !== 0) {
          tf = `perspective(${perspective}px) rotateX(${(rotateX * (1 - p)).toFixed(2)}deg) `;
        }
        tf += `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        if (scale < 1) tf += ` scale(${(scale + (1 - scale) * p).toFixed(3)})`;
        el.style.transform = tf;
        el.style.opacity = `${(0.28 + p * 0.72).toFixed(3)}`;
        el.style.filter = blur > 0 ? `blur(${(blur * (1 - p)).toFixed(2)}px)` : "none";
        el.style.color = `color-mix(in srgb, ${colorRevealed} ${(p * 100).toFixed(2)}%, ${colorHidden})`;
      };

      if (isLinesMode) {
        lineRefs.current.forEach((el, lineIdx) => {
          if (el) setUnit(el, lineIdx);
        });
        return;
      }

      if (splitMode === "Words") {
        wordRefs.current.forEach((el, unitIdx) => {
          if (el) setUnit(el, unitIdx);
        });
        return;
      }

      spanRefs.current.forEach((el, i) => {
        if (!el) return;
        const span = allSpans[i];
        if (!span || span.isSpace) return;
        setUnit(el, span.unit);
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      applyProgress(1);
      return;
    }

    if (trigger === "On Load") {
      let started = false;
      applyProgress(0);
      const startAnimation = () => {
        if (started) return;
        started = true;
        const startTime = performance.now();
        const animate = (now: number) => {
          const elapsed = (now - startTime) / 1000;
          const rawP = Math.min(1, elapsed / onLoadDuration);
          applyProgress(1 - Math.pow(1 - rawP, 3));
          if (rawP < 1) rafId.current = requestAnimationFrame(animate);
        };
        rafId.current = requestAnimationFrame(animate);
      };
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            observer.disconnect();
            startAnimation();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(container);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(rafId.current);
      };
    }

    const startFrac = offsetStart / 100;
    const endFrac = offsetEnd / 100;
    let last = performance.now();
    let running = false;

    const readTarget = () => {
      const vh = window.innerHeight;
      const rect = container.getBoundingClientRect();
      const range = (startFrac - endFrac) * vh;
      if (range <= 0) return progressRef.current;
      return Math.max(0, Math.min(1, (startFrac * vh - rect.top) / range));
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = readTarget();
      const ease = 1 - Math.exp(-dt / 0.16);
      progressRef.current += (target - progressRef.current) * ease;
      applyProgress(progressRef.current);

      const stillMoving = Math.abs(target - progressRef.current) > 0.0004;
      if (isVisible.current || stillMoving) {
        rafId.current = requestAnimationFrame(loop);
      } else {
        running = false;
        rafId.current = 0;
      }
    };

    const ensureLoop = () => {
      if (running) return;
      running = true;
      last = performance.now();
      rafId.current = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = Boolean(entry?.isIntersecting);
        if (entry?.isIntersecting) ensureLoop();
      },
      { rootMargin: "280px" },
    );
    observer.observe(container);

    const onScroll = () => {
      if (isVisible.current) ensureLoop();
    };

    const lenis = getLenis();
    lenis?.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    progressRef.current = readTarget();
    applyProgress(progressRef.current);
    ensureLoop();

    return () => {
      running = false;
      observer.disconnect();
      cancelAnimationFrame(rafId.current);
      lenis?.off("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [
    allSpans,
    unitCount,
    lineGroups,
    isLinesMode,
    splitMode,
    stagger,
    xOffset,
    yOffset,
    blur,
    rotateX,
    perspective,
    scale,
    trigger,
    onLoadDuration,
    offsetStart,
    offsetEnd,
    colorHidden,
    colorRevealed,
  ]);

  const Tag = tag as ElementType;

  const renderWordGroup = (group: WordGroup, gi: number) => {
    if (group.type === "word") {
      const unit = group.spans[0]?.unit ?? gi;
      const word = group.spans.map((span) => span.char).join("");
      if (splitMode === "Words") {
        return (
          <span
            key={`w-${gi}`}
            data-wg={gi}
            ref={(el) => {
              wordRefs.current[unit] = el;
            }}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              willChange: "transform, opacity, color, filter",
            }}
          >
            {word}
          </span>
        );
      }
      return (
        <span key={`w-${gi}`} data-wg={gi} style={{ whiteSpace: "nowrap", display: "inline" }}>
          {group.spans.map(({ char, idx }) => (
            <span
              key={idx}
              ref={(el) => {
                spanRefs.current[idx] = el;
              }}
              style={{
                display: "inline-block",
                willChange: isLinesMode ? undefined : "transform, opacity, color, filter",
              }}
            >
              {char}
            </span>
          ))}
        </span>
      );
    }

    return group.spans.map(({ char, idx }) => (
      <span key={idx} style={{ display: "inline" }}>
        {char === " " ? "\u00a0" : char}
      </span>
    ));
  };

  if (isLinesMode && lineGroups) {
    return (
      <Tag ref={containerRef} className={className} style={style}>
        {lineGroups.map((groupIndices, lineIdx) => (
          <div key={lineIdx} style={{ overflow: "hidden", display: "block" }}>
            <div
              ref={(el) => {
                lineRefs.current[lineIdx] = el;
              }}
              style={{ display: "block", willChange: "transform, opacity, filter" }}
            >
              {groupIndices.map((gi) => renderWordGroup(wordGroups[gi]!, gi))}
            </div>
          </div>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={containerRef} className={className} style={style}>
      {wordGroups.map((group, gi) => renderWordGroup(group, gi))}
    </Tag>
  );
}

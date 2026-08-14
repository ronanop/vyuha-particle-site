"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OptionWheel } from "@/components/OptionWheel";
import { prefersReducedMotion } from "@/lib/particles/ParticlePerformance";
import { getLenis } from "@/lib/utils/lenis";

const pillars = [
  {
    num: "01",
    wheel: "Workforce",
    title: "Elevating & Uplifting Your Workforce",
    subtitle: "Supercharging human experience into elite orchestration.",
    feature: "Workforce Amplification Engine",
    intro:
      "Vyuha does not replace your workforce—it upgrades practitioners into elite orchestrators with autonomous agents, HITL gates, and multi-agent collaboration.",
  },
  {
    num: "02",
    wheel: "Intelligence",
    title: "Democratizing Enterprise Intelligence",
    subtitle: "Moving beyond hyperscaler monopolies.",
    feature: "App Store & No-Code Orchestrator",
    intro:
      "Production-grade agentic apps, no-code composition, and intelligent task routing—without massive research teams or prohibitive cloud budgets.",
  },
  {
    num: "03",
    wheel: "Sovereignty",
    title: "Uncompromising Sovereign Infrastructure",
    subtitle: "Your perimeter. Your data. Your intelligence.",
    feature: "Vyuha Box",
    intro:
      "Zero external egress, DPDP Act 2023 alignment, and flexible provisioning across private cloud, on-prem GPU, and air-gapped environments.",
  },
  {
    num: "04",
    wheel: "Context",
    title: "Total Enterprise Context",
    subtitle: "Unified reasoning across your tech stack.",
    feature: "Connectors, DSLMs & Agentic Mesh",
    intro:
      "200+ connectors, domain-specific models, and Agent-to-Agent mesh so agents reason with complete operational and business context.",
  },
];

gsap.registerPlugin(ScrollTrigger);

const PILLAR_COUNT = pillars.length;
const wheelItems = pillars.map((p) => p.wheel);

export function Capabilities() {
  const [active, setActive] = useState(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const reduced = prefersReducedMotion();
  const pillar = pillars[active] ?? pillars[0];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = document.getElementById("pillars");
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.round(window.innerHeight * PILLAR_COUNT)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = Math.min(
          PILLAR_COUNT - 1,
          Math.floor(self.progress * PILLAR_COUNT + 1e-4),
        );
        setActive((prev) => (prev === idx ? prev : idx));
      },
    });
    triggerRef.current = trigger;

    const refresh = () => ScrollTrigger.refresh();
    const introWatch = new MutationObserver(refresh);
    introWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-intro", "data-intro-lock"],
    });
    requestAnimationFrame(refresh);

    return () => {
      introWatch.disconnect();
      trigger.kill();
      triggerRef.current = null;
    };
  }, []);

  const jumpTo = (index: number) => {
    const st = triggerRef.current;
    if (!st) {
      setActive(index);
      return;
    }
    const p = PILLAR_COUNT <= 1 ? 0 : (index + 0.5) / PILLAR_COUNT;
    const y = st.start + (st.end - st.start) * Math.min(1, Math.max(0, p));
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 0.55 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      id="pillars"
      data-section-side="left"
      className="relative z-10 min-h-svh px-6 py-16 md:px-10 md:py-20"
    >
      <div
        aria-hidden
        data-particle-slot="pillars"
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-6">
        <header className="max-w-2xl">
          <p className="mb-4 text-[13px] uppercase tracking-[0.18em] text-white/50">
            Four Core Pillars
          </p>
          <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,4.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
            Built for sovereign enterprise AI.
          </h2>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10">
          <div className="relative h-[min(56svh,520px)] md:h-[min(70svh,640px)]">
            <OptionWheel
              items={wheelItems}
              value={active}
              side="left"
              textColor="#6b7280"
              activeColor="#ffffff"
              fontSize={2.35}
              spacing={1.55}
              curve={1.05}
              tilt={7}
              blur={1.6}
              fade={0.28}
              minOpacity={0.08}
              smoothing={180}
              inset={12}
              loop={false}
              draggable={reduced}
              captureWheel={reduced}
              className="absolute inset-0 h-full w-full"
              onChange={jumpTo}
            />
          </div>

          <div
            key={pillar.num}
            className="flex animate-[pillar-in_380ms_ease-out] flex-col justify-start md:pt-1"
          >
            <span className="font-display text-[14px] tracking-wider text-white/45">
              {pillar.num}
            </span>
            <h3 className="font-display mt-4 max-w-[16ch] text-[clamp(1.75rem,3.2vw,2.85rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
              {pillar.title}
            </h3>
            <p className="mt-4 text-[16px] text-white/55">{pillar.subtitle}</p>
            <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-cyan-300/70">
              {pillar.feature}
            </p>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/60">
              {pillar.intro}
            </p>
            <p className="mt-10 text-[12px] uppercase tracking-[0.16em] text-white/35">
              {reduced ? "Scroll or drag the wheel" : "Scroll to move through pillars"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import OptionWheel from "@/components/marketing/OptionWheel";

type WheelCard = { title: string; body?: string };

export function StandardizeWheel({ cards }: { cards: WheelCard[] }) {
  const [selected, setSelected] = useState(0);
  const active = cards[selected] ?? cards[0];

  return (
    <div className="mt-8 grid items-center gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-10">
      <div className="relative h-[300px] select-none md:h-[360px]">
        {/* Center focus line for the wheel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-y border-white/10 py-[1.1rem]"
        />
        <OptionWheel
          items={cards.map((c) => c.title)}
          defaultSelected={0}
          onChange={(index) => setSelected(index)}
          textColor="#5c6b79"
          activeColor="#67e8f9"
          side="left"
          fontSize={1.7}
          spacing={1.5}
          curve={1}
          tilt={11}
          blur={1.4}
          fade={0.3}
          smoothing={220}
          inset={8}
          loop={false}
          className="font-display"
        />
      </div>

      <div className="relative min-h-[180px] overflow-hidden rounded-[1.25rem] border border-white/12 bg-[#0a1018]/85 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl md:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%)]"
        />
        <div key={selected} className="ow-detail relative">
          <span className="font-display text-[13px] font-medium tracking-[0.2em] text-cyan-300/80">
            {String(selected + 1).padStart(2, "0")} /{" "}
            {String(cards.length).padStart(2, "0")}
          </span>
          <h4 className="font-display mt-3 text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium tracking-[-0.02em] text-white">
            {active.title}
          </h4>
          {active.body ? (
            <p className="mt-3 text-[16px] leading-relaxed text-white/62">
              {active.body}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

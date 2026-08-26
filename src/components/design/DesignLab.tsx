"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FluidButton } from "@/components/FluidButton";
import { OptionWheel } from "@/components/OptionWheel";
import { DesignSection } from "@/components/design/DesignSection";

const NAV = [
  { href: "#foundations", label: "Foundations" },
  { href: "#typography", label: "Typography" },
  { href: "#buttons", label: "Buttons" },
  { href: "#navigation", label: "Navigation" },
  { href: "#option-wheel", label: "Option wheel" },
  { href: "#sections", label: "Sections" },
  { href: "#slots", label: "Next slots" },
] as const;

const COLORS = [
  { name: "Background", varName: "--background", hex: "#000000" },
  { name: "Foreground", varName: "--foreground", hex: "#ffffff" },
  { name: "Secondary", varName: "--foreground-secondary", hex: "#a3a3a3" },
  { name: "Cyan", varName: "--kintsugi", hex: "#22d3ee" },
  { name: "Cyan soft", varName: "--kintsugi-soft", hex: "#67e8f9" },
  { name: "Orange", varName: "--accent-orange", hex: "#f97316" },
  { name: "Blue", varName: "--accent-blue", hex: "#3b82f6" },
] as const;

const WHEEL_ITEMS = [
  "App Store",
  "Agents",
  "AI Tools",
  "Perimeter",
  "Delivery",
  "Demo",
];

function PreviewFrame({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-black/60 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-display text-[11px] uppercase tracking-[0.22em] text-white/40">
          {label}
        </span>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

export function DesignLab() {
  const [wheelIndex, setWheelIndex] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-10 px-6 py-10 md:px-10 lg:gap-14">
      <aside className="sticky top-10 hidden h-fit w-48 shrink-0 lg:block">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[13px] text-white/45 transition-colors hover:text-white"
        >
          ← Site
        </Link>
        <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
          Component lab
        </p>
        <nav aria-label="Design sections">
          <ul className="space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 pb-24">
        <header className="mb-6 border-b border-white/10 pb-10">
          <p className="mb-3 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
            Vyuha.ai
          </p>
          <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight">
            Design
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/55 md:text-base">
            Internal playground for website components. Use this page to
            assemble, compare, and extend UI building blocks before they ship
            on the marketing site.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 lg:hidden">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-white/60"
              >
                {item.label}
              </a>
            ))}
          </div>
        </header>

        <DesignSection
          id="foundations"
          title="Foundations"
          description="Brand color tokens from globals.css. Prefer these variables over hard-coded hex in new components."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {COLORS.map((c) => (
              <div
                key={c.varName}
                className="overflow-hidden rounded-lg border border-white/10"
              >
                <div
                  className="h-20 w-full"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <div className="space-y-0.5 bg-white/[0.03] px-3 py-2.5">
                  <p className="text-[13px] font-medium text-white">{c.name}</p>
                  <p className="font-mono text-[11px] text-white/40">{c.hex}</p>
                  <p className="truncate font-mono text-[10px] text-white/30">
                    {c.varName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DesignSection>

        <DesignSection
          id="typography"
          title="Typography"
          description="Space Grotesk for display. Inter for body. Keep marketing copy sparse, one headline, one supporting line per section."
        >
          <div className="space-y-8">
            <PreviewFrame label="Display: Space Grotesk">
              <p className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight">
                AI that understands your enterprise
              </p>
            </PreviewFrame>
            <PreviewFrame label="Body: Inter">
              <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                Connect knowledge, systems, workflows and teams through one
                intelligent layer. Keep paragraphs short on the live site.
              </p>
              <p className="mt-4 text-[13px] tracking-wide text-white/40">
                Secondary / meta · 13px · tracking-wide
              </p>
            </PreviewFrame>
            <PreviewFrame label="Eyebrow">
              <p className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
                Command center
              </p>
            </PreviewFrame>
          </div>
        </DesignSection>

        <DesignSection
          id="buttons"
          title="FluidButton"
          description="Primary CTA from FluidButton.tsx, rising fill, dual-label slide. Use size sm in the nav; md for section CTAs."
        >
          <div className="flex flex-wrap items-center gap-4">
            <FluidButton text="Book a Demo" href="#buttons" size="md" />
            <FluidButton text="Book a Demo" href="#buttons" size="sm" />
            <FluidButton text="Disabled" size="md" disabled />
            <FluidButton
              text="Cyan fill"
              size="md"
              overlayColor="rgb(34, 211, 238)"
              secondTextColor="rgb(0, 0, 0)"
              borderColor="rgb(34, 211, 238)"
            />
          </div>
          <p className="mt-5 font-mono text-[12px] text-white/35">
            {"import { FluidButton } from \"@/components/FluidButton\""}
          </p>
        </DesignSection>

        <DesignSection
          id="navigation"
          title="Navigation"
          description="Motion Minimal Navs: floating dark shell, cream control bar, expanding menu panel."
        >
          <PreviewFrame label="Header preview" className="!p-0">
            <div className="flex items-start justify-between bg-black p-5">
              <Link href="/" className="inline-flex items-center" aria-label="Vyuha.ai">
                <Image
                  src="/vyuha-logo.png"
                  alt="Vyuha.ai"
                  width={1297}
                  height={393}
                  className="h-7 w-auto"
                />
              </Link>
              <div className="w-[280px] rounded-[24px] bg-[#0f0f11] p-2">
                <div className="flex items-center justify-between rounded-[18px] bg-[#f7f6f3] py-2 pr-2 pl-5">
                  <span className="text-[15px] text-[#0a0a0a]">Menu</span>
                  <span className="rounded-full border border-black/20 px-3 py-1.5 text-[12px] text-[#0a0a0a]/80">
                    Demo
                  </span>
                </div>
              </div>
            </div>
          </PreviewFrame>
        </DesignSection>

        <DesignSection
          id="option-wheel"
          title="OptionWheel"
          description="Scroll / drag picker used for section choosers. Interactive sample below."
        >
          <PreviewFrame label="Live sample">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="relative h-[280px] w-full max-w-xs">
                <OptionWheel
                  items={WHEEL_ITEMS}
                  value={wheelIndex}
                  onChange={(i) => setWheelIndex(i)}
                  activeColor="#22d3ee"
                  className="h-full w-full"
                />
              </div>
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Selected
                </p>
                <p className="mt-2 font-display text-2xl font-medium text-white">
                  {WHEEL_ITEMS[wheelIndex]}
                </p>
                <p className="mt-1 text-[13px] text-white/45">
                  Index {wheelIndex}
                </p>
              </div>
            </div>
          </PreviewFrame>
        </DesignSection>

        <DesignSection
          id="sections"
          title="Section patterns"
          description="SectionFrame places copy left, right, or center in a single column. No empty half for a canvas."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {(
              [
                {
                  side: "left",
                  note: "Copy left-aligned in the max-width column",
                },
                {
                  side: "right",
                  note: "Copy right-aligned in the max-width column",
                },
                {
                  side: "center",
                  note: "Copy centered",
                },
              ] as const
            ).map((item) => (
              <div
                key={item.side}
                className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4"
              >
                <div
                  className={`mb-3 grid h-28 gap-2 rounded-lg bg-black/50 p-2 ${
                    item.side === "center" ? "grid-cols-1" : "grid-cols-3"
                  }`}
                >
                  {item.side === "left" ? (
                    <>
                      <div className="col-span-2 flex items-center justify-center rounded bg-white/10 text-[11px] text-white/70">
                        Copy
                      </div>
                      <div className="rounded bg-white/[0.03]" />
                    </>
                  ) : null}
                  {item.side === "right" ? (
                    <>
                      <div className="rounded bg-white/[0.03]" />
                      <div className="col-span-2 flex items-center justify-center rounded bg-white/10 text-[11px] text-white/70">
                        Copy
                      </div>
                    </>
                  ) : null}
                  {item.side === "center" ? (
                    <div className="flex items-center justify-center rounded bg-white/10 text-[11px] text-white/70">
                      Copy
                    </div>
                  ) : null}
                </div>
                <p className="font-display text-sm font-medium text-white">
                  side=&quot;{item.side}&quot;
                </p>
                <p className="mt-1 text-[12px] text-white/45">{item.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-[12px] text-white/35">
            {"import { SectionFrame } from \"@/components/SectionFrame\""}
          </p>
        </DesignSection>

        <DesignSection
          id="slots"
          title="Next component slots"
          description="Empty anchors for pieces you will wire up here as the site grows. Add a DesignSection when a new shared component lands."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Form inputs / fields",
              "Cards (interaction only)",
              "Modals / dialogs",
              "Toast / status",
              "Data tables",
              "Icon set",
            ].map((label) => (
              <div
                key={label}
                className="flex min-h-[88px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 text-center text-[13px] text-white/35"
              >
                {label}
              </div>
            ))}
          </div>
        </DesignSection>
      </main>
    </div>
  );
}

"use client";

import DriftWall, { type DriftWallItem } from "@/components/DriftWall";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import type { SolutionCta } from "@/content/solutions/types";

const PARTNER_LOGOS: DriftWallItem[] = [
  { image: "/partners/airrived.png", title: "Airrived" },
  { image: "/partners/dell.png", title: "Dell Technologies" },
  { image: "/partners/curate.png", title: "Slash Curate" },
];

const HERO_TILES: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
  const logo = PARTNER_LOGOS[i % PARTNER_LOGOS.length];
  return { ...logo, title: `${logo.title} ${Math.floor(i / PARTNER_LOGOS.length) + 1}` };
});

type PartnersHeroProps = {
  eyebrow: string;
  title: string;
  body: string[];
  ctas: SolutionCta[];
};

export function PartnersHero({ eyebrow, title, body, ctas }: PartnersHeroProps) {
  return (
    <header className="relative min-h-[min(88svh,40rem)] overflow-hidden border-b border-white/10 pb-14 md:min-h-[min(92svh,44rem)] md:pb-20">
      <div className="absolute inset-0 z-0" aria-hidden>
        <DriftWall
          items={HERO_TILES}
          columns={5}
          tileWidth={220}
          tileHeight={146}
          gap={16}
          tilt={14}
          turn={-12}
          perspective={1200}
          depth={100}
          speed={36}
          direction="up"
          variance={0.4}
          parallax={0.55}
          lift={72}
          fade={0.35}
          dim={0.88}
          grayscale={false}
          overlayColor="#000000"
          overlayOpacity={0.12}
          objectFit="contain"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-[1400px] items-center px-6 pt-24 md:px-10 md:pt-28">
        <div className="max-w-2xl origin-left scale-[1.2]">
          <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
            {eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.75),0_1px_4px_rgba(0,0,0,0.9)]">
            {title}
          </h1>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/70 md:text-base [text-shadow:0_2px_18px_rgba(0,0,0,0.7),0_1px_3px_rgba(0,0,0,0.85)]">
            {body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          {ctas.length > 0 ? (
            <div className="mt-8">
              <SolutionCtas ctas={ctas} />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

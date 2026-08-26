"use client";

import Link from "next/link";
import type { CompanyLeader } from "@/content/company/types";

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function displayName(name: string) {
  return name
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type LeaderProfileCardProps = {
  person: CompanyLeader;
};

/**
 * Profile card inspired by social portrait cards: soft frame, hero portrait,
 * name + verified, and a connect CTA.
 */
export function LeaderProfileCard({ person }: LeaderProfileCardProps) {
  const initials = initialsFromName(person.name);
  const label = displayName(person.name);
  const ctaHref = person.ctaHref ?? "/contact";
  const ctaLabel = person.ctaLabel ?? "Connect";

  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2.25rem] border-[5px] border-white/20 bg-neutral-900 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.85)]">
        {/* Portrait field */}
        <div
          className="absolute inset-0"
          style={{
            background: person.image
              ? undefined
              : `radial-gradient(ellipse at 40% 28%, ${person.accentFrom} 0%, transparent 55%), linear-gradient(160deg, ${person.accentFrom} 0%, ${person.accentTo} 72%, #020617 100%)`,
          }}
        >
          {person.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.image}
              alt=""
              className="h-full w-full object-cover object-[center_18%]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-[clamp(4.5rem,18vw,7rem)] font-medium tracking-[-0.06em] text-white/90">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Soft bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/80 via-black/45 to-transparent"
        />

        {/* Bottom: name + verified (left), connect CTA (right) */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-2 px-3 pb-3 pt-8 sm:gap-3 sm:px-4 sm:pb-4">
          <div className="flex min-w-0 max-w-[65%] items-center gap-2">
            <p className="truncate font-display text-[clamp(1rem,2.2vw,1.35rem)] font-semibold tracking-[-0.03em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              {label}
            </p>
            <span
              aria-label="Verified"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#0ea5e9] shadow-sm"
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                <path
                  fill="currentColor"
                  d="M6.7 11.2 3.6 8.1l1.1-1.1 2 2 4.6-4.6 1.1 1.1z"
                />
              </svg>
            </span>
          </div>

          <Link
            href={ctaHref}
            {...(ctaHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold tracking-tight text-[#0a0a0a] shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/linkedin.png"
              alt=""
              width={14}
              height={14}
              className="h-3.5 w-3.5"
              aria-hidden
            />
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

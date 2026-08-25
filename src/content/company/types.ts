import type { SolutionCta } from "@/content/solutions/types";

export type CompanyPillar = {
  title: string;
  body: string;
};

export type CompanyLeader = {
  name: string;
  role: string;
  quote: string;
  paragraphs: string[];
  signoff: string[];
  /** Short social-style handle shown on the profile card. */
  handle: string;
  /** Optional portrait; falls back to initials on a gradient. */
  image?: string;
  /** Accent pair for the placeholder portrait gradient. */
  accentFrom: string;
  accentTo: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type CompanyContent = {
  path: string;
  eyebrow: string;
  displayTitle: [string, string];
  body: string[];
  primaryCtas: SolutionCta[];
  intelligence: {
    title: string;
    pillars: CompanyPillar[];
  };
  why: {
    title: string;
    paragraphs: string[];
    closer: string;
  };
  leadership: {
    title: string;
    people: CompanyLeader[];
  };
  finalCtas: SolutionCta[];
};

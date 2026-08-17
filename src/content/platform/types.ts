import type { SolutionBullet, SolutionCta, SolutionLinkCard } from "@/content/solutions/types";

export type PlatformPillar = {
  title: string;
  body: string;
};

export type PlatformStat = {
  value: string;
  label: string;
};

export type PlatformProblem = {
  index: string;
  title: string;
  body: string;
};

export type PlatformOverviewContent = {
  path: string;
  eyebrow: string;
  title: string;
  displayTitle: [string, string];
  leitmotif: string;
  subtitle: string;
  quote: string;
  body: string[];
  engineName: string;
  primaryCtas: SolutionCta[];
  stats: PlatformStat[];
  problemsTitle: string;
  problems: PlatformProblem[];
  productsIntro: string;
  products: SolutionLinkCard[];
  kintsugiTitle: string;
  kintsugiEyebrow: string;
  kintsugiSignature: string;
  kintsugiBody: string[];
  pillarsTitle: string;
  pillars: PlatformPillar[];
  finalHeadline: string;
  finalCtas: SolutionCta[];
};

export type PlatformProductContent = {
  path: string;
  eyebrow: string;
  title: string;
  headline: string;
  body: string[];
  primaryCtas: SolutionCta[];
  sections: {
    title: string;
    intro?: string;
    items: SolutionBullet[];
    closer?: string;
  }[];
  finalCtas: SolutionCta[];
};

import type { SolutionBullet, SolutionCta, SolutionLinkCard } from "@/content/solutions/types";

export type PlatformPillar = {
  title: string;
  body: string;
  items?: string[];
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
  problemsIntro?: string;
  problems: PlatformProblem[];
  productsIntro: string;
  products: SolutionLinkCard[];
  kintsugiTitle: string;
  kintsugiEyebrow: string;
  kintsugiSignature?: string;
  kintsugiBody: string[];
  pillarsTitle: string;
  pillarsIntro?: string;
  pillars: PlatformPillar[];
  finalHeadline: string;
  finalBody?: string;
  finalCtas: SolutionCta[];
};

export type PlatformProductCard = {
  title: string;
  body?: string;
  items?: string[];
};

export type PlatformCompareTable = {
  headers: string[];
  rows: string[][];
};

export type PlatformProductSection = {
  title: string;
  intro?: string;
  paragraphs?: string[];
  items?: SolutionBullet[];
  cards?: PlatformProductCard[];
  cardsColumns?: 2 | 3;
  table?: PlatformCompareTable;
  closer?: string;
  cta?: SolutionCta;
};

export type PlatformProductContent = {
  path: string;
  eyebrow: string;
  title: string;
  headline: string;
  body: string[];
  primaryCtas: SolutionCta[];
  sections: PlatformProductSection[];
  finalHeadline?: string;
  finalBody?: string;
  finalCtas: SolutionCta[];
};

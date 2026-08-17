import type { SolutionBullet, SolutionCta, SolutionLinkCard } from "@/content/solutions/types";

export type PlatformPillar = {
  title: string;
  body: string;
};

export type PlatformOverviewContent = {
  path: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  quote: string;
  body: string[];
  primaryCtas: SolutionCta[];
  productsIntro: string;
  products: SolutionLinkCard[];
  kintsugiTitle: string;
  kintsugiBody: string[];
  pillarsTitle: string;
  pillars: PlatformPillar[];
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

export type SolutionCta = {
  label: string;
  href: string;
};

export type SolutionBullet = string;

export type SolutionLinkCard = {
  title: string;
  headline: string;
  body: string;
  href: string;
  cta: string;
};

export type MarketingCard = {
  title: string;
  headline?: string;
  body?: string;
  items?: string[];
  itemsLabel?: string;
  outcomes?: string[];
  outcome?: string;
  cta?: SolutionCta;
  comingSoon?: boolean;
};

export type MarketingStat = {
  value: string;
  label: string;
};

export type MarketingSection = {
  id?: string;
  title?: string;
  headline?: string;
  intro?: string;
  paragraphs?: string[];
  items?: string[];
  cards?: MarketingCard[];
  cardsColumns?: 2 | 3 | 4;
  stats?: MarketingStat[];
  pendingNotice?: string;
  closer?: string;
  closerLines?: string[];
  cta?: SolutionCta;
};

export type MarketingPageContent = {
  path: string;
  eyebrow: string;
  title: string;
  headline?: string;
  quote?: string;
  body: string[];
  primaryCtas: SolutionCta[];
  sections: MarketingSection[];
  finalEyebrow?: string;
  finalHeadline?: string;
  finalBody?: string;
  finalCtas?: SolutionCta[];
};

export type SolutionsFunction = SolutionLinkCard & {
  index: string;
  way: string;
};

export type SolutionsReplacement = {
  index: string;
  title: string;
  body: string;
};

export type SolutionsIndustry = {
  title: string;
  headline: string;
  body: string;
  icon: string;
};

export type SolutionsOverviewContent = {
  path: string;
  eyebrow: string;
  title: string;
  displayTitle: [string, string];
  leitmotif: string;
  quote: string;
  body: string[];
  primaryCtas: SolutionCta[];
  functionsTitle: string;
  functionsIntro: string;
  functions: SolutionsFunction[];
  replaceTitle: string;
  replaceIntro: string;
  replacements: SolutionsReplacement[];
  replaceCloser: string;
  industriesTitle: string;
  industriesIntro: string;
  industries: SolutionsIndustry[];
  industriesCta: SolutionCta;
  finalHeadline: string;
  finalBody: string;
  finalCtas: SolutionCta[];
};

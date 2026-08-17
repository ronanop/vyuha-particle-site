export type SolutionCta = {
  label: string;
  href: string;
};

export type SolutionBullet = string;

export type SolutionCapability = {
  title: string;
  eyebrow: string;
  body: string;
  outcomes: SolutionBullet[];
};

export type SolutionIndustry = {
  title: string;
  headline: string;
  body: string;
  howHelps: SolutionBullet[];
  outcome: string;
  comingSoon?: boolean;
};

export type SolutionLinkCard = {
  title: string;
  headline: string;
  body: string;
  href: string;
  cta: string;
};

export type SolutionsOverviewContent = {
  path: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  quote: string;
  body: string[];
  primaryCtas: SolutionCta[];
  functionsIntro: string;
  functions: SolutionLinkCard[];
  replaceTitle: string;
  replaceBody: string;
  replaceItems: SolutionBullet[];
  replaceCloser: string;
  sovereigntyTitle: string;
  sovereigntyBody: string[];
  finalCtas: SolutionCta[];
};

export type SolutionsFunctionContent = {
  path: string;
  eyebrow: string;
  title: string;
  headline: string;
  body: string[];
  primaryCtas: SolutionCta[];
  pillars?: SolutionBullet[];
  capabilitiesTitle: string;
  capabilitiesIntro?: string;
  capabilities: SolutionCapability[];
  whyTitle: string;
  whyItems: SolutionBullet[];
  impactTitle: string;
  impactItems: SolutionBullet[];
  integrations?: string;
  audience?: string;
  finalCtas: SolutionCta[];
};

export type SolutionsIndustryContent = {
  path: string;
  eyebrow: string;
  title: string;
  headline: string;
  body: string;
  industries: SolutionIndustry[];
  foundationTitle: string;
  foundationBody: string;
  finalCtas: SolutionCta[];
};

import type { Metadata } from "next";

export const SITE_NAME = "Vyuha.ai";
export const SITE_TAGLINE =
  "Sovereign Agentic AI for the Enterprise";
export const DEFAULT_DESCRIPTION =
  "Vyuha is the enterprise agentic platform for Cybersecurity, IT, FinOps, and Business Operations, with controlled autonomy inside your private perimeter.";

export const SITE_KEYWORDS = [
  "Vyuha",
  "Vyuha.ai",
  "sovereign AI",
  "agentic AI",
  "enterprise AI",
  "private cloud AI",
  "on-premise AI",
  "cybersecurity AI",
  "IT operations AI",
  "FinOps",
  "DPDP Act",
  "India AI",
  "Airrived Engine",
] as const;

export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("https://www.vyuha.ai");
}

export function getSiteOrigin(): string {
  return getSiteUrl().origin;
}

/** Keep meta descriptions in a useful SERP length. */
export function truncateMeta(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}…`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogType = "website",
}: PageMetaInput): Metadata {
  const descriptionSafe = truncateMeta(description);
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const keywordList = Array.from(
    new Set([...SITE_KEYWORDS, ...keywords].map((k) => k.trim()).filter(Boolean)),
  );

  return {
    title,
    description: descriptionSafe,
    keywords: keywordList,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: descriptionSafe,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptionSafe,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function organizationJsonLd() {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: SITE_NAME,
    legalName: "Vyuha.ai",
    url: origin,
    logo: `${origin}/vyuha-logo.png`,
    image: `${origin}/vyuha-logo.png`,
    email: "hello@vyuha.ai",
    telephone: "+91-11-4108-2200",
    description: DEFAULT_DESCRIPTION,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "Agentic AI",
      "Enterprise AI",
      "Cybersecurity",
      "IT Operations",
      "FinOps",
      "Data sovereignty",
    ],
  };
}

export function websiteJsonLd() {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: SITE_NAME,
    url: origin,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${origin}/#organization` },
    inLanguage: "en-IN",
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, origin).toString(),
    })),
  };
}

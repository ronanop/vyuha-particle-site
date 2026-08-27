import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

type JsonLdProps = {
  data?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function serializeJsonLd(
  payload: Record<string, unknown> | Array<Record<string, unknown>>,
): string {
  // Escape `<` so a string value cannot break out of </script>
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

/** Renders JSON-LD for search engines. Defaults to Organization + WebSite. */
export function JsonLd({ data }: JsonLdProps) {
  const payload = data ?? [organizationJsonLd(), websiteJsonLd()];
  return (
    <script type="application/ld+json">{serializeJsonLd(payload)}</script>
  );
}

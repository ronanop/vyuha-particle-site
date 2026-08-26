import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

type JsonLdProps = {
  data?: Record<string, unknown> | Array<Record<string, unknown>>;
};

/** Renders JSON-LD for search engines. Defaults to Organization + WebSite. */
export function JsonLd({ data }: JsonLdProps) {
  const payload = data ?? [organizationJsonLd(), websiteJsonLd()];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape `<` so a future string value cannot break out of </script>
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

import Link from "next/link";
import { flattenSiteMap, SITE_MAP, type SiteNode } from "@/lib/sitemap";

function padIndex(n: number) {
  return String(n).padStart(2, "0");
}

function SitemapLink({
  node,
  variant,
}: {
  node: SiteNode;
  variant: "hub" | "leaf";
}) {
  const isHub = variant === "hub";
  return (
    <Link
      href={node.path}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-baseline justify-between gap-6 py-2"
    >
      <span
        className={
          isHub
            ? "font-display text-[clamp(1.35rem,2.2vw,1.85rem)] font-medium tracking-[-0.03em] text-white transition-colors group-hover:text-cyan-300"
            : "text-[15px] text-white/70 transition-colors group-hover:text-white"
        }
      >
        {node.title}
      </span>
      <span
        className={`shrink-0 font-mono text-[11px] tracking-wide transition-colors ${
          isHub
            ? "text-white/35 group-hover:text-cyan-300/80"
            : "text-white/25 group-hover:text-white/50"
        }`}
      >
        {node.path}
      </span>
    </Link>
  );
}

export function SitemapView() {
  const pageCount = flattenSiteMap().length;

  return (
    <article>
      <header className="relative overflow-hidden border-b border-white/10 pb-14 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,211,238,0.12),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.08),transparent_50%)]"
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-24 md:px-10 md:pt-28">
          <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
            Index
          </p>
          <h1 className="max-w-4xl font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-white">
            Sitemap
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base">
            Every public page on Vyuha.ai — {pageCount} routes, grouped the same
            way as the site.
          </p>
        </div>
      </header>

      <nav aria-label="Sitemap" className="py-14 md:py-20">
        <ol className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-6 md:grid-cols-2 md:gap-x-16 md:gap-y-14 md:px-10">
          {SITE_MAP.map((node, i) => (
            <li key={node.path} className="border-t border-white/10 pt-6">
              <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-white/35">
                {padIndex(i + 1)}
              </p>
              <SitemapLink node={node} variant="hub" />
              {node.children?.length ? (
                <ul className="mt-3 space-y-1 border-l border-white/10 pl-4">
                  {node.children.map((child) => (
                    <li key={child.path}>
                      <SitemapLink node={child} variant="leaf" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
    </article>
  );
}

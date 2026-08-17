import Link from "next/link";
import type { SiteNode } from "@/lib/sitemap";

type PlaceholderPageProps = {
  title: string;
  path: string;
  /** Optional child links for hub pages — structure only, no copy. */
  childrenNodes?: SiteNode[];
};

/**
 * Empty shell for routes that do not have content yet.
 * Title + path only; child links when this is a section hub.
 */
export function PlaceholderPage({
  title,
  path,
  childrenNodes,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 md:px-10">
      <p className="mb-3 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-white/35">
        {path}
      </p>
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-[14px] text-white/40">
        Content coming soon.
      </p>

      {childrenNodes && childrenNodes.length > 0 ? (
        <ul className="mt-12 space-y-3 border-t border-white/10 pt-10">
          {childrenNodes.map((child) => (
            <li key={child.path}>
              <Link
                href={child.path}
                className="group flex items-baseline justify-between gap-4 text-[15px] text-white/70 transition-colors hover:text-white"
              >
                <span>{child.title}</span>
                <span className="font-mono text-[11px] text-white/30 transition-colors group-hover:text-white/50">
                  {child.path}
                </span>
              </Link>
              {child.children && child.children.length > 0 ? (
                <ul className="mt-2 space-y-2 border-l border-white/10 pl-4">
                  {child.children.map((grand) => (
                    <li key={grand.path}>
                      <Link
                        href={grand.path}
                        className="group flex items-baseline justify-between gap-4 text-[14px] text-white/50 transition-colors hover:text-white"
                      >
                        <span>{grand.title}</span>
                        <span className="font-mono text-[11px] text-white/25">
                          {grand.path}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

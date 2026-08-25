import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/sitemap";

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/[0.08] bg-black">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-6 py-3.5 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-10">
        <div className="flex items-center justify-between gap-6 sm:justify-start">
          <Link
            href="/"
            className="font-display text-[11px] font-medium tracking-[0.22em] text-white/70 transition-colors hover:text-white"
          >
            VYUHA.AI
          </Link>
          <p className="text-[11px] tracking-wide text-white/30 sm:hidden">
            © {new Date().getFullYear()}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-[11px] tracking-[0.12em] text-white/40 transition-colors hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <p className="hidden text-[11px] tracking-wide text-white/30 sm:block">
          © {new Date().getFullYear()} Vyuha.ai
        </p>
      </div>
    </footer>
  );
}

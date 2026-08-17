"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FluidButton } from "@/components/FluidButton";
import { PRIMARY_NAV } from "@/lib/sitemap";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="nav-chrome pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/25">
      <nav className="pointer-events-auto mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href={isHome ? "#top" : "/"}
          className="inline-flex items-center"
          aria-label="Vyuha.ai"
        >
          <Image
            src="/vyuha-logo.png"
            alt="Vyuha.ai"
            width={1297}
            height={393}
            className="h-7 w-auto md:h-8"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {PRIMARY_NAV.filter((item) => item.path !== "/book-a-demo").map(
            (item) => {
              const active =
                pathname === item.path ||
                pathname.startsWith(`${item.path}/`);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`text-[13px] tracking-wide transition-colors hover:text-white ${
                      active ? "text-white" : "text-white/55"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            },
          )}
        </ul>

        <FluidButton text="Book a Demo" href="/book-a-demo" size="sm" />
      </nav>
    </header>
  );
}

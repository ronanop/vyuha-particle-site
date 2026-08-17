"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { FluidButton } from "@/components/FluidButton";
import { PRIMARY_NAV } from "@/lib/sitemap";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const links = PRIMARY_NAV.filter((item) => item.path !== "/book-a-demo");

  return (
    <header className="nav-chrome pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/25">
      <nav className="pointer-events-auto mx-auto flex max-w-[1400px] items-center justify-between gap-3 py-4 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-10 md:py-5">
        <Link
          href={isHome ? "#top" : "/"}
          className="inline-flex min-h-11 items-center"
          aria-label="Vyuha.ai"
          onClick={() => setOpen(false)}
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
          {links.map((item) => {
            const active =
              pathname === item.path || pathname.startsWith(`${item.path}/`);
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
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <FluidButton
            text="Book a Demo"
            href="/book-a-demo"
            size="sm"
            className="hidden sm:inline-flex"
          />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-white transition-transform ${
                  open ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[5px] block h-[1.5px] w-4 bg-white transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-white transition-transform ${
                  open ? "top-[5px] -rotate-45" : "top-[10px]"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id={menuId}
          className="pointer-events-auto border-t border-white/10 bg-black/95 lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1400px] flex-col gap-1 px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {links.map((item) => {
              const active =
                pathname === item.path ||
                pathname.startsWith(`${item.path}/`);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex min-h-11 items-center text-[15px] tracking-wide ${
                      active ? "text-white" : "text-white/70"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
            <li className="pt-3 sm:hidden">
              <FluidButton
                text="Book a Demo"
                href="/book-a-demo"
                className="w-full"
              />
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

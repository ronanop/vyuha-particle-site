"use client";

import Image from "next/image";
import { FluidButton } from "@/components/FluidButton";

const links = [
  { href: "#command", label: "Command" },
  { href: "#box", label: "Vyuha Box" },
  { href: "#pillars", label: "Pillars" },
  { href: "#founders", label: "Founders" },
];

export function Navigation() {
  return (
    <header className="nav-chrome pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/25">
      <nav className="pointer-events-auto mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="inline-flex items-center" aria-label="Vyuha.ai">
          <Image
            src="/vyuha-logo.png"
            alt="Vyuha.ai"
            width={1297}
            height={393}
            className="h-7 w-auto md:h-8"
            priority
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] tracking-wide text-white/55 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <FluidButton text="Book a Demo" href="#demo" size="sm" />
      </nav>
    </header>
  );
}

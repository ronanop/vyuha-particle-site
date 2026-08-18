"use client";

import { useEffect, type ReactNode } from "react";
import { Navigation } from "@/components/Navigation";

/**
 * Shared chrome for marketing routes (everything except / and /design).
 * Clears the home intro lock so secondary pages are immediately interactive.
 */
export function MarketingShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.intro = "ready";
    delete document.documentElement.dataset.introLock;
    document.documentElement.style.overflow = "";
  }, []);

  return (
    <div className="marketing-shell min-h-svh bg-black text-white">
      <Navigation />
      <main className="relative z-10 pt-24 md:pt-28">{children}</main>
    </div>
  );
}

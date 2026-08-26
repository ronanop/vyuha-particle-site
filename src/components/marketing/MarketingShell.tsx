"use client";

import { useEffect, type ReactNode } from "react";
import { ViewTransition } from "react";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Shared chrome for marketing routes (everything except /).
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
      <ViewTransition name="site-header">
        <Navigation />
      </ViewTransition>
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}

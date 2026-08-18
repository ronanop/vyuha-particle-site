"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Design lab is outside the home intro path.
 * Root layout boots with data-intro="loading"; clear that here.
 */
export function DesignShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.intro = "ready";
    delete document.documentElement.dataset.introLock;
    document.documentElement.style.overflow = "";
  }, []);

  return (
    <div className="design-lab min-h-svh bg-[#050505] text-white">{children}</div>
  );
}

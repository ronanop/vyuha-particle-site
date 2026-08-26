import { ViewTransition, type ReactNode } from "react";

const pageMotion = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  "page-fade": "page-fade",
  default: "page-fade",
} as const;

/**
 * Soft page enter/exit for route changes.
 * Must wrap *page* content (template / page), not a persistent layout —
 * layouts do not remount, so enter/exit would never fire.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={pageMotion}
      exit={pageMotion}
      default="page-fade"
    >
      {children}
    </ViewTransition>
  );
}

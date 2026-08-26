import { ViewTransition, type ReactNode } from "react";

const directionalSlide = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      name="page-content"
      enter="auto"
      exit="auto"
      share={directionalSlide}
    >
      {children}
    </ViewTransition>
  );
}

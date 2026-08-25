import { ViewTransition, type ReactNode } from "react";

const directionalSlide: Record<string, string> = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

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

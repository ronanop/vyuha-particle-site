import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DesignShell } from "@/components/design/DesignShell";

export const metadata: Metadata = {
  title: "Design — Vyuha component lab",
  description:
    "Internal playground for Vyuha website components, tokens, and patterns.",
  robots: { index: false, follow: false },
};

export default function DesignLayout({ children }: { children: ReactNode }) {
  return <DesignShell>{children}</DesignShell>;
}

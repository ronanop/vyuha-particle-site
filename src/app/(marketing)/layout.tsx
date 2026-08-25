import type { ReactNode } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PageTransition } from "@/components/ui/PageTransition";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      <MarketingShell>{children}</MarketingShell>
    </PageTransition>
  );
}

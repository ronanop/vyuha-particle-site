import type { ReactNode } from "react";
import { PageTransition } from "@/components/ui/PageTransition";

/**
 * Remounts on every navigation within (marketing), so page enter/exit
 * view transitions actually run. Shell (nav/footer) stays in layout.
 */
export default function MarketingTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}

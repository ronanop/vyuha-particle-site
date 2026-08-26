import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist. Return to the Vyuha.ai homepage.",
  robots: {
    index: false,
    follow: false,
  },
};

/** Used when `notFound()` is thrown inside marketing routes (e.g. unpublished pages). */
export default function MarketingNotFound() {
  return <NotFoundView />;
}

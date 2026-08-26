import type { Metadata } from "next";
import { SolutionsOverviewView } from "@/components/marketing/solutions/SolutionsViews";
import { solutionsOverview } from "@/content/solutions/overview";
import {
  SOLUTIONS_TUNNEL_IMAGES,
  SOLUTIONS_TUNNEL_POSTER,
} from "@/lib/marketing/hero-prefetch";

export const metadata: Metadata = {
  title: "Solutions | Vyuha.ai",
  description: solutionsOverview.body[0],
};

export default function SolutionsPage() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={SOLUTIONS_TUNNEL_POSTER}
        type="image/webp"
      />
      {SOLUTIONS_TUNNEL_IMAGES.slice(0, 3).map((href) => (
        <link
          key={href}
          rel="preload"
          as="image"
          href={href}
          type="image/webp"
        />
      ))}
      <SolutionsOverviewView content={solutionsOverview} />
    </>
  );
}

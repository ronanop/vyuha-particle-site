"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { getNavTransitionTypes } from "@/lib/nav-transition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "transitionTypes"> & {
  /** Force a specific transition; otherwise inferred from sitemap order. */
  transitionTypes?: string[];
};

/**
 * next/link with automatic forward / back / fade transition types.
 */
export function TransitionLink({
  href,
  transitionTypes,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const pathname = usePathname() || "/";
  const target = typeof href === "string" ? href : href.pathname || "/";
  const types =
    transitionTypes ??
    (target.startsWith("/") && !target.startsWith("//")
      ? getNavTransitionTypes(pathname, target)
      : ["page-fade"]);

  return (
    <Link
      href={href}
      transitionTypes={types}
      onClick={onClick}
      {...rest}
    />
  );
}

"use client";

import { PRIMARY_NAV } from "@/lib/sitemap";
import { StaggeredMenu } from "@/components/StaggeredMenu";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  ...PRIMARY_NAV.map((item) => ({
    label: item.title,
    ariaLabel: `Go to ${item.title}`,
    link: item.path,
  })),
];

export function Navigation() {
  return (
    <StaggeredMenu
      position="right"
      isFixed
      items={menuItems}
      displaySocials={false}
      displayItemNumbering
      menuButtonColor="#fff"
      openMenuButtonColor="#111"
      changeMenuColorOnOpen
      colors={["#B497CF", "#5227FF"]}
      logoUrl="/vyuha-logo.png"
      accentColor="#22d3ee"
    />
  );
}

import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "agent-id"?: string;
        variant?: "tiny" | "compact" | "full" | "expandable";
        placement?:
          | "top-left"
          | "top"
          | "top-right"
          | "bottom-left"
          | "bottom"
          | "bottom-right";
        "show-avatar-when-collapsed"?: string;
        "avatar-orb-color-1"?: string;
        "avatar-orb-color-2"?: string;
      };
    }
  }
}

export {};

"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/** Self-hosted pinned widget (see scripts/copy-elevenlabs-widget.mjs). */
const WIDGET_SRC = "/vendor/elevenlabs-convai-widget-0.16.4.js";

const AGENT_ID = "agent_4801m0ymjmwffvqs873vpnp8cscr";

const MOBILE_MQ = "(max-width: 767px)";

const MOBILE_FAB_STYLE_ID = "vyuha-convai-mobile-fab";

const MOBILE_FAB_CSS = `
  button[aria-label="Message"],
  button[aria-label*="message" i] {
    width: 3rem !important;
    height: 3rem !important;
    min-width: 3rem !important;
    min-height: 3rem !important;
    padding: 0 !important;
    border-radius: 9999px !important;
    background: #0f172a !important;
    border: 1px solid rgba(34, 211, 238, 0.55) !important;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.55) !important;
    color: #67e8f9 !important;
  }
`;

function ensureMobileFabStyle(host: Element) {
  const root = (host as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot;
  if (!root || root.getElementById(MOBILE_FAB_STYLE_ID)) return Boolean(root);
  const style = document.createElement("style");
  style.id = MOBILE_FAB_STYLE_ID;
  style.textContent = MOBILE_FAB_CSS;
  root.appendChild(style);
  return true;
}

export function ElevenLabsConvai() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    let cancelled = false;
    let tries = 0;
    const tick = () => {
      if (cancelled) return;
      const host = document.querySelector("elevenlabs-convai");
      if (host && ensureMobileFabStyle(host)) return;
      if (tries++ < 40) window.setTimeout(tick, 250);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [isMobile]);

  return (
    <>
      <elevenlabs-convai
        agent-id={AGENT_ID}
        variant={isMobile ? "tiny" : "compact"}
        placement="bottom-right"
        show-avatar-when-collapsed="true"
        avatar-orb-color-1="#22d3ee"
        avatar-orb-color-2="#67e8f9"
      />
      <Script src={WIDGET_SRC} strategy="lazyOnload" />
    </>
  );
}

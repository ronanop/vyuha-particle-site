import Script from "next/script";

/** Self-hosted pinned widget (see scripts/copy-elevenlabs-widget.mjs). */
const WIDGET_SRC = "/vendor/elevenlabs-convai-widget-0.16.4.js";

const AGENT_ID = "agent_4801m0ymjmwffvqs873vpnp8cscr";

export function ElevenLabsConvai() {
  return (
    <>
      <elevenlabs-convai agent-id={AGENT_ID} />
      <Script src={WIDGET_SRC} strategy="lazyOnload" />
    </>
  );
}

import Script from "next/script";

const AGENT_ID = "agent_4801m0ymjmwffvqs873vpnp8cscr";

export function ElevenLabsConvai() {
  return (
    <>
      <elevenlabs-convai agent-id={AGENT_ID} />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
      />
    </>
  );
}

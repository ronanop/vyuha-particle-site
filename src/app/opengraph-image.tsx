import { ImageResponse } from "next/og";

export const alt = "Vyuha.ai — Sovereign Agentic AI for the Enterprise";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(ellipse at 20% 0%, #0b3a45 0%, #050505 45%, #000 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#67e8f9",
            fontWeight: 600,
          }}
        >
          VYUHA.AI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              maxWidth: 900,
            }}
          >
            Sovereign Agentic AI for the Enterprise
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 820,
            }}
          >
            Controlled autonomy inside your private perimeter.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.08em",
          }}
        >
          www.vyuha.ai
        </div>
      </div>
    ),
    size,
  );
}

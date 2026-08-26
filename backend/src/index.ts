import "dotenv/config";
import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT) || 4000;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const API_KEY = process.env.ELEVENLABS_API_KEY;

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (!AGENT_ID || !API_KEY) {
  console.warn(
    "[vyuha-backend] Missing ELEVENLABS_AGENT_ID or ELEVENLABS_API_KEY — signed-url route will fail until set.",
  );
}

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "vyuha-backend" });
});

/**
 * Mint a short-lived WebSocket signed URL for a private ElevenLabs agent.
 * Text-only clients must use this (not the WebRTC conversation token).
 */
app.get("/api/signed-url", async (req, res) => {
  if (!AGENT_ID || !API_KEY) {
    res.status(500).json({ error: "ElevenLabs credentials are not configured" });
    return;
  }

  try {
    const url = new URL(
      "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url",
    );
    url.searchParams.set("agent_id", AGENT_ID);

    const response = await fetch(url, {
      headers: { "xi-api-key": API_KEY },
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[signed-url] ElevenLabs error", response.status, detail);
      res.status(502).json({ error: "Failed to get signed URL" });
      return;
    }

    const data = (await response.json()) as { signed_url?: string };
    if (!data.signed_url) {
      res.status(502).json({ error: "Signed URL missing from ElevenLabs response" });
      return;
    }

    // Client session id (optional) — echoes back so the UI can correlate.
    const clientSessionId =
      typeof req.query.sessionId === "string" && req.query.sessionId.length > 0
        ? req.query.sessionId
        : randomUUID();

    res.json({
      signedUrl: data.signed_url,
      sessionId: clientSessionId,
      expiresInSeconds: 900,
    });
  } catch (error) {
    console.error("[signed-url]", error);
    res.status(500).json({ error: "Failed to get signed URL" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[vyuha-backend] listening on http://0.0.0.0:${PORT}`);
});

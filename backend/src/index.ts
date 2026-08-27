import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { randomUUID, timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST ?? "127.0.0.1";
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const API_KEY = process.env.ELEVENLABS_API_KEY;
const SIGNED_URL_SECRET = process.env.SIGNED_URL_SECRET;

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (!AGENT_ID || !API_KEY) {
  console.warn(
    "[vyuha-backend] Missing ELEVENLABS_AGENT_ID or ELEVENLABS_API_KEY — signed-url route will fail until set.",
  );
}

if (!SIGNED_URL_SECRET) {
  console.warn(
    "[vyuha-backend] Missing SIGNED_URL_SECRET — /api/signed-url will reject all requests until set.",
  );
}

const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, try again later" },
});

app.use(globalLimiter);
app.use(
  cors({
    origin(origin, callback) {
      // Browser requests must present an allowlisted Origin.
      // Non-browser clients (no Origin) are permitted only because
      // /api/signed-url still requires SIGNED_URL_SECRET.
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
app.use(express.json({ limit: "32kb" }));

const healthLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", healthLimiter, (_req, res) => {
  res.json({ ok: true, service: "vyuha-backend" });
});

function secretsEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

function requireSignedUrlSecret(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  if (!SIGNED_URL_SECRET) {
    res.status(503).json({ error: "Signed URL auth is not configured" });
    return;
  }

  const header = req.get("authorization");
  const bearer =
    header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  const apiKeyHeader = req.get("x-api-key")?.trim() ?? "";
  const token = bearer || apiKeyHeader;

  if (!token || !secretsEqual(token, SIGNED_URL_SECRET)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

const signedUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many signed-url requests, try again later" },
});

/**
 * Mint a short-lived WebSocket signed URL for a private ElevenLabs agent.
 * Requires Bearer / X-Api-Key = SIGNED_URL_SECRET. Rate limited.
 */
app.get(
  "/api/signed-url",
  signedUrlLimiter,
  requireSignedUrlSecret,
  async (req, res) => {
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

      const clientSessionId =
        typeof req.query.sessionId === "string" && req.query.sessionId.length > 0
          ? req.query.sessionId.slice(0, 128)
          : randomUUID();

      res.json({
        signedUrl: data.signed_url,
        sessionId: clientSessionId,
        expiresInSeconds: 900,
      });
    } catch {
      console.error("[signed-url] request failed");
      res.status(500).json({ error: "Failed to get signed URL" });
    }
  },
);

app.listen(PORT, HOST, () => {
  console.log(`[vyuha-backend] listening on http://${HOST}:${PORT}`);
});

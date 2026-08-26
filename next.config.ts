import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Defense-in-depth headers. CSP allows self-hosted scripts, Google Fonts,
 * and ElevenLabs Convai network endpoints the widget needs at runtime.
 * `unsafe-eval` is limited to development (Next HMR / Turbopack).
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self' https://formspree.io",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https://*.elevenlabs.io",
      "worker-src 'self' blob:",
      "connect-src 'self' https://formspree.io https://*.elevenlabs.io wss://*.elevenlabs.io https://api.elevenlabs.io",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(self), payment=()",
  },
];

const nextConfig: NextConfig = {
  // LAN / phone preview — Next blocks /_next from non-localhost hosts in dev
  allowedDevOrigins: ["172.*.*.*", "192.168.*.*", "10.*.*.*"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/book-a-demo",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/company/about",
        destination: "/company",
        permanent: true,
      },
      {
        source: "/company/team",
        destination: "/company",
        permanent: true,
      },
      {
        source: "/solutions/use-cases/security",
        destination: "/solutions/security-compliance",
        permanent: true,
      },
      {
        source: "/solutions/use-cases/it",
        destination: "/solutions/it-operations",
        permanent: true,
      },
      {
        source: "/solutions/industries/financial-services",
        destination: "/solutions/industry-use-cases",
        permanent: true,
      },
      {
        source: "/solutions/industries/telecom",
        destination: "/solutions/industry-use-cases",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN / phone preview — Next blocks /_next from non-localhost hosts in dev
  allowedDevOrigins: ["172.*.*.*", "192.168.*.*", "10.*.*.*"],
};

export default nextConfig;

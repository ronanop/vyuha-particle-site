import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN / phone preview — Next blocks /_next from non-localhost hosts in dev
  allowedDevOrigins: ["172.*.*.*", "192.168.*.*", "10.*.*.*"],
  async redirects() {
    return [
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

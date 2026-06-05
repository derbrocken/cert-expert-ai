import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // B4.5a / B4.5b — logo + form fields via generateDocument Server Action (default is 1mb)
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;

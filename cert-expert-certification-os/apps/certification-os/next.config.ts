import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // B4.5a — logo + form fields via generateDocument Server Action (default is 1mb)
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

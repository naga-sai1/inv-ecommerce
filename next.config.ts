import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "firkztlwgktrvtmwfmxf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["firkztlwgktrvtmwfmxf.supabase.co", "placeholder.com"],
    unoptimized: true,
  },
};

export default nextConfig;

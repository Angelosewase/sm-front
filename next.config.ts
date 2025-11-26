import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost", process.env.NEXT_PUBLIC_API_URL ?? ''].filter(
      Boolean
    ),
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3030',                  // your backend port
        pathname: '/uploads/**',       // optional: restrict to uploads folder
      },
    ],
    
  },
  };

export default nextConfig;

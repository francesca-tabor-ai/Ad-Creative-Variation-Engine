import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@acve/shared", "@acve/db", "@acve/ai"],
};

export default nextConfig;

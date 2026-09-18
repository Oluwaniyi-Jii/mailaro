import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";
import path from "node:path";

loadEnvConfig(path.resolve(process.cwd(), "../.."));

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

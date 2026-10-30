import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Permite a next/image servir las fotos subidas al bucket público product-images
    remotePatterns: supabaseUrl
      ? [new URL(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/**`)]
      : [],
  },
};

export default nextConfig;

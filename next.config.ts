import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ⚠️ Warning: Disables ESLint during production builds (e.g. on Vercel)
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gowiaewbjsdsvihqmsyg.supabase.co",
        pathname: "/storage/v1/object/public/avatars/**",
      },
      {
        protocol: "https",
        hostname: "gowiaewbjsdsvihqmsyg.supabase.co",
        pathname: "/storage/v1/object/public/assets/**",
      },
      {
        protocol: "https",
        hostname: "gowiaewbjsdsvihqmsyg.supabase.co",
        pathname: "/storage/v1/object/public/student-documents/**",
      },
      {
        protocol: "https",
        hostname: "gowiaewbjsdsvihqmsyg.supabase.co",
        pathname: "/storage/v1/object/public/course-images/**",
      },
    ],
  },
};

export default nextConfig;

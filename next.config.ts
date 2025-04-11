import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gowiaewbjsdsvihqmsyg.supabase.co',
        pathname: '/storage/v1/object/public/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'gowiaewbjsdsvihqmsyg.supabase.co',
        pathname: '/storage/v1/object/public/assets/**',
      },
      // Add more buckets here
    ],
  },
}

export default nextConfig

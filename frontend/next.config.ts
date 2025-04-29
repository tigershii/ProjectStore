import type { NextConfig } from "next";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ]
  },
  images: {
    domains: ['tiger-ecommerce-images.s3.amazonaws.com']
  }
};

export default nextConfig;

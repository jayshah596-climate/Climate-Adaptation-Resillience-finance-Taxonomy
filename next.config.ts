import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Prevent webpack from bundling SheetJS native addon
  serverExternalPackages: ['xlsx'],
  // Ensure Excel files are bundled into Vercel serverless functions
  outputFileTracingIncludes: {
    '/api/pgim': ['./PGIM/**/*.xlsx'],
    '/api/vmc': ['./VMC/**/*.xlsx'],
  },
}

export default nextConfig

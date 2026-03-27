import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ensure agents/ markdown files are included in Vercel deployment
  outputFileTracingIncludes: {
    '/api/generate': ['./agents/**/*'],
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig

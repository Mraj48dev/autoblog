import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Disabilita ESLint durante il build di produzione
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disabilita TypeScript errors durante il build se necessario
    ignoreBuildErrors: false,
  },
}

export default nextConfig

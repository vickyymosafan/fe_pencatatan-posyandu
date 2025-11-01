import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * Optimized for production deployment
 */
const nextConfig: NextConfig = {
  /* ============================================
   * PRODUCTION OPTIMIZATIONS
   * ============================================ */
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Compress output files
  compress: true,

  // Generate standalone output for optimized Docker deployments
  // output: 'standalone',

  /* ============================================
   * IMAGE OPTIMIZATION
   * ============================================ */
  images: {
    // Allowed image domains (add your backend domain here)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/uploads/**',
      },
      // Add your production backend domain here
      // {
      //   protocol: 'https',
      //   hostname: 'your-backend-domain.com',
      //   pathname: '/uploads/**',
      // },
    ],
    // Image formats to support
    formats: ['image/avif', 'image/webp'],
    // Disable image optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  /* ============================================
   * SECURITY HEADERS
   * ============================================ */
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  /* ============================================
   * TYPESCRIPT CONFIGURATION
   * ============================================ */
  typescript: {
    // Fail build on TypeScript errors in production
    ignoreBuildErrors: false,
  },



  /* ============================================
   * EXPERIMENTAL FEATURES
   * ============================================ */
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  /* ============================================
   * TURBOPACK CONFIGURATION (Next.js 16+)
   * ============================================ */
  turbopack: {
    // Rules for module resolution
    resolveAlias: {
      // Add custom aliases if needed
      // '@': './src',
    },
    // Resolve extensions
    resolveExtensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
    // Module rules for loaders
    rules: {
      // Custom rules can be added here
      // Example: handle specific file types
    },
  },

  /* ============================================
   * WEBPACK CONFIGURATION (Fallback)
   * ============================================ */
  webpack: (config) => {
    // Custom webpack configuration if needed
    
    // Ignore source map warnings from third-party packages
    config.ignoreWarnings = [
      { module: /node_modules/ },
    ];

    return config;
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable dev indicators and reduce logging noise
  devIndicators: false,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Exclude OpenTelemetry from server bundle
  serverExternalPackages: [
    '@opentelemetry/api',
    '@opentelemetry/core', 
    '@opentelemetry/sdk-node',
    '@opentelemetry/exporter-trace-otlp-http',
  ],
  // Include WASM files for crypto packages used in wallet generation
  outputFileTracingIncludes: {
    '/api/customer-wallet/create': ['./node_modules/tiny-secp256k1/**/*.wasm'],
  },
  // Empty turbopack config to use Turbopack (Next.js 16 default)
  turbopack: {},
  async headers() {
    return [
      {
        // Force revalidation on all HTML pages (prevents stale cached pages)
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://js.stripe.com https://crypto-js.stripe.com https://merchant-ui-api.stripe.com https://*.changelly.com https://widget.changelly.com https://*.moonpay.com https://*.transak.com https://*.launchdarkly.com https://maps.googleapis.com https://*.googleapis.com https://va.vercel-scripts.com https://static.cloudflareinsights.com https://js.authorize.net https://jstest.authorize.net https://*.authorize.net https://vercel.live https://*.vercel.live",
              "style-src 'self' 'unsafe-inline' https://*.stripe.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https: wss:",
              "font-src 'self' https: data:",
              "frame-src https://*.stripe.com https://js.stripe.com https://crypto-js.stripe.com https://merchant-ui-api.stripe.com https://hooks.stripe.com https://*.changelly.com https://widget.changelly.com https://*.moonpay.com https://buy.moonpay.com https://wallet.moonpay.com https://*.transak.com https://global.transak.com https://accept.authorize.net https://test.authorize.net https://*.authorize.net",
              "frame-ancestors 'self'",
              "child-src https://*.stripe.com https://js.stripe.com https://crypto-js.stripe.com https://accept.authorize.net https://test.authorize.net https://*.authorize.net blob:",
            ].join('; ')
          }
        ]
      },
      {
        // Allow caching for static assets (JS/CSS/images have hashed filenames so they auto-bust)
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  }
}

export default nextConfig

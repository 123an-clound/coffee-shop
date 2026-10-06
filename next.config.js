const supabaseUrl = new URL(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtizooyjnllostamffpp.supabase.co'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: supabaseUrl.hostname },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  async headers() {
    const supabaseHost = supabaseUrl.origin
    const scriptSrc = process.env.NODE_ENV === 'development'
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'"
    // script-src needs 'unsafe-inline' because Next.js App Router injects
    // inline bootstrap/hydration <script> tags (the __next_f RSC-streaming
    // payload) that a strict script-src would block, breaking hydration on
    // every page. Removing 'unsafe-inline' requires a nonce-based CSP wired
    // through middleware.ts — out of scope for this pass; every other
    // directive below still meaningfully reduces blast radius (no remote
    // script/object sources, no foreign form submission).
    const csp = [
      "default-src 'self'",
      `img-src 'self' data: blob: https://images.unsplash.com ${supabaseHost}`,
      `connect-src 'self' ${supabaseHost}`,
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      'frame-src https://www.google.com https://maps.google.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

module.exports = nextConfig

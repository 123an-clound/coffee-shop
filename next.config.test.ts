import { describe, it, expect } from 'vitest'
import nextConfig from './next.config.js'

describe('next.config headers', () => {
  it('applies baseline security headers to every route', async () => {
    const rules = (await nextConfig.headers!()) as Array<{
      source: string
      headers: Array<{ key: string; value: string }>
    }>
    const global = rules.find((r) => r.source === '/(.*)')!
    expect(global).toBeDefined()

    const byKey = Object.fromEntries(
      global.headers.map((h: { key: string; value: string }) => [h.key, h.value])
    )

    expect(byKey['X-Content-Type-Options']).toBe('nosniff')
    expect(byKey['X-Frame-Options']).toBe('DENY')
    expect(byKey['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(byKey['Permissions-Policy']).toContain('camera=()')
    expect(byKey['Strict-Transport-Security']).toContain('max-age=')
    expect(byKey['Content-Security-Policy']).toContain("frame-ancestors 'none'")
    expect(byKey['Content-Security-Policy']).toContain('frame-src https://www.google.com https://maps.google.com')
    expect(byKey['Content-Security-Policy']).toContain("default-src 'self'")
    if (process.env.NODE_ENV === 'development') {
      expect(byKey['Content-Security-Policy']).toContain("'unsafe-eval'")
    } else {
      expect(byKey['Content-Security-Policy']).not.toContain("'unsafe-eval'")
    }
  })
})

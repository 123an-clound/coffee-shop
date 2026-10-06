import { describe, expect, it } from 'vitest'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings'
import { siteSettingsSchema } from './site-settings'

function withSettings(patch: Record<string, unknown>) {
  return { ...DEFAULT_SITE_SETTINGS, ...patch }
}

describe('siteSettingsSchema', () => {
  it('accepts the default website configuration', () => {
    expect(siteSettingsSchema.safeParse(DEFAULT_SITE_SETTINGS).success).toBe(true)
  })

  it('rejects images outside the supported public storage path', () => {
    const badImage = 'https://jtizooyjnllostamffpp.supabase.co/auth/v1/verify?token=secret'
    const result = siteSettingsSchema.safeParse(withSettings({
      home: { ...DEFAULT_SITE_SETTINGS.home, heroImageUrl: badImage },
    }))
    expect(result.success).toBe(false)
  })

  it('rejects low contrast theme colors', () => {
    const result = siteSettingsSchema.safeParse(withSettings({
      theme: { ...DEFAULT_SITE_SETTINGS.theme, ink: DEFAULT_SITE_SETTINGS.theme.background },
    }))
    expect(result.success).toBe(false)
  })

  it('rejects accent colors that make white button labels unreadable', () => {
    const result = siteSettingsSchema.safeParse(withSettings({
      theme: { ...DEFAULT_SITE_SETTINGS.theme, accent: '#999999' },
    }))
    expect(result.success).toBe(false)
  })

  it('rejects non Google Maps iframe URLs', () => {
    const result = siteSettingsSchema.safeParse(withSettings({
      contact: { ...DEFAULT_SITE_SETTINGS.contact, mapUrl: 'https://example.com/embed' },
    }))
    expect(result.success).toBe(false)
  })

  it('rejects an enabled announcement with no message', () => {
    const result = siteSettingsSchema.safeParse(withSettings({
      announcement: { enabled: true, text: '', href: '' },
    }))
    expect(result.success).toBe(false)
  })
})

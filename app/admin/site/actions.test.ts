import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings'

const { upsert, from, supabase } = vi.hoisted(() => {
  const upsert = vi.fn().mockResolvedValue({ error: null })
  const from = vi.fn().mockReturnValue({ upsert })
  return { upsert, from, supabase: { from } }
})

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue(supabase),
}))
vi.mock('@/lib/supabase/require-admin', () => ({
  requireAdmin: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { requireAdmin } from '@/lib/supabase/require-admin'
import { revalidatePath } from 'next/cache'
import { saveSiteSettingsAction } from './actions'

describe('saveSiteSettingsAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('blocks a non admin before writing', async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(saveSiteSettingsAction(DEFAULT_SITE_SETTINGS)).rejects.toThrow('Unauthorized')
    expect(from).not.toHaveBeenCalled()
  })

  it('rejects invalid settings without writing', async () => {
    const result = await saveSiteSettingsAction({ ...DEFAULT_SITE_SETTINGS, brand: { name: '' } })

    expect(result.ok).toBe(false)
    expect(from).not.toHaveBeenCalled()
  })

  it('persists valid settings and refreshes the public site', async () => {
    const result = await saveSiteSettingsAction(DEFAULT_SITE_SETTINGS)

    expect(result).toEqual({ ok: true })
    expect(from).toHaveBeenCalledWith('coffee_site_settings')
    expect(upsert).toHaveBeenCalledWith(
      { id: 1, settings: DEFAULT_SITE_SETTINGS },
      { onConflict: 'id' }
    )
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
  })
})

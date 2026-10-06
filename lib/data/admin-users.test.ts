import { describe, it, expect, vi } from 'vitest'
import { isAdminUser } from './admin-users'

describe('isAdminUser', () => {
  it('returns true when a matching row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { user_id: 'u1' }, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const supabase = { from: vi.fn().mockReturnValue({ select }) } as any

    expect(await isAdminUser(supabase, 'u1')).toBe(true)
    expect(supabase.from).toHaveBeenCalledWith('coffee_admin_users')
    expect(eq).toHaveBeenCalledWith('user_id', 'u1')
  })

  it('returns false when no matching row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const supabase = { from: vi.fn().mockReturnValue({ select }) } as any

    expect(await isAdminUser(supabase, 'u2')).toBe(false)
  })
})

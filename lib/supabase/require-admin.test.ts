import { describe, it, expect, vi } from 'vitest'
import { requireAdmin } from './require-admin'
import { isAdminUser } from '@/lib/data/admin-users'

vi.mock('@/lib/data/admin-users', () => ({
  isAdminUser: vi.fn(),
}))

describe('requireAdmin', () => {
  it('throws when there is no authenticated user', async () => {
    const supabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as any

    await expect(requireAdmin(supabase)).rejects.toThrow('Unauthorized')
    expect(isAdminUser).not.toHaveBeenCalled()
  })

  it('throws when the user exists but is not an admin', async () => {
    vi.mocked(isAdminUser).mockResolvedValue(false)
    const supabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }) },
    } as any

    await expect(requireAdmin(supabase)).rejects.toThrow('Unauthorized')
    expect(isAdminUser).toHaveBeenCalledWith(supabase, 'u1')
  })

  it('resolves without throwing when the user is an admin', async () => {
    vi.mocked(isAdminUser).mockResolvedValue(true)
    const supabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }) },
    } as any

    await expect(requireAdmin(supabase)).resolves.toBeUndefined()
  })
})

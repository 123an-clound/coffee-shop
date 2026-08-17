import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/lib/supabase/require-admin', () => ({
  requireAdmin: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/data/menu-items', () => ({
  createMenuItem: vi.fn(),
  updateMenuItem: vi.fn(),
  deleteMenuItem: vi.fn(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createMenuItemAction } from './actions'
import { createMenuItem } from '@/lib/data/menu-items'

describe('createMenuItemAction', () => {
  it('rejects invalid input without calling createMenuItem', async () => {
    await expect(
      createMenuItemAction({
        category_id: 'not-a-uuid',
        name: '',
        description: '',
        price: -1,
        image_url: '',
        is_available: true,
        is_featured: false,
        display_order: 0,
      })
    ).rejects.toThrow()
    expect(createMenuItem).not.toHaveBeenCalled()
  })
})

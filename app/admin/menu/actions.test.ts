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
import { requireAdmin } from '@/lib/supabase/require-admin'

const validInput = {
  category_id: '11111111-1111-4111-8111-111111111111',
  name: 'Cà Phê Sữa Đá',
  description: 'Vị béo ngậy của sữa đặc hòa cùng cà phê phin đậm đà.',
  price: 45000,
  image_url: '',
  is_available: true,
  is_featured: false,
  display_order: 0,
}

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

  it('rejects a valid input when requireAdmin fails, without calling createMenuItem', async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(createMenuItemAction(validInput)).rejects.toThrow()
    expect(createMenuItem).not.toHaveBeenCalled()
  })
})

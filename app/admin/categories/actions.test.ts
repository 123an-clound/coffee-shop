import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/lib/supabase/require-admin', () => ({
  requireAdmin: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/data/categories', () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createCategoryAction } from './actions'
import { createCategory } from '@/lib/data/categories'

describe('createCategoryAction', () => {
  it('rejects invalid input without calling createCategory', async () => {
    await expect(
      createCategoryAction({ name: '', slug: 'BAD SLUG', display_order: -1 })
    ).rejects.toThrow()
    expect(createCategory).not.toHaveBeenCalled()
  })
})

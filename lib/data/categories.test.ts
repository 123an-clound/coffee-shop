import { describe, it, expect, vi } from 'vitest'
import { getCategories, createCategory, updateCategory, deleteCategory } from './categories'

function makeSupabaseMock(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result)
  const select = vi.fn().mockReturnValue({ order })
  const single = vi.fn().mockResolvedValue(result)
  const eq = vi.fn().mockReturnValue({ single })
  const insertSelect = vi.fn().mockReturnValue({ single })
  const insert = vi.fn().mockReturnValue({ select: insertSelect })
  const updateEq = vi.fn().mockReturnValue({ select: insertSelect })
  const update = vi.fn().mockReturnValue({ eq: updateEq })
  const deleteEq = vi.fn().mockResolvedValue(result)
  const del = vi.fn().mockReturnValue({ eq: deleteEq })
  return {
    from: vi.fn().mockReturnValue({ select, insert, update, delete: del, eq }),
    _select: select,
    _insert: insert,
    _update: update,
    _delete: del,
  }
}

describe('getCategories', () => {
  it('returns categories ordered by display_order', async () => {
    const categories = [{ id: '1', name: 'Cà phê', slug: 'ca-phe', display_order: 0 }]
    const supabase = makeSupabaseMock({ data: categories, error: null })

    const result = await getCategories(supabase as any)

    expect(supabase.from).toHaveBeenCalledWith('categories')
    expect(result).toEqual(categories)
  })

  it('throws when Supabase returns an error', async () => {
    const supabase = makeSupabaseMock({ data: null, error: new Error('db down') })
    await expect(getCategories(supabase as any)).rejects.toThrow('db down')
  })
})

describe('createCategory', () => {
  it('inserts a category and returns the created row', async () => {
    const created = { id: '1', name: 'Trà', slug: 'tra', display_order: 1 }
    const supabase = makeSupabaseMock({ data: created, error: null })

    const result = await createCategory(supabase as any, {
      name: 'Trà',
      slug: 'tra',
      display_order: 1,
    })

    expect(supabase._insert).toHaveBeenCalledWith([
      { name: 'Trà', slug: 'tra', display_order: 1 },
    ])
    expect(result).toEqual(created)
  })
})

describe('updateCategory', () => {
  it('updates a category by id and returns the updated row', async () => {
    const updated = { id: '1', name: 'Trà sữa', slug: 'tra', display_order: 1 }
    const supabase = makeSupabaseMock({ data: updated, error: null })

    const result = await updateCategory(supabase as any, '1', { name: 'Trà sữa' })

    expect(supabase._update).toHaveBeenCalledWith({ name: 'Trà sữa' })
    expect(result).toEqual(updated)
  })
})

describe('deleteCategory', () => {
  it('deletes a category by id', async () => {
    const supabase = makeSupabaseMock({ data: null, error: null })
    await deleteCategory(supabase as any, '1')
    expect(supabase._delete).toHaveBeenCalled()
  })
})

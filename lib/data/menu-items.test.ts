import { describe, it, expect, vi } from 'vitest'
import {
  getMenuItems,
  getFeaturedMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from './menu-items'

const sampleItem = {
  id: '1',
  category_id: 'cat-1',
  name: 'Cà Phê Đen Đá',
  description: 'Đậm đà',
  price: 39000,
  image_url: 'https://images.unsplash.com/x',
  is_available: true,
  is_featured: false,
  display_order: 0,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

function makeChain(finalResult: { data: unknown; error: unknown }) {
  const chain: any = {}
  const methods = ['select', 'eq', 'order', 'insert', 'update', 'delete']
  methods.forEach((m) => {
    chain[m] = vi.fn().mockReturnValue(chain)
  })
  chain.single = vi.fn().mockResolvedValue(finalResult)
  chain.then = (resolve: any) => Promise.resolve(finalResult).then(resolve)
  return chain
}

describe('getMenuItems', () => {
  it('returns all available data without a filter', async () => {
    const chain = makeChain({ data: [sampleItem], error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    const result = await getMenuItems(supabase)

    expect(supabase.from).toHaveBeenCalledWith('menu_items')
    expect(result).toEqual([sampleItem])
  })

  it('filters by category id when categoryId is provided', async () => {
    const chain = makeChain({ data: [sampleItem], error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    await getMenuItems(supabase, { categoryId: 'cat-1' })

    expect(chain.eq).toHaveBeenCalledWith('category_id', 'cat-1')
  })
})

describe('getFeaturedMenuItems', () => {
  it('filters by is_featured and limits the result', async () => {
    const chain = makeChain({ data: [sampleItem], error: null })
    chain.limit = vi.fn().mockReturnValue(chain)
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    const result = await getFeaturedMenuItems(supabase, 4)

    expect(chain.eq).toHaveBeenCalledWith('is_featured', true)
    expect(chain.limit).toHaveBeenCalledWith(4)
    expect(result).toEqual([sampleItem])
  })
})

describe('createMenuItem', () => {
  it('inserts a menu item and returns the created row', async () => {
    const chain = makeChain({ data: sampleItem, error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any
    const { id, created_at, updated_at, ...input } = sampleItem

    const result = await createMenuItem(supabase, input)

    expect(chain.insert).toHaveBeenCalledWith([input])
    expect(result).toEqual(sampleItem)
  })
})

describe('updateMenuItem', () => {
  it('updates a menu item by id', async () => {
    const chain = makeChain({ data: { ...sampleItem, price: 42000 }, error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    const result = await updateMenuItem(supabase, '1', { price: 42000 })

    expect(chain.update).toHaveBeenCalledWith({ price: 42000 })
    expect(chain.eq).toHaveBeenCalledWith('id', '1')
    expect(result.price).toBe(42000)
  })
})

describe('deleteMenuItem', () => {
  it('deletes a menu item by id', async () => {
    const chain = makeChain({ data: null, error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    await deleteMenuItem(supabase, '1')

    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', '1')
  })
})

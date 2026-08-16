import { describe, it, expect } from 'vitest'
import { filterMenuItems } from './filter-menu-items'
import type { MenuItem } from '@/lib/types'

function makeItem(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: '1',
    category_id: 'cat-1',
    name: 'Cà Phê Đen Đá',
    description: 'Đậm đà, thơm nồng',
    price: 39000,
    image_url: '',
    is_available: true,
    is_featured: false,
    display_order: 0,
    created_at: '',
    updated_at: '',
    ...overrides,
  }
}

describe('filterMenuItems', () => {
  const items = [
    makeItem({ id: '1', category_id: 'cat-1', name: 'Cà Phê Đen Đá' }),
    makeItem({ id: '2', category_id: 'cat-2', name: 'Trà Sen Vàng' }),
    makeItem({ id: '3', category_id: 'cat-1', name: 'Bạc Xỉu' }),
  ]

  it('returns all items when no filters are given', () => {
    expect(filterMenuItems(items, {})).toHaveLength(3)
  })

  it('filters by categoryId', () => {
    const result = filterMenuItems(items, { categoryId: 'cat-1' })
    expect(result.map((i) => i.id)).toEqual(['1', '3'])
  })

  it('filters by case-insensitive, accent-insensitive search on name', () => {
    const result = filterMenuItems(items, { search: 'ca phe' })
    expect(result.map((i) => i.id)).toEqual(['1'])
  })

  it('combines categoryId and search', () => {
    const result = filterMenuItems(items, { categoryId: 'cat-1', search: 'bac' })
    expect(result.map((i) => i.id)).toEqual(['3'])
  })

  it('normalizes Vietnamese Đ/đ, which NFD does not decompose, in search', () => {
    const result = filterMenuItems(items, { search: 'den' })
    expect(result.map((i) => i.id)).toEqual(['1'])
  })
})

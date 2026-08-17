import { describe, it, expect } from 'vitest'
import { parseMenuItemInput } from './menu-item'

const validInput = {
  category_id: '11111111-1111-4111-8111-111111111111',
  name: 'Cà Phê Sữa Đá',
  description: 'Vị béo ngậy của sữa đặc hòa cùng cà phê phin đậm đà.',
  price: 45000,
  image_url: 'https://example.supabase.co/storage/v1/object/public/menu-images/a.jpg',
  is_available: true,
  is_featured: false,
  display_order: 0,
}

describe('parseMenuItemInput', () => {
  it('accepts a fully valid input and trims name/description', () => {
    const result = parseMenuItemInput({
      ...validInput,
      name: '  Cà Phê Sữa Đá  ',
    })
    expect(result.name).toBe('Cà Phê Sữa Đá')
  })

  it('accepts an empty image_url', () => {
    const result = parseMenuItemInput({ ...validInput, image_url: '' })
    expect(result.image_url).toBe('')
  })

  it('rejects a blank name', () => {
    expect(() => parseMenuItemInput({ ...validInput, name: '   ' })).toThrow()
  })

  it('rejects a name longer than 120 characters', () => {
    expect(() => parseMenuItemInput({ ...validInput, name: 'a'.repeat(121) })).toThrow()
  })

  it('rejects a description longer than 2000 characters', () => {
    expect(() =>
      parseMenuItemInput({ ...validInput, description: 'a'.repeat(2001) })
    ).toThrow()
  })

  it('rejects a non-positive price', () => {
    expect(() => parseMenuItemInput({ ...validInput, price: 0 })).toThrow()
    expect(() => parseMenuItemInput({ ...validInput, price: -1 })).toThrow()
  })

  it('rejects a price above the sanity ceiling', () => {
    expect(() => parseMenuItemInput({ ...validInput, price: 100_000_001 })).toThrow()
  })

  it('rejects a category_id that is not a UUID', () => {
    expect(() => parseMenuItemInput({ ...validInput, category_id: 'not-a-uuid' })).toThrow()
  })

  it('rejects an image_url that is not http(s)', () => {
    expect(() =>
      parseMenuItemInput({ ...validInput, image_url: 'javascript:alert(1)' })
    ).toThrow()
  })

  it('rejects a negative display_order', () => {
    expect(() => parseMenuItemInput({ ...validInput, display_order: -1 })).toThrow()
  })
})

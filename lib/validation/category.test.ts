import { describe, it, expect } from 'vitest'
import { parseCategoryInput } from './category'

const validInput = {
  name: 'Cà phê phin truyền thống',
  slug: 'ca-phe-phin',
  display_order: 0,
}

describe('parseCategoryInput', () => {
  it('accepts a fully valid input and trims name', () => {
    const result = parseCategoryInput({ ...validInput, name: '  Cà phê phin truyền thống  ' })
    expect(result.name).toBe('Cà phê phin truyền thống')
  })

  it('rejects a blank name', () => {
    expect(() => parseCategoryInput({ ...validInput, name: '   ' })).toThrow()
  })

  it('rejects a name longer than 80 characters', () => {
    expect(() => parseCategoryInput({ ...validInput, name: 'a'.repeat(81) })).toThrow()
  })

  it('rejects a slug with uppercase or invalid characters', () => {
    expect(() => parseCategoryInput({ ...validInput, slug: 'Ca-Phe' })).toThrow()
    expect(() => parseCategoryInput({ ...validInput, slug: 'ca_phe' })).toThrow()
  })

  it('rejects a blank slug', () => {
    expect(() => parseCategoryInput({ ...validInput, slug: '' })).toThrow()
  })

  it('rejects a negative display_order', () => {
    expect(() => parseCategoryInput({ ...validInput, display_order: -1 })).toThrow()
  })
})

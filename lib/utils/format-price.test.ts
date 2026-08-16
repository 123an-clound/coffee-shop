import { describe, it, expect } from 'vitest'
import { formatPriceVND } from './format-price'

describe('formatPriceVND', () => {
  it('formats thousands with a dot separator and a đ suffix', () => {
    expect(formatPriceVND(39000)).toBe('39.000đ')
  })

  it('formats large numbers correctly', () => {
    expect(formatPriceVND(1250000)).toBe('1.250.000đ')
  })
})

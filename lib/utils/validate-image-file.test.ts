import { describe, it, expect } from 'vitest'
import { validateImageFile } from './validate-image-file'

const JPEG_HEADER = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0])
const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const WEBP_HEADER = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
])
const NOT_AN_IMAGE = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]) // "%PDF-1.4"

const FIVE_MB = 5 * 1024 * 1024

describe('validateImageFile', () => {
  it('accepts a JPEG within the size limit', () => {
    const result = validateImageFile(JPEG_HEADER, 1024)
    expect(result).toEqual({ ok: true, extension: 'jpg', contentType: 'image/jpeg' })
  })

  it('accepts a PNG within the size limit', () => {
    const result = validateImageFile(PNG_HEADER, 1024)
    expect(result).toEqual({ ok: true, extension: 'png', contentType: 'image/png' })
  })

  it('accepts a WEBP within the size limit', () => {
    const result = validateImageFile(WEBP_HEADER, 1024)
    expect(result).toEqual({ ok: true, extension: 'webp', contentType: 'image/webp' })
  })

  it('rejects a file whose bytes are not a recognized image format, regardless of size', () => {
    const result = validateImageFile(NOT_AN_IMAGE, 1024)
    expect(result.ok).toBe(false)
  })

  it('rejects a valid image signature that exceeds the size ceiling', () => {
    const result = validateImageFile(JPEG_HEADER, FIVE_MB + 1)
    expect(result.ok).toBe(false)
  })

  it('rejects an empty file', () => {
    const result = validateImageFile(new Uint8Array(0), 0)
    expect(result.ok).toBe(false)
  })
})

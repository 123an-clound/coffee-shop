import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(),
}))
vi.mock('@/lib/supabase/require-admin', () => ({
  requireAdmin: vi.fn(),
}))

import { uploadMenuImageAction } from './upload-image-action'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'

// jsdom's File/Blob implementation does not implement arrayBuffer() (only
// FileReader is wired up), but the action under test relies on the spec
// method. Polyfill it via FileReader so real File objects behave correctly
// in this jsdom test environment.
if (!File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function (this: File) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(this)
    })
  }
}

const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0])

function makeSupabaseMock({
  uploadResult = { error: null },
  publicUrl = 'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/x.jpg',
}: {
  uploadResult?: { error: unknown }
  publicUrl?: string
} = {}) {
  const upload = vi.fn().mockResolvedValue(uploadResult)
  const getPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl } })
  const from = vi.fn().mockReturnValue({ upload, getPublicUrl })
  return { storage: { from } }
}

describe('uploadMenuImageAction', () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockResolvedValue(undefined)
  })

  it('rejects when requireAdmin fails, without touching storage', async () => {
    const supabase = makeSupabaseMock()
    vi.mocked(createServerSupabaseClient).mockResolvedValue(supabase as never)
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Unauthorized'))

    const formData = new FormData()
    formData.set('file', new File([JPEG_BYTES], 'test.jpg', { type: 'image/jpeg' }))

    await expect(uploadMenuImageAction(formData)).rejects.toThrow()
    expect(supabase.storage.from).not.toHaveBeenCalled()
  })

  it('returns an error when no file is present in formData, without touching storage', async () => {
    const supabase = makeSupabaseMock()
    vi.mocked(createServerSupabaseClient).mockResolvedValue(supabase as never)

    const formData = new FormData()
    formData.set('file', 'not-a-file')

    const result = await uploadMenuImageAction(formData)

    expect(result).toEqual({ error: 'Không có file được gửi lên.' })
    expect(supabase.storage.from).not.toHaveBeenCalled()
  })

  it('uploads a valid JPEG under a random storage key and returns its public URL', async () => {
    const publicUrl =
      'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/generated.jpg'
    const supabase = makeSupabaseMock({ publicUrl })
    vi.mocked(createServerSupabaseClient).mockResolvedValue(supabase as never)

    const formData = new FormData()
    formData.set('file', new File([JPEG_BYTES], 'test.jpg', { type: 'image/jpeg' }))

    const result = await uploadMenuImageAction(formData)

    expect(result).toEqual({ url: publicUrl })

    const fromResult = supabase.storage.from.mock.results[0].value
    const uploadCallKey = fromResult.upload.mock.calls[0][0] as string
    expect(uploadCallKey).not.toBe('test.jpg')
    expect(uploadCallKey).not.toContain('test')
  })

  it('returns an error when storage upload fails', async () => {
    const supabase = makeSupabaseMock({ uploadResult: { error: { message: 'boom' } } })
    vi.mocked(createServerSupabaseClient).mockResolvedValue(supabase as never)

    const formData = new FormData()
    formData.set('file', new File([JPEG_BYTES], 'test.jpg', { type: 'image/jpeg' }))

    const result = await uploadMenuImageAction(formData)

    expect(result).toEqual({ error: 'Tải ảnh lên thất bại. Vui lòng thử lại.' })
  })
})

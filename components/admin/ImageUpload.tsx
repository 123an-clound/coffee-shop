'use client'

import { useState, type ChangeEvent } from 'react'
import { uploadMenuImageAction } from '@/app/admin/menu/upload-image-action'

export function ImageUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh không được vượt quá 5MB.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.set('file', file)
      const result = await uploadMenuImageAction(formData)

      if ('error' in result) {
        setError(result.error)
        return
      }

      onChange(result.url)
    } catch {
      setError('Tải ảnh lên thất bại. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label htmlFor="image-upload" className="block text-sm font-medium">
        Ảnh sản phẩm
      </label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Ảnh món hiện tại" className="mt-2 h-32 w-32 rounded object-cover" />
      )}
      <input
        id="image-upload"
        aria-label="Ảnh sản phẩm"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-2 text-sm"
      />
      {uploading && <p className="mt-1 text-sm text-brand-ink/60">Đang tải lên...</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

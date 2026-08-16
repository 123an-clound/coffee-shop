'use client'

import { useState, type ChangeEvent } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

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

    setUploading(true)
    setError(null)

    const supabase = createBrowserSupabaseClient()
    const path = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('menu-images').upload(path, file)

    if (uploadError) {
      setError('Tải ảnh lên thất bại. Vui lòng thử lại.')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
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

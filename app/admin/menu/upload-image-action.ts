'use server'

import { randomUUID } from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { validateImageFile } from '@/lib/utils/validate-image-file'

export async function uploadMenuImageAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { error: 'Không có file được gửi lên.' }
  }

  const buffer = new Uint8Array(await file.arrayBuffer())
  const validation = validateImageFile(buffer, file.size)
  if (!validation.ok) {
    return { error: validation.error }
  }

  const path = `${randomUUID()}.${validation.extension}`
  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(path, buffer, { contentType: validation.contentType })

  if (uploadError) {
    return { error: 'Tải ảnh lên thất bại. Vui lòng thử lại.' }
  }

  const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
  return { url: data.publicUrl }
}

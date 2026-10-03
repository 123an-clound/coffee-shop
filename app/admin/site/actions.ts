'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { siteSettingsSchema } from '@/lib/validation/site-settings'

export type SaveSiteSettingsResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }

export async function saveSiteSettingsAction(input: unknown): Promise<SaveSiteSettingsResult> {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)

  const result = siteSettingsSchema.safeParse(input)
  if (!result.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const field = issue.path.join('.')
      if (!fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return { ok: false, message: 'Vui lòng kiểm tra các trường được đánh dấu.', fieldErrors }
  }

  const { error } = await supabase
    .from('coffee_site_settings')
    .upsert({ id: 1, settings: result.data }, { onConflict: 'id' })

  if (error) {
    return {
      ok: false,
      message: error.code === '42P01' || error.code === 'PGRST205'
        ? 'Chưa có bảng cấu hình. Hãy chạy migration 0002_site_settings.sql.'
        : 'Không thể lưu thay đổi. Vui lòng thử lại.',
    }
  }

  for (const path of ['/', '/about', '/contact', '/menu', '/gallery', '/sitemap.xml', '/robots.txt', '/admin', '/admin/site']) {
    revalidatePath(path)
  }
  return { ok: true }
}

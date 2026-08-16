import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/data/categories'
import { getMenuItems } from '@/lib/data/menu-items'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()
  const [categories, items] = await Promise.all([
    getCategories(supabase),
    getMenuItems(supabase),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Tổng số món</p>
          <p className="mt-1 text-2xl font-semibold">{items.length}</p>
        </div>
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Danh mục</p>
          <p className="mt-1 text-2xl font-semibold">{categories.length}</p>
        </div>
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Còn bán</p>
          <p className="mt-1 text-2xl font-semibold">
            {items.filter((i) => i.is_available).length}
          </p>
        </div>
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Món nổi bật</p>
          <p className="mt-1 text-2xl font-semibold">
            {items.filter((i) => i.is_featured).length}
          </p>
        </div>
      </div>
    </div>
  )
}

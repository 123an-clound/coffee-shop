import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMenuItems } from '@/lib/data/menu-items'
import { getCategories } from '@/lib/data/categories'
import { formatPriceVND } from '@/lib/utils/format-price'
import { deleteMenuItemAction } from './actions'

export default async function AdminMenuListPage() {
  const supabase = await createServerSupabaseClient()
  const [items, categories] = await Promise.all([
    getMenuItems(supabase),
    getCategories(supabase),
  ])
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? ''

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-forest">Quản lý menu</h1>
        <Link
          href="/admin/menu/new"
          className="rounded-full bg-brand-forest px-4 py-2 text-sm text-brand-cream"
        >
          + Thêm món
        </Link>
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-forest/10">
            <th className="py-2">Tên món</th>
            <th className="py-2">Danh mục</th>
            <th className="py-2">Giá</th>
            <th className="py-2">Trạng thái</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-brand-forest/5">
              <td className="py-2">{item.name}</td>
              <td className="py-2">{categoryName(item.category_id)}</td>
              <td className="py-2">{formatPriceVND(item.price)}</td>
              <td className="py-2">{item.is_available ? 'Còn bán' : 'Hết hàng'}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/menu/${item.id}/edit`} className="mr-3 text-brand-terracotta">
                  Sửa
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await deleteMenuItemAction(item.id)
                  }}
                  className="inline"
                >
                  <button type="submit" className="text-red-600">
                    Xóa
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

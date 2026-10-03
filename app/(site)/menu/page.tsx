import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMenuItems } from '@/lib/data/menu-items'
import { getCategories } from '@/lib/data/categories'
import { MenuBrowser } from '@/components/menu/MenuBrowser'

export const metadata: Metadata = {
  title: 'Thực đơn',
  alternates: { canonical: '/menu' },
}

export default async function MenuPage() {
  const supabase = await createServerSupabaseClient()
  const [items, categories] = await Promise.all([
    getMenuItems(supabase),
    getCategories(supabase),
  ])

  return (
    <main id="main-content" className="site-page-main">
      <div className="page-heading site-container">
        <div>
          <p className="section-kicker">THỰC ĐƠN / CHỌN MỘT CHÚT THƯƠNG</p>
          <h1>Thức uống <em>cho mọi nhịp ngày.</em></h1>
        </div>
        <p>Cà phê đậm đà, thức uống tươi mát và những hương vị được chuẩn bị bằng sự chăm chút.</p>
      </div>
      <div className="menu-page-body site-container">
        <div className="menu-page-body__intro">
          <span>{String(items.length).padStart(2, '0')} món trong thực đơn</span>
          <span>Khám phá hương vị của bạn</span>
        </div>
        <MenuBrowser items={items} categories={categories} />
      </div>
    </main>
  )
}

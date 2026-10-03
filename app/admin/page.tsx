import Link from 'next/link'
import { ArrowUpRight, LayoutTemplate, Plus, UtensilsCrossed } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/data/categories'
import { getMenuItems } from '@/lib/data/menu-items'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()
  const [categories, items] = await Promise.all([
    getCategories(supabase),
    getMenuItems(supabase),
  ])

  const stats = [
    { label: 'Món trong thực đơn', value: items.length },
    { label: 'Danh mục', value: categories.length },
    { label: 'Đang phục vụ', value: items.filter((item) => item.is_available).length },
    { label: 'Món nổi bật', value: items.filter((item) => item.is_featured).length },
  ]

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-brand-forest/15 pb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-terracotta">TỔNG QUAN</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-brand-forest sm:text-5xl">Chào mừng trở lại.</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-brand-ink/70">Quản lý thực đơn và diện mạo website từ một nơi.</p>
        </div>
        <Link href="/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-forest/25 px-5 text-sm font-semibold text-brand-forest hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta">
          Xem website <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <section aria-labelledby="overview-title" className="mt-9">
        <h2 id="overview-title" className="text-xs font-bold uppercase tracking-[.2em] text-brand-ink/60">HOẠT ĐỘNG HIỆN TẠI</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-brand-forest/10 bg-[#fffdf8] p-6 shadow-sm">
              <p className="text-sm text-brand-ink/65">{stat.label}</p>
              <p className="mt-4 font-heading text-4xl font-semibold tabular-nums text-brand-forest">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="next-title" className="mt-12">
        <h2 id="next-title" className="text-xs font-bold uppercase tracking-[.2em] text-brand-ink/60">BẮT ĐẦU CHỈNH SỬA</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Link href="/admin/site" className="group flex min-h-52 flex-col justify-between rounded-2xl bg-brand-forest p-7 text-brand-cream transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-terracotta">
            <LayoutTemplate size={26} aria-hidden="true" />
            <span>
              <strong className="block font-heading text-2xl font-semibold">Tùy chỉnh website</strong>
              <span className="mt-2 block max-w-sm text-sm leading-6 text-brand-cream/75">Đổi nội dung, hình ảnh, màu sắc, thông tin liên hệ và SEO.</span>
            </span>
            <ArrowUpRight className="self-end transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={22} aria-hidden="true" />
          </Link>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/admin/menu" className="group flex min-h-52 flex-col justify-between rounded-2xl border border-brand-forest/10 bg-[#fffdf8] p-6 text-brand-forest hover:border-brand-forest/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-terracotta">
              <UtensilsCrossed size={25} aria-hidden="true" />
              <span><strong className="block font-heading text-xl font-semibold">Thực đơn</strong><span className="mt-1 block text-xs leading-5 text-brand-ink/65">Chỉnh món và trạng thái hiển thị.</span></span>
              <ArrowUpRight className="self-end" size={19} aria-hidden="true" />
            </Link>
            <Link href="/admin/menu/new" className="group flex min-h-52 flex-col justify-between rounded-2xl border border-brand-forest/10 bg-[#fffdf8] p-6 text-brand-forest hover:border-brand-forest/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-terracotta">
              <Plus size={25} aria-hidden="true" />
              <span><strong className="block font-heading text-xl font-semibold">Thêm món mới</strong><span className="mt-1 block text-xs leading-5 text-brand-ink/65">Tạo món và tải ảnh lên thư viện.</span></span>
              <ArrowUpRight className="self-end" size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

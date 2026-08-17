import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMenuItems } from '@/lib/data/menu-items'
import { getCategories } from '@/lib/data/categories'
import { MenuBrowser } from '@/components/menu/MenuBrowser'
import { FadeIn } from '@/components/motion/FadeIn'
import { LeafMotif } from '@/components/decorative/LeafMotif'

export const metadata = { title: 'Menu — MỘC Coffee House' }

export default async function MenuPage() {
  const supabase = await createServerSupabaseClient()
  const [items, categories] = await Promise.all([
    getMenuItems(supabase),
    getCategories(supabase),
  ])

  return (
    <main className="relative">
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-8 pt-16 text-center">
        <div
          aria-hidden="true"
          className="ambient-glow hero-glow-pulse absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2"
        />
        <LeafMotif className="pointer-events-none absolute -left-4 -top-2 h-32 w-32 text-brand-forest/10 sm:h-44 sm:w-44" />
        <LeafMotif className="pointer-events-none absolute -right-4 top-8 h-32 w-32 rotate-180 text-brand-gold/20 sm:h-44 sm:w-44" />

        <FadeIn>
          <h1 className="relative font-heading text-4xl font-semibold text-brand-forest">Menu</h1>
          <p className="relative mx-auto mt-3 max-w-xl text-brand-ink/70">
            25 món được pha chế mỗi ngày — từ cà phê phin truyền thống đến các món trái cây theo mùa.
          </p>
        </FadeIn>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-16">
        <FadeIn delay={0.1}>
          <MenuBrowser items={items} categories={categories} />
        </FadeIn>
      </div>
    </main>
  )
}

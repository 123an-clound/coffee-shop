import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMenuItems } from '@/lib/data/menu-items'
import { getCategories } from '@/lib/data/categories'
import { MenuBrowser } from '@/components/menu/MenuBrowser'
import { FadeIn } from '@/components/motion/FadeIn'

export const metadata = { title: 'Menu — MỘC Coffee House' }

export default async function MenuPage() {
  const supabase = await createServerSupabaseClient()
  const [items, categories] = await Promise.all([
    getMenuItems(supabase),
    getCategories(supabase),
  ])

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <FadeIn>
        <h1 className="text-center text-3xl font-semibold text-brand-forest">Menu</h1>
      </FadeIn>
      <div className="mt-10">
        <MenuBrowser items={items} categories={categories} />
      </div>
    </main>
  )
}

import { Hero } from '@/components/home/Hero'
import { FeaturedItems } from '@/components/home/FeaturedItems'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getFeaturedMenuItems } from '@/lib/data/menu-items'

export const metadata = {
  title: 'MỘC Coffee House — Chậm lại giữa nhịp sống, Cà phê & thiên nhiên',
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const featured = await getFeaturedMenuItems(supabase, 5)

  return (
    <main>
      <Hero />
      <FeaturedItems items={featured} />
    </main>
  )
}

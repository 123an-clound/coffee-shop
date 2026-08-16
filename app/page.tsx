import { Hero } from '@/components/home/Hero'
import { FeaturedItems } from '@/components/home/FeaturedItems'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getFeaturedMenuItems } from '@/lib/data/menu-items'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const featured = await getFeaturedMenuItems(supabase, 4)

  return (
    <main>
      <Hero />
      <FeaturedItems items={featured} />
    </main>
  )
}

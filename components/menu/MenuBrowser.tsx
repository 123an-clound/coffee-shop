'use client'

import { useMemo, useState } from 'react'
import type { Category, MenuItem } from '@/lib/types'
import { filterMenuItems } from '@/lib/utils/filter-menu-items'
import { MenuItemCard } from './MenuItemCard'

export function MenuBrowser({
  items,
  categories,
}: {
  items: MenuItem[]
  categories: Category[]
}) {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => filterMenuItems(items, { categoryId, search }),
    [items, categoryId, search]
  )

  return (
    <div>
      <div className="sticky top-[73px] z-10 -mx-6 flex flex-wrap items-center gap-3 border-b border-brand-forest/10 bg-brand-cream/90 px-6 py-4 backdrop-blur">
        <input
          type="text"
          placeholder="Tìm món..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-full border border-brand-forest/20 bg-white/60 px-4 py-2 text-sm outline-none transition-shadow focus:border-brand-gold focus:shadow-[0_0_0_3px_rgba(201,161,91,0.25)]"
        />
        <button
          type="button"
          onClick={() => setCategoryId(undefined)}
          className={`hover-lift rounded-full px-4 py-2 text-sm transition-colors ${
            categoryId === undefined
              ? 'bg-brand-forest text-brand-cream shadow-[0_0_16px_rgba(47,62,46,0.35)]'
              : 'bg-brand-card hover:bg-brand-gold/20'
          }`}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategoryId(category.id)}
            className={`hover-lift rounded-full px-4 py-2 text-sm transition-colors ${
              categoryId === category.id
                ? 'bg-brand-forest text-brand-cream shadow-[0_0_16px_rgba(47,62,46,0.35)]'
                : 'bg-brand-card hover:bg-brand-gold/20'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <div key={item.id} className="reveal-up" style={{ animationDelay: `${(index % 6) * 0.06}s` }}>
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

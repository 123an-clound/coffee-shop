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
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Tìm món..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-full border border-brand-forest/20 px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setCategoryId(undefined)}
          className={`rounded-full px-4 py-2 text-sm ${
            categoryId === undefined ? 'bg-brand-forest text-brand-cream' : 'bg-brand-card'
          }`}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategoryId(category.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              categoryId === category.id ? 'bg-brand-forest text-brand-cream' : 'bg-brand-card'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

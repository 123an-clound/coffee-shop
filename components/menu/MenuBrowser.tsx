'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
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
    <div className="menu-browser">
      <div className="menu-browser__controls">
        <div className="menu-browser__categories" role="group" aria-label="Lọc theo loại thức uống">
          <button type="button" onClick={() => setCategoryId(undefined)} aria-pressed={categoryId === undefined} className={`menu-browser__category ${categoryId === undefined ? 'menu-browser__category--active' : ''}`}>
            Tất cả
          </button>
          {categories.map((category) => (
            <button key={category.id} type="button" onClick={() => setCategoryId(category.id)} aria-pressed={categoryId === category.id} className={`menu-browser__category ${categoryId === category.id ? 'menu-browser__category--active' : ''}`}>
              {category.name}
            </button>
          ))}
        </div>
        <div className="menu-browser__search">
          <label htmlFor="menu-search">Tìm thức uống</label>
          <div>
            <Search aria-hidden="true" size={18} />
            <input id="menu-search" type="search" placeholder="Tìm món..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <p className="menu-browser__count" role="status">Hiển thị {filtered.length} món</p>
      {filtered.length ? (
        <div className="menu-browser__grid">
          {filtered.map((item, index) => <MenuItemCard key={item.id} item={item} index={index + 1} />)}
        </div>
      ) : (
        <div className="menu-browser__empty">
          <p>Chưa tìm thấy món phù hợp.</p>
          <button type="button" onClick={() => { setCategoryId(undefined); setSearch('') }}>Xóa bộ lọc</button>
        </div>
      )}
    </div>
  )
}

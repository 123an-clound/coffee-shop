'use client'

import { useState, type FormEvent } from 'react'
import type { Category, CategoryInput } from '@/lib/types'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function CategoryForm({
  category,
  onSubmit,
}: {
  category?: Category
  onSubmit: (input: CategoryInput) => void
}) {
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục')
      return
    }
    setError(null)
    onSubmit({
      name: name.trim(),
      slug: category?.slug ?? slugify(name),
      display_order: category?.display_order ?? 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category-name" className="block text-sm font-medium">
          Tên danh mục
        </label>
        <input
          id="category-name"
          aria-label="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-medium text-brand-cream"
      >
        Lưu
      </button>
    </form>
  )
}

'use client'

import { useState, type FormEvent } from 'react'
import type { Category, MenuItem, MenuItemInput } from '@/lib/types'
import { ImageUpload } from './ImageUpload'

export function MenuItemForm({
  item,
  categories,
  onSubmit,
}: {
  item?: MenuItem
  categories: Category[]
  onSubmit: (input: MenuItemInput) => void
}) {
  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [price, setPrice] = useState(item?.price ?? 0)
  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? '')
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '')
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true)
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên món')
      return
    }
    if (price <= 0) {
      setError('Giá phải lớn hơn 0')
      return
    }
    setError(null)
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price,
      category_id: categoryId,
      image_url: imageUrl,
      is_available: isAvailable,
      is_featured: isFeatured,
      display_order: item?.display_order ?? 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="item-name" className="block text-sm font-medium">
          Tên món
        </label>
        <input
          id="item-name"
          aria-label="Tên món"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="item-description" className="block text-sm font-medium">
          Mô tả
        </label>
        <textarea
          id="item-description"
          aria-label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="item-price" className="block text-sm font-medium">
          Giá (đ)
        </label>
        <input
          id="item-price"
          aria-label="Giá (đ)"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="item-category" className="block text-sm font-medium">
          Danh mục
        </label>
        <select
          id="item-category"
          aria-label="Danh mục"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <ImageUpload value={imageUrl} onChange={setImageUrl} />
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          Còn bán
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Món nổi bật
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-medium text-brand-cream"
      >
        Lưu món
      </button>
    </form>
  )
}

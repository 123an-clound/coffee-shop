'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/data/categories'
import { CategoryForm } from '@/components/admin/CategoryForm'
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from './actions'
import type { Category, CategoryInput } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Bumped on every successful submit so the "new category" form (which has
  // no category.id to key on) also remounts and clears after a create.
  const [formVersion, setFormVersion] = useState(0)

  async function reload() {
    const supabase = createBrowserSupabaseClient()
    setCategories(await getCategories(supabase))
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleSubmit(input: CategoryInput) {
    try {
      setError(null)
      if (editing) {
        await updateCategoryAction(editing.id, input)
      } else {
        await createCategoryAction(input)
      }
      setEditing(null)
      setFormVersion((v) => v + 1)
      await reload()
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null)
      await deleteCategoryAction(id)
      await reload()
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Có lỗi xảy ra, vui lòng thử lại.'
      )
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Quản lý danh mục</h1>

      <div className="mt-6 max-w-md">
        <CategoryForm
          key={editing?.id ?? `new-${formVersion}`}
          category={editing ?? undefined}
          onSubmit={handleSubmit}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-forest/10">
            <th className="py-2">Tên</th>
            <th className="py-2">Slug</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-brand-forest/5">
              <td className="py-2">{category.name}</td>
              <td className="py-2 text-brand-ink/60">{category.slug}</td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={() => setEditing(category)}
                  className="mr-3 text-brand-terracotta"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

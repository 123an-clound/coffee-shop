import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryForm } from './CategoryForm'
import type { Category } from '@/lib/types'

describe('CategoryForm', () => {
  it('rejects an empty name', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<CategoryForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Lưu' }))

    expect(await screen.findByText('Vui lòng nhập tên danh mục')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits name, an auto-generated slug, and display_order', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<CategoryForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Tên danh mục'), 'Trà trái cây')
    await user.click(screen.getByRole('button', { name: 'Lưu' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Trà trái cây',
      slug: 'tra-trai-cay',
      display_order: 0,
    })
  })

  it('pre-fills fields when editing an existing category', () => {
    render(
      <CategoryForm
        category={{ id: '1', name: 'Trà', slug: 'tra', display_order: 2 }}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Tên danh mục')).toHaveValue('Trà')
  })

  it('shows the newly selected category (not stale text) when switching edit targets via a keyed remount', async () => {
    // Simulates the fix in app/admin/categories/page.tsx: the parent must
    // key <CategoryForm> on the edit target's id so React remounts (and
    // resets internal `name` state) instead of reusing the mounted instance.
    const categoryA: Category = { id: 'a', name: 'Danh mục A', slug: 'a', display_order: 0 }
    const categoryB: Category = { id: 'b', name: 'Danh mục B', slug: 'b', display_order: 1 }

    function Harness() {
      const [editing, setEditing] = useState<Category>(categoryA)
      return (
        <>
          <button type="button" onClick={() => setEditing(categoryB)}>
            Switch to B
          </button>
          <CategoryForm key={editing.id} category={editing} onSubmit={vi.fn()} />
        </>
      )
    }

    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByLabelText('Tên danh mục')).toHaveValue('Danh mục A')

    await user.click(screen.getByRole('button', { name: 'Switch to B' }))

    expect(screen.getByLabelText('Tên danh mục')).toHaveValue('Danh mục B')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuItemForm } from './MenuItemForm'
import type { Category } from '@/lib/types'

vi.mock('@/lib/supabase/client', () => ({
  createBrowserSupabaseClient: () => ({
    storage: { from: () => ({ upload: vi.fn(), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  }),
}))

const categories: Category[] = [
  { id: 'c1', name: 'Cà phê phin', slug: 'ca-phe-phin', display_order: 0 },
]

describe('MenuItemForm', () => {
  it('rejects an empty name or a non-positive price', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<MenuItemForm categories={categories} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Giá (đ)'), '0')
    await user.click(screen.getByRole('button', { name: 'Lưu món' }))

    expect(await screen.findByText('Vui lòng nhập tên món')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a complete, valid input', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<MenuItemForm categories={categories} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Tên món'), 'Latte Đá')
    await user.type(screen.getByLabelText('Mô tả'), 'Espresso và sữa tươi')
    await user.type(screen.getByLabelText('Giá (đ)'), '58000')
    await user.click(screen.getByRole('button', { name: 'Lưu món' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Latte Đá',
      description: 'Espresso và sữa tươi',
      price: 58000,
      category_id: 'c1',
      image_url: '',
      is_available: true,
      is_featured: false,
      display_order: 0,
    })
  })
})

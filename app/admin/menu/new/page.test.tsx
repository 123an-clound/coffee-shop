import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewMenuItemPage from './page'
import { createMenuItemAction } from '../actions'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createBrowserSupabaseClient: () => ({
    storage: { from: () => ({ upload: vi.fn(), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  }),
}))

vi.mock('@/lib/data/categories', () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 'c1', name: 'Cà phê phin', slug: 'ca-phe-phin', display_order: 0 },
  ]),
}))

vi.mock('../actions', () => ({
  createMenuItemAction: vi.fn().mockResolvedValue(undefined),
}))

describe('NewMenuItemPage', () => {
  it('does not render the form until categories have loaded', async () => {
    render(<NewMenuItemPage />)

    // Regression guard for the bug where MenuItemForm mounted immediately
    // with an empty categories array, seeding its internal category_id
    // state to '' with no way to resync once categories arrived.
    expect(screen.queryByLabelText('Tên món')).not.toBeInTheDocument()
    expect(screen.getByText('Đang tải...')).toBeInTheDocument()

    // Flush the pending getCategories() promise inside act() so the later
    // state update doesn't leak into (and warn in) the next test.
    await act(async () => {
      await Promise.resolve()
    })
  })

  it('submits a valid category_id (not empty) once categories have loaded', async () => {
    const user = userEvent.setup()
    render(<NewMenuItemPage />)

    await screen.findByLabelText('Tên món')

    await user.type(screen.getByLabelText('Tên món'), 'Latte Đá')
    await user.type(screen.getByLabelText('Giá (đ)'), '58000')
    await user.click(screen.getByRole('button', { name: 'Lưu món' }))

    expect(createMenuItemAction).toHaveBeenCalledWith(
      expect.objectContaining({ category_id: 'c1' })
    )
    expect(push).toHaveBeenCalledWith('/admin/menu')
  })
})

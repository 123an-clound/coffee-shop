import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryForm } from './CategoryForm'

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
})

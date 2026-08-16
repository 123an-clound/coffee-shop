import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuBrowser } from './MenuBrowser'
import type { Category, MenuItem } from '@/lib/types'

const categories: Category[] = [
  { id: 'c1', name: 'Cà phê phin', slug: 'ca-phe-phin', display_order: 0 },
  { id: 'c2', name: 'Trà', slug: 'tra', display_order: 1 },
]

function makeItem(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: '1',
    category_id: 'c1',
    name: 'Cà Phê Đen Đá',
    description: '',
    price: 39000,
    image_url: 'https://images.unsplash.com/x',
    is_available: true,
    is_featured: false,
    display_order: 0,
    created_at: '',
    updated_at: '',
    ...overrides,
  }
}

const items: MenuItem[] = [
  makeItem({ id: '1', category_id: 'c1', name: 'Cà Phê Đen Đá' }),
  makeItem({ id: '2', category_id: 'c2', name: 'Trà Sen Vàng' }),
]

describe('MenuBrowser', () => {
  it('renders all items by default', () => {
    render(<MenuBrowser items={items} categories={categories} />)
    expect(screen.getByText('Cà Phê Đen Đá')).toBeInTheDocument()
    expect(screen.getByText('Trà Sen Vàng')).toBeInTheDocument()
  })

  it('filters by category when a category button is clicked', async () => {
    const user = userEvent.setup()
    render(<MenuBrowser items={items} categories={categories} />)

    await user.click(screen.getByRole('button', { name: 'Trà' }))

    expect(screen.queryByText('Cà Phê Đen Đá')).not.toBeInTheDocument()
    expect(screen.getByText('Trà Sen Vàng')).toBeInTheDocument()
  })

  it('filters by search text', async () => {
    const user = userEvent.setup()
    render(<MenuBrowser items={items} categories={categories} />)

    await user.type(screen.getByPlaceholderText('Tìm món...'), 'sen')

    expect(screen.queryByText('Cà Phê Đen Đá')).not.toBeInTheDocument()
    expect(screen.getByText('Trà Sen Vàng')).toBeInTheDocument()
  })
})

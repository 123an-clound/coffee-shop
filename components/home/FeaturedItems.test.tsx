import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedItems } from './FeaturedItems'
import type { MenuItem } from '@/lib/types'

const items: MenuItem[] = [
  {
    id: '1',
    category_id: 'c1',
    name: 'Cà Phê Đen Đá',
    description: 'Đậm đà',
    price: 39000,
    image_url: 'https://images.unsplash.com/x',
    is_available: true,
    is_featured: true,
    display_order: 0,
    created_at: '',
    updated_at: '',
  },
]

describe('FeaturedItems', () => {
  it('renders a card per item with name and formatted price', () => {
    render(<FeaturedItems items={items} />)

    expect(screen.getByText('Cà Phê Đen Đá')).toBeInTheDocument()
    expect(screen.getByText('39.000đ')).toBeInTheDocument()
  })

  it('renders nothing extra when there are no items', () => {
    render(<FeaturedItems items={[]} />)
    expect(screen.getByText('Món nổi bật')).toBeInTheDocument()
  })
})

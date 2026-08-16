import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders the brand name and all nav links', () => {
    render(<Header />)

    expect(screen.getByText('MỘC Coffee House')).toBeInTheDocument()

    const links = [
      ['Trang chủ', '/'],
      ['Menu', '/menu'],
      ['Về chúng tôi', '/about'],
      ['Không gian', '/gallery'],
      ['Liên hệ', '/contact'],
    ]
    for (const [label, href] of links) {
      const link = screen.getByRole('link', { name: label })
      expect(link).toHaveAttribute('href', href)
    }
  })
})

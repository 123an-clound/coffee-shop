import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    // The Header also renders a mobile nav panel with the same links (hidden
    // below the md breakpoint via CSS), so scope queries to the desktop nav
    // to keep this assertion unambiguous.
    const desktopNav = within(screen.getByTestId('desktop-nav'))
    for (const [label, href] of links) {
      const link = desktopNav.getByRole('link', { name: label })
      expect(link).toHaveAttribute('href', href)
    }
  })

  it('toggles the mobile nav panel when the menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const toggle = screen.getByRole('button', { name: 'Mở menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    const mobilePanel = screen.getByTestId('mobile-nav')
    expect(mobilePanel).toHaveClass('hidden')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(mobilePanel).not.toHaveClass('hidden')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}))

describe('Header', () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue('/')
  })

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

  it('marks the link matching the current page as active, in both nav panels', async () => {
    usePathnameMock.mockReturnValue('/menu')
    const user = userEvent.setup()
    render(<Header />)

    const desktopNav = within(screen.getByTestId('desktop-nav'))
    const activeDesktopLink = desktopNav.getByRole('link', { name: 'Menu' })
    expect(activeDesktopLink).toHaveAttribute('aria-current', 'page')
    expect(activeDesktopLink).toHaveClass('text-brand-terracotta')

    const inactiveDesktopLink = desktopNav.getByRole('link', { name: 'Trang chủ' })
    expect(inactiveDesktopLink).not.toHaveAttribute('aria-current')
    expect(inactiveDesktopLink).toHaveClass('text-brand-ink')

    await user.click(screen.getByRole('button', { name: 'Mở menu' }))
    const mobileNav = within(screen.getByTestId('mobile-nav'))
    const activeMobileLink = mobileNav.getByRole('link', { name: 'Menu' })
    expect(activeMobileLink).toHaveAttribute('aria-current', 'page')
    expect(activeMobileLink).toHaveClass('text-brand-terracotta')
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
    expect(toggle).toHaveAttribute('aria-label', 'Đóng menu')
    expect(mobilePanel).not.toHaveClass('hidden')

    const links = [
      ['Trang chủ', '/'],
      ['Menu', '/menu'],
      ['Về chúng tôi', '/about'],
      ['Không gian', '/gallery'],
      ['Liên hệ', '/contact'],
    ]
    const mobileNav = within(mobilePanel)
    for (const [label, href] of links) {
      const link = mobileNav.getByRole('link', { name: label })
      expect(link).toHaveAttribute('href', href)
    }

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(mobilePanel).toHaveClass('hidden')
  })
})

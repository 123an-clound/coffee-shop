'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Không gian', href: '/gallery' },
  { label: 'Liên hệ', href: '/contact' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-brand-forest/10 bg-brand-cream/95 backdrop-blur transition-shadow duration-300 ${
        isScrolled ? 'shadow-md shadow-brand-ink/5' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-xl font-semibold text-brand-forest">
          MỘC Coffee House
        </Link>

        <nav data-testid="desktop-nav" className="hidden md:flex md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-ink hover:text-brand-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-brand-forest hover:bg-brand-forest/10 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        data-testid="mobile-nav"
        className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-1 border-t border-brand-forest/10 bg-brand-cream px-6 py-4 md:hidden`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="rounded px-2 py-2 text-sm font-medium text-brand-ink hover:bg-brand-forest/10 hover:text-brand-terracotta"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

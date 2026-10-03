'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import type { SiteSettings } from '@/lib/site-settings'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Không gian', href: '/gallery' },
  { label: 'Liên hệ', href: '/contact' },
]

export function Header({
  brand = { name: 'MỘC Coffee House', tagline: '', logoUrl: '' },
  announcement,
}: {
  brand?: SiteSettings['brand']
  announcement?: SiteSettings['announcement']
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setIsMenuOpen(false), [pathname])

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      {announcement?.enabled && announcement.text && (
        <div className="site-announcement">
          {announcement.href ? (
            <Link href={announcement.href}>{announcement.text}<ArrowUpRight aria-hidden="true" size={13} /></Link>
          ) : <span>{announcement.text}</span>}
        </div>
      )}
      <div className="site-header__inner">
        <Link href="/" className="site-wordmark" aria-label={`${brand.name} — Trang chủ`}>
          {brand.logoUrl && (
            <Image src={brand.logoUrl} alt="" width={38} height={38} className="site-wordmark__logo" />
          )}
          <span>{brand.name}</span>
        </Link>

        <nav data-testid="desktop-nav" aria-label="Điều hướng chính" className="site-nav">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href} aria-current={isActive ? 'page' : undefined} className={`site-nav__link ${isActive ? 'site-nav__link--active' : ''}`}>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <Link href="/contact" className="site-header__visit">Ghé thăm quán <ArrowUpRight aria-hidden="true" size={17} /></Link>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="site-menu-toggle"
        >
          {isMenuOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
        </button>
      </div>

      <nav id="mobile-nav" data-testid="mobile-nav" aria-label="Điều hướng di động" className={`${isMenuOpen ? 'flex' : 'hidden'} site-mobile-nav`}>
        {NAV_LINKS.map((link, index) => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} aria-current={isActive ? 'page' : undefined} className={`site-mobile-nav__link ${isActive ? 'site-mobile-nav__link--active' : ''}`}>
              <span aria-hidden="true">0{index + 1}</span>{link.label}<ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

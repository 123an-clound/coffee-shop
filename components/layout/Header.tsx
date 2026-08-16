import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Không gian', href: '/gallery' },
  { label: 'Liên hệ', href: '/contact' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-forest/10 bg-brand-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-xl font-semibold text-brand-forest">
          MỘC Coffee House
        </Link>
        <nav className="flex gap-6">
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
      </div>
    </header>
  )
}

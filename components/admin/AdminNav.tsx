'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/admin/login/actions'

const LINKS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Menu', href: '/admin/menu' },
  { label: 'Danh mục', href: '/admin/categories' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between border-b border-brand-forest/10 bg-brand-card px-6 py-4">
      <div className="flex gap-6">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium ${
              pathname === link.href ? 'text-brand-terracotta' : 'text-brand-ink'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <form action={signOut}>
        <button type="submit" className="text-sm text-brand-ink/70 hover:text-brand-ink">
          Đăng xuất
        </button>
      </form>
    </nav>
  )
}

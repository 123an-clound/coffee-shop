'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Coffee, LogOut } from 'lucide-react'
import { signOut } from '@/app/admin/login/actions'

const links = [
  { label: 'Tổng quan', href: '/admin' },
  { label: 'Thực đơn', href: '/admin/menu' },
  { label: 'Danh mục', href: '/admin/categories' },
  { label: 'Tùy chỉnh website', href: '/admin/site' },
]

export function AdminNav() {
  const pathname = usePathname()
  if (pathname === '/admin/login') return null

  return (
    <header className="border-b border-brand-forest/15 bg-[#fffdf8]">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center gap-3 rounded-md text-brand-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-terracotta"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-forest text-brand-cream">
            <Coffee size={20} aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <strong className="font-heading text-lg font-semibold">Coffee Studio</strong>
            <small className="text-[10px] font-bold uppercase tracking-[.18em] text-brand-ink/60">Quản trị website</small>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-brand-forest hover:bg-brand-forest/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta sm:text-sm"
          >
            Xem website <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-brand-ink/75 hover:bg-brand-forest/5 hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta sm:text-sm"
            >
              <LogOut size={16} aria-hidden="true" /> Đăng xuất
            </button>
          </form>
        </div>
      </div>
      <nav aria-label="Điều hướng quản trị" className="mx-auto flex max-w-[1480px] gap-1 overflow-x-auto px-4 sm:px-6 lg:px-10">
        {links.map((link) => {
          const active = link.href === '/admin'
            ? pathname === '/admin'
            : pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-12 shrink-0 items-center rounded-t-md px-3 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-terracotta sm:px-4 sm:text-sm ${active ? 'bg-brand-forest/5 text-brand-forest after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-brand-terracotta' : 'text-brand-ink/65 hover:bg-brand-forest/5 hover:text-brand-forest'}`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

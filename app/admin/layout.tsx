import { AdminNav } from '@/components/admin/AdminNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f3ec] text-brand-ink">
      <AdminNav />
      <div className="mx-auto max-w-[1480px] px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pt-12">{children}</div>
    </div>
  )
}

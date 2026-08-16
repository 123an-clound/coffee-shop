import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  )
}

'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Coffee } from 'lucide-react'
import { signIn } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3c5a49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-terracotta disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Đang đăng nhập...' : 'Vào trang quản trị'}
    </button>
  )
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(signIn, {})

  return (
    <main className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl overflow-hidden rounded-[24px] border border-brand-forest/10 bg-[#fffdf8] shadow-[0_24px_80px_#26332912] lg:grid-cols-[.95fr_1.05fr]">
      <div className="relative hidden min-h-[680px] overflow-hidden bg-brand-forest lg:block">
        <Image
          src="/images/coffee-craft-story.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 0px, 480px"
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17291de8] via-[#17291d20] to-transparent" />
        <div className="absolute inset-x-10 bottom-12 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#e1c18b]">COFFEE STUDIO / ADMIN</p>
          <p className="mt-5 max-w-sm font-heading text-[42px] leading-[1.1] tracking-[-.04em]">Chăm chút từng chi tiết, từ quán đến website.</p>
          <span className="mt-8 block h-px w-16 bg-[#e1c18b]" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col justify-between px-7 py-9 sm:px-12 sm:py-12 lg:px-[min(6vw,88px)]">
        <div className="flex items-center gap-3 text-brand-forest">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-forest text-white"><Coffee size={20} aria-hidden="true" /></span>
          <span className="font-heading text-xl font-semibold tracking-[-.03em]">Coffee Studio</span>
        </div>

        <div className="my-16 max-w-md lg:my-0">
          <p className="text-[11px] font-bold uppercase tracking-[.22em] text-brand-terracotta">DÀNH CHO QUẢN TRỊ VIÊN</p>
          <h1 className="mt-4 font-heading text-4xl leading-[1.1] tracking-[-.04em] text-brand-forest sm:text-5xl">Chào mừng trở lại.</h1>
          <p className="mt-4 text-sm leading-7 text-brand-ink/70">Đăng nhập để chỉnh sửa thực đơn và diện mạo website của quán.</p>

          <form action={formAction} className="mt-9 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-brand-forest">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="mt-2 min-h-12 w-full rounded-lg border border-brand-forest/25 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition-shadow focus-visible:border-brand-forest focus-visible:ring-2 focus-visible:ring-brand-terracotta/30"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-brand-forest">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 min-h-12 w-full rounded-lg border border-brand-forest/25 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition-shadow focus-visible:border-brand-forest focus-visible:ring-2 focus-visible:ring-brand-terracotta/30"
              />
            </div>
            {state?.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
            <SubmitButton />
          </form>
        </div>

        <Link href="/" className="inline-flex min-h-11 items-center gap-2 self-start text-xs font-semibold uppercase tracking-[.12em] text-brand-forest underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-terracotta">
          Xem website <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { LeafMotif } from '@/components/decorative/LeafMotif'

const SPARKLES = [
  { top: '18%', left: '12%', size: 10, delay: '0s' },
  { top: '30%', left: '82%', size: 14, delay: '0.6s' },
  { top: '68%', left: '20%', size: 8, delay: '1.1s' },
  { top: '55%', left: '88%', size: 12, delay: '1.7s' },
  { top: '80%', left: '55%', size: 9, delay: '0.35s' },
]

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-brand-ink/70 to-brand-cream" />
      </div>

      <div
        aria-hidden="true"
        className="ambient-glow hero-glow-pulse absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        aria-hidden="true"
        className="hero-glow-pulse-2 absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-brand-terracotta/30 blur-3xl"
      />

      {SPARKLES.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="hero-sparkle absolute rounded-full bg-brand-gold shadow-[0_0_18px_6px_rgba(201,161,91,0.65)]"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}

      <LeafMotif className="pointer-events-none absolute -left-6 top-4 h-40 w-40 text-brand-cream/25 sm:h-56 sm:w-56" />
      <LeafMotif className="pointer-events-none absolute -right-6 bottom-0 h-40 w-40 rotate-180 text-brand-gold/40 sm:h-56 sm:w-56" />

      <h1 className="reveal-up relative font-heading text-5xl font-semibold text-brand-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-7xl">
        MỘC Coffee House
      </h1>
      <p
        className="reveal-up relative mt-5 max-w-xl text-xl text-brand-cream/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
        style={{ animationDelay: '0.15s' }}
      >
        Chậm lại giữa nhịp sống — Cà phê &amp; thiên nhiên
      </p>
      <div
        className="reveal-up relative mt-10 flex gap-4"
        style={{ animationDelay: '0.3s' }}
      >
        <Link
          href="/menu"
          className="hover-lift rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-ink shadow-[0_0_30px_rgba(201,161,91,0.5)] hover:brightness-110"
        >
          Xem Menu
        </Link>
        <Link
          href="/contact"
          className="hover-lift rounded-full border-2 border-brand-cream/80 px-8 py-4 text-base font-semibold text-brand-cream hover:bg-brand-cream hover:text-brand-forest"
        >
          Chỉ đường
        </Link>
      </div>
    </section>
  )
}

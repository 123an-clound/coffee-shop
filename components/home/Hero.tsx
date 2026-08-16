'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LeafMotif } from '@/components/decorative/LeafMotif'

const SPARKLES = [
  { top: '18%', left: '12%', size: 10, delay: 0 },
  { top: '30%', left: '82%', size: 14, delay: 0.6 },
  { top: '68%', left: '20%', size: 8, delay: 1.1 },
  { top: '55%', left: '88%', size: 12, delay: 1.7 },
  { top: '80%', left: '55%', size: 9, delay: 0.35 },
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

      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="ambient-glow absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-brand-terracotta/30 blur-3xl"
      />

      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full bg-brand-gold shadow-[0_0_18px_6px_rgba(201,161,91,0.65)]"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ opacity: [0, 1, 0], y: [0, -18, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}

      <LeafMotif className="pointer-events-none absolute -left-6 top-4 h-40 w-40 text-brand-cream/25 sm:h-56 sm:w-56" />
      <LeafMotif className="pointer-events-none absolute -right-6 bottom-0 h-40 w-40 rotate-180 text-brand-gold/40 sm:h-56 sm:w-56" />

      <motion.h1
        initial={{ opacity: 0, y: 32, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative font-heading text-5xl font-semibold text-brand-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-7xl"
      >
        MỘC Coffee House
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
        className="relative mt-5 max-w-xl text-xl text-brand-cream/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
      >
        Chậm lại giữa nhịp sống — Cà phê &amp; thiên nhiên
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
        className="relative mt-10 flex gap-4"
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
      </motion.div>
    </section>
  )
}

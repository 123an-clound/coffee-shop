'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LeafMotif } from '@/components/decorative/LeafMotif'

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center overflow-hidden px-6 py-24 text-center">
      <div
        aria-hidden="true"
        className="ambient-glow absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 sm:h-96 sm:w-96"
      />
      <LeafMotif className="pointer-events-none absolute -left-6 top-4 h-40 w-40 text-brand-forest/10 sm:h-56 sm:w-56" />
      <LeafMotif className="pointer-events-none absolute -right-6 bottom-0 h-40 w-40 rotate-180 text-brand-gold/15 sm:h-56 sm:w-56" />

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative font-heading text-4xl font-semibold text-brand-forest sm:text-5xl"
      >
        MỘC Coffee House
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        className="relative mt-4 max-w-xl text-lg text-brand-ink/80"
      >
        Chậm lại giữa nhịp sống — Cà phê &amp; thiên nhiên
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        className="relative mt-8 flex gap-4"
      >
        <Link
          href="/menu"
          className="hover-lift rounded-full bg-brand-forest px-6 py-3 text-sm font-medium text-brand-cream hover:opacity-90"
        >
          Xem Menu
        </Link>
        <Link
          href="/contact"
          className="hover-lift rounded-full border border-brand-forest px-6 py-3 text-sm font-medium text-brand-forest hover:bg-brand-forest hover:text-brand-cream"
        >
          Chỉ đường
        </Link>
      </motion.div>
    </section>
  )
}

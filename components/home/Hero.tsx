import Link from 'next/link'

export function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-heading text-4xl font-semibold text-brand-forest sm:text-5xl">
        MỘC Coffee House
      </h1>
      <p className="mt-4 max-w-xl text-lg text-brand-ink/80">
        Chậm lại giữa nhịp sống — Cà phê &amp; thiên nhiên
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/menu"
          className="rounded-full bg-brand-forest px-6 py-3 text-sm font-medium text-brand-cream hover:opacity-90"
        >
          Xem Menu
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-brand-forest px-6 py-3 text-sm font-medium text-brand-forest hover:bg-brand-forest hover:text-brand-cream"
        >
          Chỉ đường
        </Link>
      </div>
    </section>
  )
}

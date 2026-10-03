import Link from 'next/link'
import Image from 'next/image'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { SiteSettings } from '@/lib/site-settings'

export function Hero({
  home,
  tagline,
}: {
  home: SiteSettings['home']
  tagline: string
}) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__copy">
        <div className="home-hero__topline">
          <span className="section-kicker">{home.eyebrow}</span>
          <span className="home-hero__number" aria-hidden="true">01 / MỞ ĐẦU</span>
        </div>
        <div className="home-hero__main">
          <h1 id="home-title" className="home-hero__title">{home.title}</h1>
          <p className="home-hero__description">{home.description}</p>
          <div className="home-hero__actions">
            <Link className="site-button site-button--dark" href="/menu">
              {home.primaryCtaLabel}<ArrowUpRight aria-hidden="true" size={18} />
            </Link>
            <Link className="text-link" href="/about">
              {home.secondaryCtaLabel}<ArrowUpRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
        <div className="home-hero__bottomline">
          <span>{tagline}</span>
          {home.showFeatured && (
            <a href="#featured" aria-label="Cuộn đến phần thực đơn nổi bật">
              <ArrowDownRight aria-hidden="true" size={22} />
            </a>
          )}
        </div>
      </div>
      <div className="home-hero__visual">
        <Image
          src={home.heroImageUrl || '/images/coffee-ritual-hero.webp'}
          alt={home.heroImageAlt || 'Cà phê được pha và phục vụ tại quán'}
          fill
          priority
          sizes="(max-width: 800px) 100vw, 56vw"
          className="site-cover-image"
        />
        <div className="home-hero__image-note" aria-hidden="true">
          <span>CHẬM MỘT NHỊP</span>
          <span>THƯỞNG MỘT VỊ</span>
        </div>
      </div>
    </section>
  )
}

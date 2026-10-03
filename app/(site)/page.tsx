import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Hero } from '@/components/home/Hero'
import { FeaturedItems } from '@/components/home/FeaturedItems'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getFeaturedMenuItems } from '@/lib/data/menu-items'
import { getSiteSettings } from '@/lib/site-settings'

export default async function HomePage() {
  const settings = await getSiteSettings()
  const featured = settings.home.showFeatured
    ? await getFeaturedMenuItems(await createServerSupabaseClient(), 5)
    : []
  const galleryPreview = settings.gallery.items.slice(0, 3)

  return (
    <main id="main-content">
      <Hero home={settings.home} tagline={settings.brand.tagline} />

      <section className="home-intro site-container" aria-label="Giới thiệu">
        <div className="home-intro__mark" aria-hidden="true">{settings.brand.name.trim().charAt(0).toLocaleUpperCase('vi-VN')}.</div>
        <p>Không chỉ là một tách cà phê. <em>Là một khoảng thời gian dành cho chính mình.</em></p>
        <span className="home-intro__aside">{settings.brand.name}<br />CÀ PHÊ & KHOẢNG LẶNG</span>
      </section>

      {settings.home.showFeatured && (
        <FeaturedItems items={featured} title={settings.home.featuredTitle} />
      )}

      {settings.home.showStory && (
        <section className="home-story" aria-labelledby="home-story-title">
          <div className="home-story__image">
            <Image
              src={settings.home.storyImageUrl || '/images/coffee-craft-story.webp'}
              alt="Quá trình pha cà phê thủ công"
              fill
              sizes="(max-width: 800px) 100vw, 52vw"
              className="site-cover-image"
            />
            <span className="image-label">PHA BẰNG SỰ CHĂM CHÚT</span>
          </div>
          <div className="home-story__copy">
            <p className="section-kicker">03 / CÂU CHUYỆN</p>
            <h2 id="home-story-title" className="display-title">{settings.home.storyTitle}</h2>
            <p className="home-story__text">{settings.home.storyText}</p>
            <Link href="/about" className="site-button site-button--outline-light">Khám phá câu chuyện <ArrowUpRight aria-hidden="true" size={18} /></Link>
            <span className="home-story__watermark" aria-hidden="true">mộc</span>
          </div>
        </section>
      )}

      {settings.home.showGallery && galleryPreview.length > 0 && (
        <section className="site-section home-gallery" aria-labelledby="home-gallery-title">
          <div className="section-heading section-heading--spread">
            <div>
              <p className="section-kicker">04 / KHÔNG GIAN</p>
              <h2 id="home-gallery-title" className="display-title">{settings.home.galleryTitle}</h2>
            </div>
            <Link href="/gallery" className="text-link">Xem không gian <ArrowUpRight aria-hidden="true" size={18} /></Link>
          </div>
          <div className="home-gallery__grid">
            {galleryPreview.map((item, index) => (
              <figure key={`${item.imageUrl}-${index}`} className="home-gallery__tile">
                <div className="home-gallery__media">
                  <Image src={item.imageUrl} alt={item.alt} fill sizes={index === 0 ? '(max-width: 800px) 100vw, 55vw' : '(max-width: 800px) 50vw, 22vw'} className="site-cover-image" />
                </div>
                <figcaption><span>0{index + 1}</span>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="visit-band" aria-labelledby="visit-title">
        <div className="site-container visit-band__inner">
          <div>
            <p className="section-kicker">HẸN GẶP BẠN TẠI QUÁN</p>
            <h2 id="visit-title">Mình gặp nhau <em>ở quán nhé?</em></h2>
          </div>
          <Link href="/contact" className="site-button site-button--dark">Ghé thăm quán <ArrowUpRight aria-hidden="true" size={18} /></Link>
        </div>
      </section>
    </main>
  )
}

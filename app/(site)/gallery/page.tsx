import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Không gian',
  alternates: { canonical: '/gallery' },
}

export default async function GalleryPage() {
  const settings = await getSiteSettings()

  return (
    <main id="main-content" className="site-page-main gallery-page">
      <div className="page-heading site-container">
        <div>
          <p className="section-kicker">KHÔNG GIAN / NHỮNG GÓC NHỎ</p>
          <h1>Mỗi góc nhỏ, <em>một câu chuyện.</em></h1>
        </div>
        <p>Một chút ánh sáng, một tách cà phê và thời gian để ở lại lâu hơn.</p>
      </div>

      <div className="gallery-grid site-container">
        {settings.gallery.items.map((item, index) => (
          <figure key={`${item.imageUrl}-${index}`} className="gallery-grid__item">
            <div className="gallery-grid__media">
              <Image
                src={item.imageUrl}
                alt={item.alt}
                fill
                sizes={index % 4 === 0 ? '(max-width: 800px) 100vw, 55vw' : '(max-width: 800px) 100vw, 38vw'}
                className="site-cover-image"
              />
            </div>
            <figcaption><span>{String(index + 1).padStart(2, '0')} / {String(settings.gallery.items.length).padStart(2, '0')}</span>{item.caption}</figcaption>
          </figure>
        ))}
        {!settings.gallery.items.length && <p className="site-empty">Không gian sẽ được cập nhật sớm.</p>}
      </div>

      <div className="gallery-cta site-container">
        <p>Ảnh chỉ kể được một phần. Mời bạn đến và cảm nhận.</p>
        <Link href="/contact" className="site-button site-button--dark">Ghé thăm quán <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </div>
    </main>
  )
}

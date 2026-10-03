import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Câu chuyện',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <main id="main-content" className="site-page-main about-page">
      <div className="page-heading site-container">
        <div>
          <p className="section-kicker">{settings.story.eyebrow}</p>
          <h1>{settings.story.title}</h1>
        </div>
        <p>{settings.story.intro}</p>
      </div>

      <div className="about-image-block site-container">
        <div className="about-image-block__media">
          <Image
            src={settings.story.imageUrl || '/images/coffee-craft-story.webp'}
            alt={settings.story.imageAlt || 'Cà phê đang được pha thủ công'}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 80vw"
            className="site-cover-image"
          />
        </div>
        <span className="about-image-block__caption">{settings.brand.tagline}</span>
      </div>

      <section className="about-story site-container" aria-labelledby="about-story-title">
        <div>
          <p className="section-kicker">01 / MỘT CHÚT VỀ CHÚNG TÔI</p>
          <h2 id="about-story-title" className="display-title">Một nơi để <em>thuộc về.</em></h2>
        </div>
        <div>
          <p className="about-story__body">{settings.story.body}</p>
          <Link href="/menu" className="text-link">Tìm thức uống của bạn <ArrowUpRight aria-hidden="true" size={18} /></Link>
        </div>
      </section>

      {settings.story.values.length > 0 && (
        <section className="about-values" aria-labelledby="about-values-title">
          <div className="site-container">
            <p className="section-kicker">02 / ĐIỀU MÌNH TIN</p>
            <h2 id="about-values-title" className="display-title">Những điều nhỏ, <em>làm bằng cả lòng.</em></h2>
            <ol>
              {settings.story.values.map((value, index) => (
                <li key={`${value}-${index}`}><span>0{index + 1}</span><p>{value}</p><ArrowUpRight aria-hidden="true" size={24} /></li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </main>
  )
}

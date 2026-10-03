import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { getSiteSettings } from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const shareImageUrl = settings.seo.ogImageUrl || settings.home.heroImageUrl || '/images/coffee-ritual-hero.webp'
  return {
    metadataBase: new URL(settings.seo.siteUrl),
    alternates: { canonical: '/' },
    title: {
      default: settings.seo.title,
      template: `%s | ${settings.brand.name}`,
    },
    description: settings.seo.description,
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      siteName: settings.brand.name,
      title: settings.seo.title,
      description: settings.seo.description,
      images: [shareImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo.title,
      description: settings.seo.description,
      images: [shareImageUrl],
    },
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  const shareImageUrl = settings.seo.ogImageUrl || settings.home.heroImageUrl || '/images/coffee-ritual-hero.webp'
  const theme = {
    '--site-bg': settings.theme.background,
    '--site-surface': settings.theme.surface,
    '--site-ink': settings.theme.ink,
    '--site-accent': settings.theme.accent,
    '--site-accent-soft': settings.theme.accentSoft,
  } as CSSProperties

  const socialUrls = [
    settings.contact.instagram,
    settings.contact.facebook,
    settings.contact.tiktok,
  ].filter(Boolean)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: settings.brand.name,
    url: settings.seo.siteUrl,
    description: settings.seo.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.contact.address,
      addressCountry: 'VN',
    },
    telephone: settings.contact.phone,
    email: settings.contact.email,
    ...(settings.brand.logoUrl ? { logo: new URL(settings.brand.logoUrl, settings.seo.siteUrl).toString() } : {}),
    image: new URL(shareImageUrl, settings.seo.siteUrl).toString(),
    ...(socialUrls.length ? { sameAs: socialUrls } : {}),
  }

  return (
    <div className="site-shell" style={theme}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
      <SmoothScroll>
        <Header brand={settings.brand} announcement={settings.announcement} />
        <div className="site-page">{children}</div>
        <Footer brand={settings.brand} contact={settings.contact} />
      </SmoothScroll>
    </div>
  )
}

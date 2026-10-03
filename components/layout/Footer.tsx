import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SiteSettings } from '@/lib/site-settings'

export function Footer({
  brand,
  contact,
}: {
  brand: SiteSettings['brand']
  contact: SiteSettings['contact']
}) {
  const socialLinks = [
    { name: 'Instagram', url: contact.instagram },
    { name: 'Facebook', url: contact.facebook },
    { name: 'TikTok', url: contact.tiktok },
  ].filter(({ url }) => Boolean(url))

  return (
    <footer className="site-footer">
      <div className="site-footer__top site-container">
        <div className="site-footer__brand">
          <p className="section-kicker">HẸN GẶP BẠN TẠI QUÁN</p>
          <p className="site-footer__wordmark">{brand.name}</p>
          <p>{brand.tagline}</p>
        </div>
        <div className="site-footer__column">
          <h2>Khám phá</h2>
          <Link href="/menu">Thực đơn</Link>
          <Link href="/about">Câu chuyện</Link>
          <Link href="/gallery">Không gian</Link>
        </div>
        <div className="site-footer__column">
          <h2>Ghé thăm</h2>
          <address>{contact.address}</address>
          <p>{contact.hours}</p>
          {contact.mapUrl && <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">Chỉ đường <ArrowUpRight aria-hidden="true" size={15} /></a>}
        </div>
        <div className="site-footer__column">
          <h2>Kết nối</h2>
          {contact.phone && <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>}
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {socialLinks.map(({ name, url }) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name} <ArrowUpRight aria-hidden="true" size={15} /></a>)}
        </div>
      </div>
      <div className="site-footer__bottom site-container">
        <span>© {new Date().getFullYear()} {brand.name}</span>
        <span>Được pha bằng sự chăm chút.</span>
      </div>
    </footer>
  )
}

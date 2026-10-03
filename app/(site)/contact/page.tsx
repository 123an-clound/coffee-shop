import type { Metadata } from 'next'
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Liên hệ',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const { contact } = settings
  return (
    <main id="main-content" className="site-page-main contact-page">
      <div className="page-heading site-container">
        <div>
          <p className="section-kicker">HẸN GẶP Ở QUÁN</p>
          <h1>Đến chơi, <em>mình pha cà phê.</em></h1>
        </div>
        <p>Cần hỏi điều gì, hay chỉ muốn tìm đường đến quán? Chúng tôi luôn ở đây.</p>
      </div>

      <div className="contact-layout site-container">
        <section className="contact-details" aria-labelledby="contact-details-title">
          <h2 id="contact-details-title" className="display-title">Tìm chúng tôi</h2>
          <dl>
            <div><dt><MapPin aria-hidden="true" size={21} /> Địa chỉ</dt><dd>{contact.address}</dd></div>
            <div><dt><Clock3 aria-hidden="true" size={21} /> Giờ mở cửa</dt><dd>{contact.hours}</dd></div>
            <div><dt><Phone aria-hidden="true" size={21} /> Điện thoại</dt><dd><a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a></dd></div>
            <div><dt><Mail aria-hidden="true" size={21} /> Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
          </dl>
          {contact.mapUrl && <a className="text-link" href={contact.mapUrl} target="_blank" rel="noopener noreferrer">Mở bản đồ <ArrowUpRight aria-hidden="true" size={18} /></a>}
        </section>
        <section className="contact-form-panel" aria-labelledby="contact-form-title">
          <p className="section-kicker">GỬI LỜI NHẮN</p>
          <h2 id="contact-form-title" className="display-title">Nói lời chào.</h2>
          <ContactForm />
        </section>
      </div>

      {contact.mapUrl && (
        <div className="contact-map site-container">
          <iframe
            title={`Bản đồ đường đến ${settings.brand.name}`}
            loading="lazy"
            src={contact.mapUrl}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </main>
  )
}

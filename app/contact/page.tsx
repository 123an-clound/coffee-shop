import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = { title: 'Liên hệ — MỘC Coffee House' }

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-brand-forest">Liên hệ</h1>
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <p className="text-brand-ink/90">123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
          <p className="mt-2 text-brand-ink/90">Điện thoại: 0901 234 567</p>
          <p className="mt-2 text-brand-ink/90">Email: contact@moccoffee.vn</p>
          <p className="mt-2 text-brand-ink/90">Giờ mở cửa: 07:00 – 22:00, tất cả các ngày trong tuần</p>
          <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              title="Bản đồ MỘC Coffee House"
              className="h-full w-full"
              loading="lazy"
              src="https://www.google.com/maps?q=123+Nguy%E1%BB%85n+Hu%E1%BB%87+Qu%E1%BA%ADn+1+TP+H%E1%BB%93+Ch%C3%AD+Minh&output=embed"
            />
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  )
}

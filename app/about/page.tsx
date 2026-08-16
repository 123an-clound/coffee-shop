import Image from 'next/image'
import { FadeIn } from '@/components/motion/FadeIn'
import { LeafMotif } from '@/components/decorative/LeafMotif'

export const metadata = { title: 'Về chúng tôi — MỘC Coffee House' }

export default function AboutPage() {
  return (
    <main className="relative mx-auto max-w-4xl overflow-hidden px-6 py-16">
      <LeafMotif className="pointer-events-none absolute -right-10 top-0 h-48 w-48 text-brand-gold/10" />
      <FadeIn>
        <h1 className="text-3xl font-semibold text-brand-forest">Về chúng tôi</h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="hover-lift relative mt-8 h-72 w-full overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200"
            alt="Không gian MỘC Coffee House"
            fill
            className="object-cover"
          />
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="relative mt-8 leading-relaxed text-brand-ink/90">
          MỘC Coffee House lấy cảm hứng từ cà phê Việt truyền thống, kết hợp không gian mộc mạc
          với chất liệu gỗ, cây xanh và ánh sáng tự nhiên — nơi khách &quot;chậm lại&quot; giữa
          nhịp sống hiện đại.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <h2 className="relative mt-10 font-heading text-2xl text-brand-forest">Giá trị cốt lõi</h2>
        <ul className="relative mt-4 list-inside list-disc space-y-2 text-brand-ink/90">
          <li>Nguyên liệu chọn lọc, cà phê rang xay mỗi ngày</li>
          <li>Không gian mộc mạc, gần gũi thiên nhiên</li>
          <li>Phục vụ tận tâm, chậm lại đúng nghĩa</li>
        </ul>
      </FadeIn>
    </main>
  )
}

import Image from 'next/image'

export const metadata = { title: 'Về chúng tôi — MỘC Coffee House' }

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-brand-forest">Về chúng tôi</h1>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-lg">
        <Image
          src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200"
          alt="Không gian MỘC Coffee House"
          fill
          className="object-cover"
        />
      </div>
      <p className="mt-8 leading-relaxed text-brand-ink/90">
        MỘC Coffee House lấy cảm hứng từ cà phê Việt truyền thống, kết hợp không gian mộc mạc
        với chất liệu gỗ, cây xanh và ánh sáng tự nhiên — nơi khách &quot;chậm lại&quot; giữa
        nhịp sống hiện đại.
      </p>
      <h2 className="mt-10 font-heading text-2xl text-brand-forest">Giá trị cốt lõi</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-brand-ink/90">
        <li>Nguyên liệu chọn lọc, cà phê rang xay mỗi ngày</li>
        <li>Không gian mộc mạc, gần gũi thiên nhiên</li>
        <li>Phục vụ tận tâm, chậm lại đúng nghĩa</li>
      </ul>
    </main>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-brand-forest/10 bg-brand-forest py-10 text-brand-cream">
      <div className="mx-auto max-w-6xl px-6 text-sm">
        <p className="font-heading text-lg">MỘC Coffee House</p>
        <p className="mt-2 opacity-90">123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
        <p className="mt-1 opacity-90">Điện thoại: 0901 234 567 · Email: contact@moccoffee.vn</p>
        <p className="mt-1 opacity-90">Giờ mở cửa: 07:00 – 22:00, tất cả các ngày trong tuần</p>
        <p className="mt-6 opacity-70">&copy; {new Date().getFullYear()} MỘC Coffee House.</p>
      </div>
    </footer>
  )
}

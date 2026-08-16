import Image from 'next/image'
import type { MenuItem } from '@/lib/types'
import { formatPriceVND } from '@/lib/utils/format-price'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

export function FeaturedItems({ items }: { items: MenuItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-center text-3xl font-semibold text-brand-forest">Món nổi bật</h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg bg-brand-card shadow-sm">
            <div className="relative h-48 w-full">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              ) : (
                <ImagePlaceholder name={item.name} />
              )}
              {!item.is_available && (
                <span className="absolute right-2 top-2 rounded bg-brand-ink/80 px-2 py-1 text-xs text-brand-cream">
                  Hết hàng
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-heading text-lg">{item.name}</h3>
              <p className="mt-1 text-brand-terracotta">{formatPriceVND(item.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

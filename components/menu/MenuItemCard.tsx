import Image from 'next/image'
import type { MenuItem } from '@/lib/types'
import { formatPriceVND } from '@/lib/utils/format-price'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="hover-lift overflow-hidden rounded-lg bg-brand-card shadow-sm">
      <div className="relative h-40 w-full">
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
        <p className="mt-1 text-sm text-brand-ink/70">{item.description}</p>
        <p className="mt-2 font-medium text-brand-terracotta">{formatPriceVND(item.price)}</p>
      </div>
    </article>
  )
}

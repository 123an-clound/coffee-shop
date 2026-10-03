import type { MenuItem } from '@/lib/types'
import { formatPriceVND } from '@/lib/utils/format-price'
import { MenuImage } from '@/components/ui/MenuImage'

export function MenuItemCard({ item, index }: { item: MenuItem; index?: number }) {
  return (
    <article className="menu-item">
      <div className="menu-item__media">
        <MenuImage src={item.image_url} name={item.name} sizes="(max-width: 640px) 32vw, (max-width: 900px) 22vw, 14vw" />
      </div>
      <div className="menu-item__content">
        <span className="menu-item__index">{index ? String(index).padStart(2, '0') : '—'}</span>
        <div className="menu-item__title-row">
          <h2>{item.name}</h2>
          <span>{formatPriceVND(item.price)}</span>
        </div>
        {item.description && <p>{item.description}</p>}
        {!item.is_available && <span className="menu-item__status">Tạm hết</span>}
      </div>
    </article>
  )
}

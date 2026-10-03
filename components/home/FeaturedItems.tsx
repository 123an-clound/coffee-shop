import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { MenuItem } from '@/lib/types'
import { formatPriceVND } from '@/lib/utils/format-price'
import { MenuImage } from '@/components/ui/MenuImage'

export function FeaturedItems({
  items,
  title = 'Món nổi bật',
}: {
  items: MenuItem[]
  title?: string
}) {
  return (
    <section id="featured" className="site-section featured-section" aria-labelledby="featured-title">
      <div className="section-heading section-heading--spread">
        <div>
          <p className="section-kicker">02 / THỰC ĐƠN</p>
          <h2 id="featured-title" className="display-title">{title}</h2>
        </div>
        <Link className="text-link" href="/menu">Xem tất cả món <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </div>
      {items.length ? (
        <div className="featured-grid">
          {items.map((item, index) => (
            <article className="featured-item" key={item.id}>
              <div className="featured-item__media">
                <MenuImage
                  src={item.image_url}
                  name={item.name}
                  sizes={index === 0 ? '(max-width: 800px) 100vw, 40vw' : '(max-width: 800px) 50vw, 25vw'}
                />
                {!item.is_available && <span className="item-status">Tạm hết</span>}
              </div>
              <div className="featured-item__details">
                <div>
                  <span className="featured-item__index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.name}</h3>
                </div>
                <p>{formatPriceVND(item.price)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="site-empty">Các món nổi bật sẽ được cập nhật sớm.</p>
      )}
    </section>
  )
}

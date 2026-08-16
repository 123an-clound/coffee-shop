import type { MenuItem } from '@/lib/types'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
}

export function filterMenuItems(
  items: MenuItem[],
  opts: { categoryId?: string; search?: string }
): MenuItem[] {
  return items.filter((item) => {
    if (opts.categoryId && item.category_id !== opts.categoryId) return false
    if (opts.search && !normalize(item.name).includes(normalize(opts.search))) return false
    return true
  })
}

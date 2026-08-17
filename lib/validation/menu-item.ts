import { z } from 'zod'
import type { MenuItemInput } from '@/lib/types'

const ALLOWED_IMAGE_HOSTS = ['images.unsplash.com', 'xsspvdgnhelzprcqaiek.supabase.co']

export const menuItemInputSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().trim().min(1, 'Vui lòng nhập tên món').max(120),
  description: z.string().trim().max(2000),
  price: z.number().positive().max(100_000_000),
  image_url: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (value) => {
        if (value === '') return true
        try {
          const url = new URL(value)
          return (
            (url.protocol === 'http:' || url.protocol === 'https:') &&
            ALLOWED_IMAGE_HOSTS.includes(url.hostname)
          )
        } catch {
          return false
        }
      },
      { message: 'image_url must be empty or point to an allowed image host' }
    ),
  is_available: z.boolean(),
  is_featured: z.boolean(),
  display_order: z.number().int().min(0).max(100_000),
}) satisfies z.ZodType<MenuItemInput>

export function parseMenuItemInput(input: unknown): MenuItemInput {
  return menuItemInputSchema.parse(input)
}

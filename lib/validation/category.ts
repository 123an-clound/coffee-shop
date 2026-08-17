import { z } from 'zod'
import type { CategoryInput } from '@/lib/types'

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập tên danh mục').max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),
  display_order: z.number().int().min(0).max(100_000),
}) satisfies z.ZodType<CategoryInput>

export function parseCategoryInput(input: unknown): CategoryInput {
  return categoryInputSchema.parse(input)
}

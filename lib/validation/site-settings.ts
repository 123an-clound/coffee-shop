import { z } from 'zod'
import type { SiteSettings } from '@/lib/site-settings'

const shortText = (max: number) => z.string().trim().max(max)
const requiredText = (max: number) => z.string().trim().min(1, 'Vui lòng nhập nội dung.').max(max)

function isInternalPath(value: string) {
  return value.startsWith('/') && !value.startsWith('//') && !/[\\\s\x00-\x1f]/.test(value)
}

function isLocalImagePath(value: string) {
  return /^\/images\/[A-Za-z0-9._-]+$/.test(value) && !value.includes('..')
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

function isAllowedImageUrl(value: string) {
  if (value === '' || isLocalImagePath(value)) return true
  if (!isHttpsUrl(value)) return false
  const url = new URL(value)
  const configuredSupabaseHost = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname
    } catch {
      return 'jtizooyjnllostamffpp.supabase.co'
    }
  })()
  return url.hostname === 'images.unsplash.com' || (
    url.hostname === configuredSupabaseHost &&
    url.pathname.startsWith('/storage/v1/object/public/menu-images/')
  )
}

const imageUrl = shortText(2048).refine(isAllowedImageUrl, {
  message: 'Dùng ảnh tải lên, đường dẫn nội bộ hoặc ảnh từ nguồn được hỗ trợ.',
})
const linkUrl = shortText(2048).refine(
  (value) => value === '' || isInternalPath(value) || isHttpsUrl(value),
  { message: 'Liên kết phải bắt đầu bằng / hoặc https://.' }
)
const socialUrl = shortText(2048).refine(
  (value) => value === '' || isHttpsUrl(value),
  { message: 'Liên kết phải bắt đầu bằng https://.' }
)
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Màu cần có định dạng #RRGGBB.')

function luminance(hex: string) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const [r, g, b] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(first: string, second: string) {
  const a = luminance(first)
  const b = luminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

export const siteSettingsSchema: z.ZodType<SiteSettings> = z.strictObject({
  brand: z.strictObject({
    name: requiredText(100),
    tagline: shortText(160),
    logoUrl: imageUrl,
  }),
  theme: z.strictObject({
    background: hexColor,
    surface: hexColor,
    ink: hexColor,
    accent: hexColor,
    accentSoft: hexColor,
  }).superRefine((theme, context) => {
    if (contrastRatio(theme.ink, theme.background) < 4.5) {
      context.addIssue({ code: 'custom', path: ['ink'], message: 'Màu chữ cần tương phản ít nhất 4.5:1 với nền chính.' })
    }
    if (contrastRatio(theme.ink, theme.surface) < 4.5) {
      context.addIssue({ code: 'custom', path: ['ink'], message: 'Màu chữ cần tương phản ít nhất 4.5:1 với bề mặt.' })
    }
    if (contrastRatio(theme.ink, '#FFFFFF') < 4.5) {
      context.addIssue({ code: 'custom', path: ['ink'], message: 'Màu chữ cần đủ đậm để hiển thị chữ trắng trên nút và chân trang.' })
    }
    if (contrastRatio(theme.accent, theme.background) < 4.5 || contrastRatio(theme.accent, theme.surface) < 4.5) {
      context.addIssue({ code: 'custom', path: ['accent'], message: 'Màu nhấn cần tương phản ít nhất 4.5:1 với nền và bề mặt.' })
    }
    if (contrastRatio(theme.accent, '#FFFFFF') < 4.5) {
      context.addIssue({ code: 'custom', path: ['accent'], message: 'Màu nhấn cần đủ đậm để hiển thị chữ trắng trên nút.' })
    }
  }),
  announcement: z.strictObject({
    enabled: z.boolean(),
    text: shortText(240),
    href: linkUrl,
  }).refine((value) => !value.enabled || value.text.length > 0, {
    message: 'Nhập nội dung trước khi bật thông báo.',
    path: ['text'],
  }),
  home: z.strictObject({
    eyebrow: shortText(120),
    title: requiredText(180),
    description: requiredText(600),
    heroImageUrl: imageUrl,
    heroImageAlt: shortText(200),
    primaryCtaLabel: requiredText(80),
    secondaryCtaLabel: requiredText(80),
    showFeatured: z.boolean(),
    featuredTitle: requiredText(120),
    showStory: z.boolean(),
    storyTitle: requiredText(160),
    storyText: shortText(800),
    storyImageUrl: imageUrl,
    showGallery: z.boolean(),
    galleryTitle: requiredText(120),
  }),
  story: z.strictObject({
    eyebrow: shortText(120),
    title: requiredText(180),
    intro: requiredText(700),
    body: shortText(3000),
    imageUrl: imageUrl,
    imageAlt: shortText(200),
    values: z.array(requiredText(160)).max(6),
  }),
  gallery: z.strictObject({
    items: z.array(z.strictObject({
      imageUrl: imageUrl.refine(Boolean, 'Chọn ảnh cho mục này.'),
      alt: requiredText(200),
      caption: shortText(160),
    })).max(12),
  }),
  contact: z.strictObject({
    address: requiredText(300),
    phone: shortText(60),
    email: z.email().max(254),
    hours: shortText(240),
    mapUrl: shortText(2048).refine(
      (value) => {
        if (value === '') return true
        if (!isHttpsUrl(value)) return false
        const url = new URL(value)
        return (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) || url.hostname === 'maps.google.com'
      },
      { message: 'Dùng liên kết Google Maps https://.' }
    ),
    instagram: socialUrl,
    facebook: socialUrl,
    tiktok: socialUrl,
  }),
  seo: z.strictObject({
    title: requiredText(120),
    description: requiredText(300),
    ogImageUrl: imageUrl,
    siteUrl: shortText(2048).refine((value) => {
      if (!isHttpsUrl(value)) return false
      const url = new URL(value)
      return url.pathname === '/' && !url.search && !url.hash
    }, 'Nhập địa chỉ gốc dạng https://example.com.'),
  }),
})

export function parseSiteSettings(input: unknown): SiteSettings {
  return siteSettingsSchema.parse(input)
}

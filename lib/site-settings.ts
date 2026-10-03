import { cache } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { siteSettingsSchema } from '@/lib/validation/site-settings'

export interface SiteSettings {
  brand: {
    name: string
    tagline: string
    logoUrl: string
  }
  theme: {
    background: string
    surface: string
    ink: string
    accent: string
    accentSoft: string
  }
  announcement: {
    enabled: boolean
    text: string
    href: string
  }
  home: {
    eyebrow: string
    title: string
    description: string
    heroImageUrl: string
    heroImageAlt: string
    primaryCtaLabel: string
    secondaryCtaLabel: string
    showFeatured: boolean
    featuredTitle: string
    showStory: boolean
    storyTitle: string
    storyText: string
    storyImageUrl: string
    showGallery: boolean
    galleryTitle: string
  }
  story: {
    eyebrow: string
    title: string
    intro: string
    body: string
    imageUrl: string
    imageAlt: string
    values: string[]
  }
  gallery: {
    items: { imageUrl: string; alt: string; caption: string }[]
  }
  contact: {
    address: string
    phone: string
    email: string
    hours: string
    mapUrl: string
    instagram: string
    facebook: string
    tiktok: string
  }
  seo: {
    title: string
    description: string
    ogImageUrl: string
    siteUrl: string
  }
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand: {
    name: 'MỘC Coffee House',
    tagline: 'Một khoảng lặng giữa phố',
    logoUrl: '',
  },
  theme: {
    background: '#F5F1E8',
    surface: '#FFFDF8',
    ink: '#263329',
    accent: '#9E5625',
    accentSoft: '#C9A15B',
  },
  announcement: {
    enabled: false,
    text: 'Chào mừng bạn đến với MỘC Coffee House',
    href: '',
  },
  home: {
    eyebrow: 'MỘC COFFEE HOUSE · SAIGON',
    title: 'Một chút bình yên, một tách cà phê.',
    description: 'Cà phê được pha bằng sự chăm chút, trong một không gian dành cho những cuộc trò chuyện và khoảnh khắc chậm lại.',
    heroImageUrl: '/images/coffee-ritual-hero.webp',
    heroImageAlt: 'Phin cà phê và ly cà phê sữa đá trên bàn gỗ',
    primaryCtaLabel: 'Khám phá thực đơn',
    secondaryCtaLabel: 'Câu chuyện của MỘC',
    showFeatured: true,
    featuredTitle: 'Được yêu thích tại MỘC',
    showStory: true,
    storyTitle: 'Có những nơi để ta chậm lại.',
    storyText: 'Từ hạt cà phê được chọn lựa đến ánh sáng len qua từng góc nhỏ, MỘC là lời mời dành cho những ngày cần một nhịp thở dịu dàng hơn.',
    storyImageUrl: '/images/coffee-craft-story.webp',
    showGallery: true,
    galleryTitle: 'Một góc MỘC mỗi ngày',
  },
  story: {
    eyebrow: 'CÂU CHUYỆN CỦA CHÚNG TÔI',
    title: 'Gần gũi như một lời chào.',
    intro: 'MỘC bắt đầu từ mong muốn tạo ra một nơi mọi người có thể tạm rời nhịp sống vội vã.',
    body: 'Chúng tôi yêu cà phê Việt, chất liệu tự nhiên và những cuộc gặp gỡ không cần vội. Mỗi thức uống và mỗi góc nhỏ đều được chăm chút để bạn cảm thấy thân thuộc.',
    imageUrl: '/images/coffee-craft-story.webp',
    imageAlt: 'Đôi tay pha cà phê vào chiếc tách gốm',
    values: ['Cà phê chọn lọc và pha bằng sự tận tâm', 'Không gian ấm áp, gần gũi với thiên nhiên', 'Dành thời gian cho những kết nối thật'],
  },
  gallery: {
    items: [
      { imageUrl: '/images/coffee-space.webp', alt: 'Không gian cà phê ấm áp trong bộ ảnh ý tưởng của MỘC', caption: 'Cảm hứng không gian MỘC' },
      { imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900', alt: 'Ly cà phê trên bàn trong ảnh minh họa', caption: 'Nghi thức thưởng thức cà phê' },
      { imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900', alt: 'Không gian quán cà phê trong ảnh minh họa', caption: 'Một góc để chậm lại' },
      { imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=900', alt: 'Bàn cà phê bên cửa sổ trong ảnh minh họa', caption: 'Ánh sáng và câu chuyện' },
    ],
  },
  contact: {
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    phone: '0901 234 567',
    email: 'contact@moccoffee.vn',
    hours: '07:00 – 22:00, tất cả các ngày trong tuần',
    mapUrl: 'https://www.google.com/maps?q=123+Nguy%E1%BB%85n+Hu%E1%BB%87+Qu%E1%BA%ADn+1+TP+H%E1%BB%93+Ch%C3%AD+Minh&output=embed',
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  seo: {
    title: 'MỘC Coffee House — Một khoảng lặng giữa phố',
    description: 'Khám phá cà phê, đồ uống và không gian gần gũi tại MỘC Coffee House.',
    ogImageUrl: '',
    siteUrl: 'https://moccoffee.vn',
  },
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('coffee_site_settings')
      .select('settings')
      .eq('id', 1)
      .maybeSingle()

    if (error || !data) return DEFAULT_SITE_SETTINGS
    const parsed = siteSettingsSchema.safeParse(data.settings)
    return parsed.success ? parsed.data : DEFAULT_SITE_SETTINGS
  } catch {
    // The public site remains readable before the migration is applied.
    return DEFAULT_SITE_SETTINGS
  }
})

import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/site-settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getSiteSettings()
  const baseUrl = seo.siteUrl.replace(/\/$/, '')
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

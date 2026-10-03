import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/site-settings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { seo } = await getSiteSettings()
  const baseUrl = seo.siteUrl.replace(/\/$/, '')
  const routes = ['', '/menu', '/about', '/gallery', '/contact']
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
  }))
}

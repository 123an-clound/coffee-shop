import type { MetadataRoute } from 'next'

const BASE_URL = 'https://moccoffee.vn'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/menu', '/about', '/gallery', '/contact']
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }))
}

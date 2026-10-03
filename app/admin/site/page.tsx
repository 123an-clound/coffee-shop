import { getSiteSettings } from '@/lib/site-settings'
import { SiteStudio } from '@/components/admin/SiteStudio'

export const metadata = { title: 'Website Studio | Quản trị' }

export default async function SiteStudioPage() {
  const settings = await getSiteSettings()
  return <SiteStudio initialSettings={settings} />
}

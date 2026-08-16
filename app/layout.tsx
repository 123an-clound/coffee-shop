import type { Metadata, Viewport } from 'next'
import { Fraunces, Be_Vietnam_Pro } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import './globals.css'

const heading = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
})

const body = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'MỘC Coffee House',
  description: 'Chậm lại giữa nhịp sống — Cà phê & thiên nhiên',
}

// The site is designed for a light, warm palette only — declare this
// explicitly so browsers with auto-dark-mode don't invert it.
export const viewport: Viewport = {
  colorScheme: 'light',
}

// Local-SEO structured data for the shop's single physical location.
// Values mirror the canonical strings used in Footer.tsx / app/contact/page.tsx.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'MỘC Coffee House',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1',
    addressLocality: 'TP. Hồ Chí Minh',
    addressCountry: 'VN',
  },
  telephone: '0901 234 567',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '07:00',
    closes: '22:00',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}

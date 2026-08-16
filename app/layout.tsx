import type { Metadata } from 'next'
import { Fraunces, Be_Vietnam_Pro } from 'next/font/google'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}

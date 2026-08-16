import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#F5F1E8',
        'brand-forest': '#2F3E2E',
        'brand-terracotta': '#B5652A',
        'brand-gold': '#C9A15B',
        'brand-ink': '#2A2520',
        'brand-card': '#FAF7F0',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}

export default config

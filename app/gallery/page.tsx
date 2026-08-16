import Image from 'next/image'

export const metadata = { title: 'Không gian quán — MỘC Coffee House' }

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900',
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900',
  'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=900',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900',
]

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-semibold text-brand-forest">Không gian quán</h1>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_IMAGES.map((src) => (
          <div key={src} className="relative h-64 w-full overflow-hidden rounded-lg">
            <Image src={src} alt="Không gian MỘC Coffee House" fill className="object-cover" />
          </div>
        ))}
      </div>
    </main>
  )
}

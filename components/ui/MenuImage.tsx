'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImagePlaceholder } from './ImagePlaceholder'

export function MenuImage({
  src,
  name,
  sizes,
}: {
  src: string
  name: string
  sizes: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return <ImagePlaceholder name={name} />

  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes={sizes}
      className="site-cover-image"
      onError={() => setFailed(true)}
    />
  )
}

export function ImagePlaceholder({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      className="flex h-full w-full items-center justify-center bg-brand-card"
      aria-hidden="true"
    >
      <span className="font-heading text-3xl text-brand-forest/30">{initial}</span>
    </div>
  )
}

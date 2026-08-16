import type { ReactNode } from 'react'

/**
 * Fade-up entrance wrapper. Applies the `reveal-up` CSS animation directly
 * from the very first render (no client-side state/observer toggling a
 * class after mount) — some browser extensions that rewrite the page's
 * styles (e.g. forced dark-mode tools) can freeze animations that only
 * start via a post-mount class change, so this intentionally avoids that
 * pattern in favor of one that's already proven reliable (see Hero).
 */
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div className={`reveal-up ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  )
}

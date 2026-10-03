'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | undefined
    let frameId = 0

    function start() {
      if (preference.matches || lenis) return
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      })
      const raf = (time: number) => {
        lenis?.raf(time)
        frameId = requestAnimationFrame(raf)
      }
      frameId = requestAnimationFrame(raf)
    }

    function stop() {
      cancelAnimationFrame(frameId)
      lenis?.destroy()
      lenis = undefined
    }

    function onPreferenceChange() {
      if (preference.matches) stop()
      else start()
    }

    start()
    preference.addEventListener('change', onPreferenceChange)
    return () => {
      preference.removeEventListener('change', onPreferenceChange)
      stop()
    }
  }, [])

  return <>{children}</>
}

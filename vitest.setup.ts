import '@testing-library/jest-dom/vitest'

// jsdom has no IntersectionObserver; framer-motion's whileInView needs a stub.
class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

global.IntersectionObserver = MockIntersectionObserver

import { useEffect } from 'react'

export function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.visible)')

    // Fail-open: if observer isn't supported, reveal everything immediately.
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    )

    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

import { useState, useEffect } from 'react'

export function useReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const dh = document.documentElement.scrollHeight - window.innerHeight
      const pct = dh > 0 ? Math.min(100, (window.scrollY / dh) * 100) : 0
      setProgress(pct)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return progress
}

import { useEffect, useState } from 'react'
import { useReadingProgress } from '../hooks/useReadingProgress'

export default function TableOfContents({ contentId }) {
  const [headings, setHeadings] = useState([])
  const [active, setActive] = useState('')
  const progress = useReadingProgress()

  useEffect(() => {
    const el = document.getElementById(contentId)
    if (!el) return
    const nodes = el.querySelectorAll('h2, h3')
    const items = Array.from(nodes).map((h, i) => {
      if (!h.id) h.id = `heading-${i}`
      return { id: h.id, text: h.textContent, level: h.tagName }
    })
    setHeadings(items)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    nodes.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [contentId])

  if (!headings.length) return null

  return (
    <div className="sticky top-[88px] bg-surface dark:bg-surface border border-border rounded-card p-5">
      <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-3 pb-3 border-b border-border">
        In this essay
      </div>
      <ul className="flex flex-col gap-0.5">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={level === 'H3' ? 'pl-3.5' : ''}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`toc-link ${active === id ? 'active' : ''}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>

      {/* Progress */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2.5">
        <span className="font-mono text-[10px] text-ink-3 w-8 flex-shrink-0">
          {Math.round(progress)}%
        </span>
        <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

function buildTimeline(posts) {
  const safe = Array.isArray(posts) ? posts : []
  return [...safe]
    .filter((p) => p?.dateISO)
    .sort((a, b) => String(b.dateISO).localeCompare(String(a.dateISO)))
    .slice(0, 8)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      dateISO: post.dateISO,
      category: post.category || 'General',
    }))
}

export default function ReadingJourneyTimeline({ posts = [], loading = false }) {
  const navigate = useNavigate()
  const timeline = buildTimeline(posts)

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-content mx-auto px-8">
        <div className="mb-8">
          <div className="eyebrow mb-2">Archive Flow</div>
          <h2 className="font-display text-[28px] font-bold tracking-tight text-ink dark:text-paper">Reading Journey</h2>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

          {loading ? (
            <div className="space-y-5" aria-live="polite" aria-busy="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`timeline-skeleton-${i}`} className="relative">
                  <span className="absolute -left-[20px] top-2 w-3 h-3 rounded-full bg-accent/45" />
                  <div className="rounded-card border border-border p-4 bg-surface">
                    <div className="skeleton-line w-20 mb-3" />
                    <div className="skeleton-line w-full mb-2" />
                    <div className="skeleton-line w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => navigate(`/post/${item.slug}`)}
                  className="relative w-full text-left rounded-card border border-border p-4 bg-surface hover:border-accent transition-colors"
                >
                  <span className="absolute -left-[20px] top-5 w-3 h-3 rounded-full bg-accent" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-3 mb-2">{item.date}</p>
                  <h3 className="font-display text-[18px] font-bold text-ink dark:text-paper mb-1">{item.title}</h3>
                  <p className="text-[12px] text-ink-3">{item.category}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

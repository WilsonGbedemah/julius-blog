import { useNavigate } from 'react-router-dom'

function buildSpotlights(posts) {
  const safe = Array.isArray(posts) ? posts : []
  const byCategory = safe.reduce((acc, post) => {
    const cat = post?.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(post)
    return acc
  }, {})

  return Object.entries(byCategory)
    .map(([category, items]) => ({ category, items }))
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 3)
}

export default function TopicSpotlightBlocks({ posts = [], loading = false }) {
  const navigate = useNavigate()
  const spotlights = buildSpotlights(posts)

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-content mx-auto px-8">
        <div className="mb-8">
          <div className="eyebrow mb-2">Explore by Theme</div>
          <h2 className="font-display text-[28px] font-bold tracking-tight text-ink dark:text-paper">Topic Spotlights</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-live="polite" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`topic-block-skeleton-${i}`} className="rounded-card border border-border p-6 bg-surface">
                <div className="skeleton-line w-2/3 mb-4" />
                <div className="skeleton-line w-full mb-2" />
                <div className="skeleton-line w-4/5 mb-5" />
                <div className="skeleton-line w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlights.map(({ category, items }) => {
              const top = items[0]
              return (
                <article key={category} className="rounded-card border border-border p-6 bg-surface">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-3">{category}</p>
                  <h3 className="font-display text-[20px] font-bold text-ink dark:text-paper mb-2 line-clamp-2">
                    {top?.title || 'Untitled'}
                  </h3>
                  <p className="text-[13px] text-ink-3 line-clamp-3 mb-4">{top?.excerpt || 'No excerpt available.'}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink-3 uppercase tracking-wider">
                      {items.length} post{items.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => navigate(`/stories?category=${encodeURIComponent(category)}`)}
                      className="font-mono text-[11px] text-accent hover:underline"
                    >
                      Open topic →
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

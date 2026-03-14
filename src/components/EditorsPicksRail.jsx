import { useNavigate } from 'react-router-dom'

function buildPicks(posts) {
  const safe = Array.isArray(posts) ? posts : []
  return [...safe]
    .sort((a, b) => Number(Boolean(b?.featured)) - Number(Boolean(a?.featured)))
    .slice(0, 6)
}

export default function EditorsPicksRail({ posts = [], loading = false }) {
  const navigate = useNavigate()
  const picks = buildPicks(posts)

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-content mx-auto px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="eyebrow mb-2">Curated</div>
            <h2 className="font-display text-[28px] font-bold tracking-tight text-ink dark:text-paper">Editor&apos;s Picks</h2>
          </div>
          <button
            className="font-mono text-[11px] text-ink-3 hover:text-accent transition-colors duration-200"
            onClick={() => navigate('/stories')}
          >
            View all stories →
          </button>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2" aria-live="polite" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`pick-skeleton-${i}`} className="min-w-[280px] sm:min-w-[320px] max-w-[320px] post-card p-0 overflow-hidden">
                <div className="aspect-[16/10] skeleton" />
                <div className="p-4">
                  <div className="skeleton-line w-24 mb-3" />
                  <div className="skeleton-line w-full mb-2" />
                  <div className="skeleton-line w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {picks.map((post) => (
              <article
                key={post.slug}
                className="min-w-[280px] sm:min-w-[320px] max-w-[320px] post-card snap-start"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/post/${post.slug}`)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/post/${post.slug}`)}
              >
                <div className="aspect-[16/10] overflow-hidden bg-paper-alt">
                  <img src={post.cover} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">{post.category}</p>
                  <h3 className="font-display text-[18px] leading-tight font-bold mb-2 text-ink dark:text-paper">
                    {post.title}
                  </h3>
                  <p className="text-[12px] text-ink-3 line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

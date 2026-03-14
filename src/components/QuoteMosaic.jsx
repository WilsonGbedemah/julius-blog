function pickQuote(post) {
  const html = String(post?.content || '')
  const quoteMatch = html.match(/<blockquote>([\s\S]*?)<\/blockquote>/i)
  const raw = quoteMatch ? quoteMatch[1] : post?.excerpt || post?.title || ''
  const text = String(raw).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > 150 ? `${text.slice(0, 147)}...` : text
}

export default function QuoteMosaic({ posts = [], loading = false }) {
  const cards = (Array.isArray(posts) ? posts : []).slice(0, 4).map((post) => ({
    slug: post.slug,
    title: post.title,
    quote: pickQuote(post),
  }))
  const trainItems = cards.length > 1 ? [...cards, ...cards] : cards

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-content mx-auto px-8">
        <div className="mb-8">
          <div className="eyebrow mb-2">Highlights</div>
          <h2 className="font-display text-[28px] font-bold tracking-tight text-ink dark:text-paper">Quote Mosaic</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" aria-live="polite" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`quote-skeleton-${i}`} className="rounded-card border border-border p-6 bg-paper-alt/70">
                <div className="skeleton-line w-16 mb-4" />
                <div className="skeleton-line w-full mb-2" />
                <div className="skeleton-line w-5/6 mb-2" />
                <div className="skeleton-line w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="quote-train" aria-live="off">
            <div className="quote-train-inner">
              {trainItems.map((item, i) => (
              <article
                key={item.slug || i}
                aria-hidden={i >= cards.length}
                className="quote-train-card"
              >
                <p className="font-display text-[34px] leading-none text-accent mb-3">“</p>
                <p className="text-[13px] leading-relaxed text-ink-2 dark:text-paper/85 mb-4">{item.quote}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-3">{item.title}</p>
              </article>
            ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

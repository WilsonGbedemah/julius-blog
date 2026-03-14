import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import MiniSearch from 'minisearch'
import { getPostViewCount } from '../data/posts'
import PostCard from '../components/PostCard'
import NewsletterForm from '../components/NewsletterForm'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePostsData } from '../hooks/usePostsData'

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const navigate = useNavigate()
  const { posts: allPosts, categories: allCategories, source, loading } = usePostsData()

  useEffect(() => {
    document.title = 'Stories — Julius Dornyo'
  }, [])

  // Sync URL param → filter
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setActiveCategory(cat)
    } else {
      setActiveCategory('all')
    }
  }, [searchParams])

  const setFilter = (cat) => {
    setActiveCategory(cat)
    if (cat === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  // Build MiniSearch index whenever posts change
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ['title', 'excerpt', 'category', 'tagsText'],
      storeFields: ['slug'],
      searchOptions: { boost: { title: 3, excerpt: 2 }, fuzzy: 0.2, prefix: true },
    })
    ms.addAll(
      allPosts.map((p) => ({
        id: p.slug || String(p.id),
        slug: p.slug || '',
        title: p.title || '',
        excerpt: p.excerpt || '',
        category: p.category || '',
        tagsText: (Array.isArray(p.tags) ? p.tags : []).join(' '),
      }))
    )
    return ms
  }, [allPosts])

  // Filter + search
  const searchSlugs = useMemo(() => {
    const q = query.trim()
    if (!q) return null
    return new Set(miniSearch.search(q).map((r) => r.slug))
  }, [miniSearch, query])

  const results = allPosts.filter((p) => {
    const category = p.category || 'Uncategorized'
    const matchCat = activeCategory === 'all' || category === activeCategory
    const matchQ = !searchSlugs || searchSlugs.has(p.slug)
    return matchCat && matchQ
  })

  useScrollReveal([results.length, activeCategory, query])

  const catCounts = allCategories.reduce((acc, c) => {
    acc[c] = allPosts.filter((p) => p.category === c).length
    return acc
  }, {})

  const mostRead = [...allPosts]
    .sort((a, b) => getPostViewCount(b.slug) - getPostViewCount(a.slug))
    .slice(0, 4)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="border-b border-border py-16">
        <div className="max-w-content mx-auto px-8">
          <div className="eyebrow mb-3">All Writing</div>
          <h1 className="font-display text-[clamp(30px,5vw,52px)] font-black tracking-tight mb-2.5">
            Stories
          </h1>
          <p className="text-[16px] text-ink-3 max-w-[480px]">
            Every essay, reflection, and story — searchable and filterable by topic.
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mt-3">
            Source: {source === 'wordpress' ? 'Live WordPress sync' : 'Local fallback'}
          </p>
        </div>
      </header>

      <div className="py-14">
        <div className="max-w-content mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 items-start">

            {/* Main */}
            <div>
              {/* Search */}
              <div className="relative max-w-md mb-5">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stories…"
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded bg-surface text-ink
                             dark:bg-surface dark:text-paper font-body text-sm outline-none
                             focus:border-accent focus:ring-[3px] focus:ring-accent/10 transition-all duration-200"
                />
              </div>

              {/* Result count */}
              <p className="font-mono text-[11px] text-ink-3 mb-5">
                {query
                  ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                  : `${results.length} post${results.length !== 1 ? 's' : ''}`}
              </p>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 mb-9">
                <button
                  className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7" aria-live="polite" aria-busy="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`blog-skeleton-${i}`} className="post-card p-0 overflow-hidden">
                      <div className="aspect-[16/9] skeleton" />
                      <div className="p-5">
                        <div className="skeleton-line w-24 mb-3" />
                        <div className="skeleton-line w-full mb-2" />
                        <div className="skeleton-line w-4/5 mb-4" />
                        <div className="skeleton-line w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-20 text-ink-3">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display text-xl font-bold text-ink mb-2">No posts found</h3>
                  <p className="text-sm">Try a different keyword or browse all categories.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  {results.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-[88px] flex flex-col gap-5">

              {/* Topics */}
              <div className="bg-surface border border-border rounded-card p-6">
                <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4 pb-3 border-b border-border">
                  Topics
                </div>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={`topic-skeleton-${i}`} className="skeleton-line w-full" />
                    ))}
                  </div>
                ) : (
                  <ul className="flex flex-col gap-0.5">
                    {allCategories.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => setFilter(cat)}
                          className="w-full flex items-center justify-between px-2.5 py-2 rounded text-[14px]
                                     text-ink-2 hover:bg-paper-alt hover:text-accent transition-all duration-200"
                        >
                          {cat}
                          <span className="font-mono text-[11px] text-ink-3 bg-paper-alt px-2 py-0.5 rounded-full">
                            {catCounts[cat]}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Recent */}
              <div className="bg-surface border border-border rounded-card p-6">
                <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4 pb-3 border-b border-border">
                  Most Read
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`read-skeleton-${i}`} className="flex gap-3">
                        <div className="w-14 h-11 rounded skeleton" />
                        <div className="flex-1">
                          <div className="skeleton-line w-full mb-2" />
                          <div className="skeleton-line w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="flex flex-col">
                    {mostRead.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => navigate(`/post/${p.slug}`)}
                          className="w-full flex gap-3 py-2.5 border-b border-border last:border-none
                                     text-left group"
                        >
                          <div className="w-14 h-11 rounded overflow-hidden flex-shrink-0 bg-paper-alt">
                            <img src={p.cover} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div>
                            <h4 className="font-display text-[13.5px] font-semibold leading-tight mb-1
                                           group-hover:text-accent transition-colors duration-200">
                              {p.title}
                            </h4>
                            <span className="font-mono text-[10px] text-ink-3">
                              {p.readTime} · {getPostViewCount(p.slug)} views
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sidebar newsletter */}
              <div className="bg-accent-bg border border-accent/30 rounded-card p-6">
                <div className="font-mono text-[10px] tracking-widest uppercase text-accent mb-3 pb-3 border-b border-accent/20">
                  Newsletter
                </div>
                <p className="text-[13px] text-ink-2 mb-4 leading-relaxed">
                  Get new essays delivered to your inbox weekly.
                </p>
                <NewsletterForm variant="light" compact />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

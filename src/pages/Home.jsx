import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'
import EditorsPicksRail from '../components/EditorsPicksRail'
import TopicSpotlightBlocks from '../components/TopicSpotlightBlocks'
import QuoteMosaic from '../components/QuoteMosaic'
import ReadingJourneyTimeline from '../components/ReadingJourneyTimeline'
import AudioCompanion from '../components/AudioCompanion'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePostsData } from '../hooks/usePostsData'

export default function Home() {
  const navigate = useNavigate()
  const { posts, source, loading } = usePostsData()
  const featured = posts.find((p) => p.featured) || posts[0]
  const recent = posts.slice(0, 6)

  useScrollReveal([])

  useEffect(() => {
    document.title = 'Julius Dornyo — Ideas, Stories & Perspectives'
  }, [])

  return (
    <div className="animate-fade-in">
      {/* ── HERO ── */}
      <section className="border-b border-border pb-0">
        <div className="max-w-content mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="eyebrow mb-5 flex items-center gap-2.5 animate-fade-up text-ink-2 dark:text-paper/80">
              <span className="w-6 h-px bg-accent inline-block" />
              Personal Blog · Accra, Ghana
            </div>
            <h1 className="font-display text-[clamp(38px,5.5vw,68px)] font-black leading-[1.06] text-ink dark:text-paper
                           tracking-tight mb-5 animate-fade-up delay-100">
              Ideas worth
              <br />
              <em className="italic text-accent">sitting with.</em>
            </h1>
            <p className="text-[17px] text-ink-2 dark:text-paper/85 leading-relaxed max-w-[480px] mb-9
                          animate-fade-up delay-200">
              A focused archive of Julius Dornyo&apos;s published essays on leadership, decision-making,
              and personal development, plus new local drafts from the in-app editor.
            </p>
            <div className="flex gap-3.5 flex-wrap animate-fade-up delay-300">
              <button className="btn-primary" onClick={() => navigate('/stories')}>
                Browse all posts
              </button>
              <button className="btn-ghost" onClick={() => navigate('/about')}>
                About me
              </button>
            </div>
          </div>

          {/* Featured card */}
          {featured && (
          <div
            className="bg-surface border border-border rounded-card overflow-hidden shadow-card-lg
                       cursor-pointer group transition-transform duration-300 hover:-translate-y-1
                       animate-fade-up delay-[450ms]"
            onClick={() => navigate(`/post/${featured.slug}`)}
          >
            <div className="aspect-[16/10] overflow-hidden bg-paper-alt">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="eager"
              />
            </div>
            <div className="p-7">
              <div className="eyebrow mb-2.5">{featured.category}</div>
              <h2 className="font-display text-[21px] font-bold leading-snug mb-3
                             group-hover:text-accent transition-colors duration-200">
                {featured.title}
              </h2>
              <p className="text-[13.5px] text-ink-3 leading-relaxed mb-4 line-clamp-2">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 font-mono text-[11px] text-ink-3">
                <span>{featured.date}</span>
                <span className="w-1 h-1 rounded-full bg-border-dark" />
                <span>{featured.readTime}</span>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* ── RECENT POSTS ── */}
      <section className="py-20">
        <div className="max-w-content mx-auto px-8">
          <div className="flex items-baseline justify-between mb-9 pb-4 border-b border-border reveal">
            <div>
              <div className="eyebrow mb-2">Latest Writing</div>
              <h2 className="font-display text-[28px] font-bold tracking-tight text-ink dark:text-paper">Recent Posts</h2>
              <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 dark:text-paper/60 mt-1">
                Source: {source === 'wordpress' ? 'Live WordPress sync' : 'Local fallback'}
              </p>
            </div>
            <button
              className="font-mono text-[11px] text-ink-3 hover:text-accent transition-colors duration-200"
              onClick={() => navigate('/stories')}
            >
              All posts →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7" aria-live="polite" aria-busy="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`home-skeleton-${i}`} className="post-card p-0 overflow-hidden">
                  <div className="aspect-[16/9] skeleton" />
                  <div className="p-5">
                    <div className="skeleton-line w-24 mb-3" />
                    <div className="skeleton-line w-full mb-2" />
                    <div className="skeleton-line w-5/6 mb-4" />
                    <div className="skeleton-line w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12 text-ink-3 dark:text-paper/70">No posts available right now.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {recent.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-6">
        <div className="max-w-content mx-auto px-8">
          <AudioCompanion title={featured?.title || 'Featured story'} content={featured?.content || ''} />
        </div>
      </section>

      <EditorsPicksRail posts={posts} loading={loading} />
      <TopicSpotlightBlocks posts={posts} loading={loading} />
      <QuoteMosaic posts={posts} loading={loading} />
      <ReadingJourneyTimeline posts={posts} loading={loading} />

      <NewsletterSection />
      <Footer />
    </div>
  )
}

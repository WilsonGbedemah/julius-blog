import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Twitter, Linkedin, Link2, ArrowLeft } from 'lucide-react'
import { incrementPostView } from '../data/posts'
import PostCard from '../components/PostCard'
import TableOfContents from '../components/TableOfContents'
import NewsletterForm from '../components/NewsletterForm'
import AudioCompanion from '../components/AudioCompanion'
import GiscusComments from '../components/GiscusComments'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePostsData } from '../hooks/usePostsData'
import { useAuthorMeta } from '../hooks/useAuthorMeta'
import { useTheme } from '../hooks/useTheme'

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const toast = document.getElementById('toast')
    if (!toast) return
    toast.textContent = 'Link copied! ✓'
    toast.classList.remove('opacity-0', 'translate-y-4')
    toast.classList.add('opacity-100', 'translate-y-0')
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4')
      toast.classList.remove('opacity-100', 'translate-y-0')
    }, 2800)
  })
}

export default function Post() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { posts: allPosts, loading } = usePostsData()
  const author = useAuthorMeta()
  const { theme } = useTheme()
  const post = allPosts.find((p) => p.slug === slug)

  // related is only computed once post is available to avoid crashing on null post
  const related = post
    ? [
        ...allPosts.filter((p) => p.id !== post.id && p.category === post.category),
        ...allPosts.filter((p) => p.id !== post.id && p.category !== post.category),
      ].slice(0, 3)
    : []

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} — Julius Dornyo`
    window.scrollTo(0, 0)
    incrementPostView(post.slug)
  }, [slug, post])

  useScrollReveal([slug])

  if (loading && !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
        <h1 className="font-display text-[28px] font-bold mb-3">Loading post...</h1>
        <p className="text-ink-3">Fetching the latest article content.</p>
      </div>
    )
  }

  if (!loading && !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
        <h1 className="font-display text-[28px] font-bold mb-3">Post not found</h1>
        <p className="text-ink-3 mb-8">This post may have moved or is no longer available.</p>
        <button onClick={() => navigate('/stories')} className="btn-primary">Back to archive</button>
      </div>
    )
  }

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post.title)

  return (
    <div className="animate-fade-in">
      {/* Toast */}
      <div
        id="toast"
        className="fixed bottom-6 right-6 z-50 bg-ink text-paper font-mono text-[13px]
                   px-5 py-3 rounded shadow-card-lg opacity-0 translate-y-4 pointer-events-none
                   transition-all duration-300"
      />

      {/* Post Hero */}
      <header className="border-b border-border py-16">
        <div className="max-w-post-hero mx-auto px-8">
          <div className="eyebrow mb-3">{post.category}</div>
          <h1 className="font-display text-[clamp(28px,5vw,54px)] font-black leading-[1.1]
                         tracking-tight text-ink dark:text-paper mb-5">
            {post.title}
          </h1>
          <p className="text-[17px] text-ink-3 leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4 flex-wrap font-mono text-[12px] text-ink-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-border">
                <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-ink-2 font-medium">{author.name}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-border-dark" />
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-border-dark" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      {/* Cover image */}
      <div className="max-w-cover mx-auto px-8 pt-10">
        <img
          src={post.cover}
          alt={post.title}
          className="w-full aspect-[16/7] object-cover rounded-card shadow-card"
        />
      </div>

      {/* Article layout */}
      <div className="max-w-post mx-auto px-8 py-14 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-20 items-start">

        {/* Article */}
        <div>
          <article
            id="article-body"
            className="article-body prose prose-lg dark:prose-dark max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-10">
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-3">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-item">{tag}</span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-12 p-7 bg-paper-alt dark:bg-paper-alt/5 rounded-card border border-border
                          flex items-center gap-5 flex-wrap">
            <span className="font-mono text-[10px] tracking-widest uppercase text-ink-3">
              Share this essay
            </span>
            <div className="flex gap-2 flex-wrap">
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
              >
                <Twitter size={13} /> Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
              >
                <Linkedin size={13} /> LinkedIn
              </a>
              <button
                onClick={copyLink}
                className="share-btn hover:bg-accent hover:text-white hover:border-accent"
              >
                <Link2 size={13} /> Copy link
              </button>
            </div>
          </div>

          <AudioCompanion title={post.title} content={post.content} />

          {/* Author bio */}
          <div className="mt-10 p-7 bg-surface border border-border rounded-card flex gap-5 items-start reveal">
            <div className="w-[68px] h-[68px] rounded-full overflow-hidden flex-shrink-0 border-2 border-border">
              <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-display text-[18px] font-bold mb-2">{author.name}</div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                {author.bio}{' '}
                <button
                  onClick={() => navigate('/about')}
                  className="text-accent underline underline-offset-2"
                >
                  Read more →
                </button>
              </p>
            </div>
          </div>

          {/* Comments */}
          <GiscusComments theme={theme} />

          {/* Inline newsletter */}
          <div className="mt-10 bg-ink rounded-card p-9 text-center">
            <div className="eyebrow text-accent-2 mb-3 flex justify-center">Enjoyed this?</div>
            <h3 className="font-display text-[22px] font-bold text-paper mb-2">
              Get the next essay by email
            </h3>
            <p className="text-[14px] text-paper/60 mb-6">
              No hard-coded subscriber counts. Connect directly for updates.
            </p>
            <div className="flex justify-center">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <TableOfContents contentId="article-body" />
          <button
            onClick={() => navigate('/stories')}
            className="flex items-center justify-center gap-2 py-3 bg-surface border border-border
                       rounded-card font-mono text-[12px] text-ink-3 hover:text-accent
                       transition-colors duration-200"
          >
            <ArrowLeft size={13} /> Back to all posts
          </button>
        </aside>
      </div>

      {/* Related posts */}
      <section className="border-t border-border py-16">
        <div className="max-w-content mx-auto px-8">
          <div className="flex items-baseline justify-between mb-9 pb-4 border-b border-border">
            <div>
              <div className="eyebrow mb-2">Keep Reading</div>
              <h2 className="font-display text-[28px] font-bold tracking-tight">Related Essays</h2>
            </div>
            <button
              onClick={() => navigate('/stories')}
              className="font-mono text-[11px] text-ink-3 hover:text-accent transition-colors"
            >
              All posts →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

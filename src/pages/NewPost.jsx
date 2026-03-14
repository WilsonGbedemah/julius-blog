import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine, Eye, EyeOff, Save, UploadCloud, X } from 'lucide-react'
import { getAllPosts, saveLocalPost } from '../data/posts'
import Footer from '../components/Footer'

const KNOWN_CATEGORIES = ['Leadership', 'Personal Development', 'Nation Building']

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function estimateReadTime(text) {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

// Lightweight markdown-to-HTML converter (paragraphs, headings, bold, italic, blockquote)
function markdownToHtml(md) {
  return md
    .split('\n\n')
    .map((block) => {
      const b = block.trim()
      if (!b) return ''
      if (b.startsWith('## ')) return `<h2>${b.slice(3).trim()}</h2>`
      if (b.startsWith('### ')) return `<h3>${b.slice(4).trim()}</h3>`
      if (b.startsWith('> ')) return `<blockquote>${b.slice(2).trim()}</blockquote>`
      const inline = b
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
      return `<p>${inline}</p>`
    })
    .filter(Boolean)
    .join('\n')
}

export default function NewPost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    category: 'Leadership',
    customCategory: '',
    tags: '',
    cover: '',
    featured: false,
    body: '',
  })
  const [preview, setPreview] = useState(false)
  const [published, setPublished] = useState(false)
  const [error, setError] = useState('')
  const coverInputRef = useRef(null)

  function handleCoverFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Please select an image file.')
    const reader = new FileReader()
    reader.onload = (ev) => set('cover', ev.target.result)
    reader.readAsDataURL(file)
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  function handleSubmit(e) {
    if (e) e.preventDefault()
    if (!form.title.trim()) return setError('Title is required.')
    if (!form.body.trim()) return setError('Content is required.')

    const allPosts = getAllPosts()
    const maxId = allPosts.reduce((m, p) => Math.max(m, p.id || 0), 0)
    const slug = slugify(form.title)
    const category =
      form.category === '__custom__'
        ? form.customCategory.trim() || 'General'
        : form.category

    const now = new Date()
    const dateISO = now.toISOString().slice(0, 10)
    const date = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const post = {
      id: maxId + 1,
      slug,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      date,
      dateISO,
      readTime: estimateReadTime(form.body),
      featured: form.featured,
      cover:
        form.cover.trim() ||
        '/covers/prepare-future.svg',
      content: markdownToHtml(form.body),
      local: true,
    }

    saveLocalPost(post)
    setPublished(true)
    setTimeout(() => navigate(`/post/${slug}`), 900)
  }

  const htmlPreview = markdownToHtml(form.body)

  return (
    <div className="animate-fade-in min-h-screen">
      <div className="max-w-narrow mx-auto px-8 py-14">

        {/* Page header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="eyebrow mb-2 flex items-center gap-2">
              <PenLine size={13} />
              New Post
            </div>
            <h1 className="font-display text-[34px] font-black tracking-tight text-ink dark:text-paper">
              Write something.
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="btn-ghost flex items-center gap-1.5 text-sm mt-2"
          >
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            {preview ? 'Back to editor' : 'Preview'}
          </button>
        </div>

        {preview ? (
          /* ── Preview pane ── */
          <div>
            <h2 className="font-display text-[28px] font-black mb-3 text-ink dark:text-paper">
              {form.title || 'Untitled'}
            </h2>
            {form.excerpt && (
              <p className="text-[16px] text-ink-3 mb-6 leading-relaxed">{form.excerpt}</p>
            )}
            {form.cover && (
              <img
                src={form.cover}
                alt="cover"
                className="w-full aspect-[16/7] object-cover rounded-card shadow-card mb-8"
              />
            )}
            <article
              className="prose prose-lg dark:prose-dark max-w-none"
              dangerouslySetInnerHTML={{
                __html: htmlPreview || '<p style="color:#7A7569">Nothing written yet…</p>',
              }}
            />
            <div className="mt-10 flex gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setPreview(false)}
                className="btn-ghost text-sm"
              >
                ← Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Save size={14} />
                {published ? 'Published! Redirecting…' : 'Publish'}
              </button>
            </div>
          </div>
        ) : (
          /* ── Editor form ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Title */}
            <div>
              <label className="label">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Enter your post title…"
                className="field"
                style={{ fontSize: '1.3rem', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}
              />
              {form.title && (
                <p className="font-mono text-[11px] text-ink-3 mt-1.5">
                  slug: /post/{slugify(form.title)}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="label">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="A 1–2 sentence summary shown on post cards…"
                rows={2}
                className="field resize-none"
              />
            </div>

            {/* Category + Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="field cursor-pointer"
                >
                  {KNOWN_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__custom__">Custom…</option>
                </select>
              </div>
              <div>
                <label className="label">
                  Tags{' '}
                  <span className="normal-case font-normal text-ink-3">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="e.g. leadership, discipline, governance"
                  className="field"
                />
              </div>
            </div>

            {/* Custom category */}
            {form.category === '__custom__' && (
              <div>
                <label className="label">Custom category name</label>
                <input
                  type="text"
                  value={form.customCategory}
                  onChange={(e) => set('customCategory', e.target.value)}
                  placeholder="e.g. Travel"
                  className="field"
                />
              </div>
            )}

            {/* Cover image URL */}
            <div>
              <label className="label">Cover image</label>

              {form.cover ? (
                /* ── Preview with remove button ── */
                <div className="relative">
                  <img
                    src={form.cover}
                    alt="cover preview"
                    className="w-full aspect-[16/5] object-cover rounded-card border border-border"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => { set('cover', ''); if (coverInputRef.current) coverInputRef.current.value = '' }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/70 text-white
                               flex items-center justify-center hover:bg-ink transition-colors"
                    aria-label="Remove cover"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                /* ── Upload zone ── */
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-card
                             flex flex-col items-center justify-center gap-3 py-10
                             text-ink-3 cursor-pointer transition-all duration-200
                             hover:border-accent hover:bg-accent-bg hover:text-accent group"
                >
                  <UploadCloud size={32} className="transition-transform duration-200 group-hover:-translate-y-1" />
                  <span className="font-mono text-[11px] tracking-widest uppercase">
                    Click to upload cover image
                  </span>
                  <span className="text-[12px] text-ink-3">PNG, JPG, WEBP · stored in browser</span>
                </button>
              )}

              {/* Hidden file input */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverFile}
              />

              {/* URL fallback */}
              <div className="mt-2.5">
                <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-1.5">
                  Or paste an image URL
                </p>
                <input
                  type="url"
                  value={form.cover.startsWith('data:') ? '' : form.cover}
                  onChange={(e) => set('cover', e.target.value)}
                  placeholder="https://yourdomain.com/cover-image.jpg"
                  className="field text-[13px]"
                />
              </div>
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer w-fit select-none">
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-border peer-checked:bg-accent transition-colors duration-200" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                                peer-checked:translate-x-5 transition-transform duration-200" />
              </span>
              <span className="text-[13px] text-ink-2">Mark as featured post</span>
            </label>

            {/* Content */}
            <div>
              <label className="label">
                Content *
                <span className="ml-2 normal-case font-normal text-ink-3">
                  Markdown supported:&nbsp;
                  <code className="bg-paper-alt px-1 rounded text-[11px]">## Heading</code>
                  {' '}
                  <code className="bg-paper-alt px-1 rounded text-[11px]">**bold**</code>
                  {' '}
                  <code className="bg-paper-alt px-1 rounded text-[11px]">&gt; blockquote</code>
                  &nbsp;— blank line between paragraphs
                </span>
              </label>
              <textarea
                value={form.body}
                onChange={(e) => set('body', e.target.value)}
                placeholder="Start writing your post here…"
                rows={22}
                className="field font-mono text-[13.5px] leading-relaxed resize-y"
              />
              {form.body && (
                <p className="font-mono text-[11px] text-ink-3 mt-1.5">
                  ~{estimateReadTime(form.body)}
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-500 font-mono text-[13px]">{error}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={14} />
                {published ? 'Published! Redirecting…' : 'Publish post'}
              </button>
              <button
                type="button"
                onClick={() => setPreview(true)}
                className="btn-ghost text-sm"
              >
                Preview →
              </button>
            </div>

            <p className="font-mono text-[11px] text-ink-3">
              Posts are saved in your browser&apos;s local storage and appear immediately across the blog.
            </p>
          </form>
        )}
      </div>
      <Footer />
    </div>
  )
}

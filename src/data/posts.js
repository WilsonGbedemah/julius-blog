// ============================================================
// posts.js — All blog content lives here
//
// TO ADD A NEW POST:
// 1. Copy an object below and paste it at the TOP of the array
// 2. Give it the next id, a unique slug, and fill in all fields
// 3. Save — the site updates automatically
// ============================================================

export const POSTS = [
  {
    id: 1,
    slug: 'character-and-competence-virtues-that-should-guide-the-new-npp-government-and-its-appointees-in-leadership',
    title: 'Character and Competence: Virtues That Should Guide Leadership',
    excerpt: 'A civic reflection on why leadership must combine integrity with practical competence to serve people well.',
    category: 'Leadership',
    tags: ['leadership', 'governance', 'integrity', 'ghana'],
    date: 'May 26, 2017',
    dateISO: '2017-05-26',
    readTime: '8 min read',
    featured: true,
    cover: '/covers/character-competence.svg',
    content: `
      <p>This essay argues that good leadership is not only about technical skill. It also requires moral character that can withstand pressure and public trust.</p>
      <p>Using examples from governance in Ghana, Julius frames corruption as a consequence of leadership that prizes ability but ignores integrity.</p>
      <h2>Core Argument</h2>
      <p>Character without competence cannot execute, and competence without character cannot be trusted. Public leadership needs both virtues working together.</p>
      <blockquote>Leadership that serves people must be guided by integrity of heart and skillfulness of hands.</blockquote>
      <p>This page summarises the original article and links to the full source below.</p>
      <p><a href="https://juliusdornyo.wordpress.com/2017/05/26/character-and-competence-virtues-that-should-guide-the-new-npp-government-and-its-appointees-in-leadership/" target="_blank" rel="noopener noreferrer">Read the original post on WordPress</a></p>
    `,
  },
  {
    id: 2,
    slug: 'the-power-of-decision',
    title: 'The Power of Decision',
    excerpt: 'A motivational call to move from intention to action, with examples of how decisive choices shape personal destiny.',
    category: 'Personal Development',
    tags: ['decision-making', 'purpose', 'growth', 'motivation'],
    date: 'May 9, 2017',
    dateISO: '2017-05-09',
    readTime: '7 min read',
    featured: true,
    cover: '/covers/power-of-decision.svg',
    content: `
      <p>This article is built around a practical challenge: many people dream about change but delay the decision that initiates real progress.</p>
      <p>Julius uses personal observations and public examples to show that direction in life is rarely accidental. It starts with a clear commitment, followed by disciplined action.</p>
      <h2>Main Takeaway</h2>
      <p>Dreams remain dreams without decisive steps. A decision creates focus, and focus creates momentum.</p>
      <blockquote>This world has respect for doers only.</blockquote>
      <p>This page summarises the original article and links to the full source below.</p>
      <p><a href="https://juliusdornyo.wordpress.com/2017/05/09/the-power-of-decision/" target="_blank" rel="noopener noreferrer">Read the original post on WordPress</a></p>
    `,
  },
  {
    id: 3,
    slug: 'prepare-for-your-future',
    title: 'Prepare For Your Future',
    excerpt: 'A structured reminder that vision, strategy, determination, dedication, and discipline are practical foundations for long-term progress.',
    category: 'Personal Development',
    tags: ['future', 'vision', 'discipline', 'strategy'],
    date: 'April 26, 2017',
    dateISO: '2017-04-26',
    readTime: '6 min read',
    featured: false,
    cover: '/covers/prepare-future.svg',
    content: `
      <p>This post focuses on preparation as a daily discipline rather than a vague wish for tomorrow.</p>
      <p>Julius outlines five practical pillars: vision, strategy, determination, dedication, and discipline. The message is direct: future outcomes are tied to present habits.</p>
      <h2>Main Takeaway</h2>
      <p>A future you are not preparing for is unlikely to materialize. Consistent alignment between today and tomorrow is what turns aspiration into reality.</p>
      <p>This page summarises the original article and links to the full source below.</p>
      <p><a href="https://juliusdornyo.wordpress.com/2017/04/26/prepare-for-your-future/" target="_blank" rel="noopener noreferrer">Read the original post on WordPress</a></p>
    `,
  },
]

// ── Runtime helpers (localStorage-backed) ──
const LOCAL_POSTS_KEY = 'julius_local_posts'
const WP_POSTS_CACHE_KEY = 'julius_wp_posts_cache_v1'
const WP_POSTS_CACHE_TTL_MS = 1000 * 60 * 30
const POST_VIEWS_KEY = 'julius_post_views_v1'
const WP_POSTS_CACHE_VERSION = 2
// WordPress.com-hosted blogs use public-api.wordpress.com, not /wp-json on the site itself
const WP_POSTS_ENDPOINT = 'https://public-api.wordpress.com/wp/v2/sites/juliusdornyo.wordpress.com/posts'
const WP_POSTS_LEGACY_ENDPOINT = 'https://juliusdornyo.wordpress.com/wp-json/wp/v2/posts'

export const DEFAULT_AUTHOR = {
  name: 'Julius Dornyo',
  bio: 'Trained journalist and leadership-focused writer from Ghana. Essays on character, competence, personal growth, and nation-building.',
  avatarUrl:
    'https://2.gravatar.com/avatar/bba22e3d52ebd1918875e677f7b286d257b8d49520c129875cbd66af105557d0?s=96&d=identicon&r=G',
}

// The WordPress.com users API requires authentication — always use DEFAULT_AUTHOR.
export async function fetchAuthorMeta() {
  return DEFAULT_AUTHOR
}

function decodeHtml(input) {
  if (!input) return ''
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return String(input)
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
  }

  const doc = new DOMParser().parseFromString(String(input), 'text/html')
  return doc.documentElement.textContent || ''
}

function stripHtml(input) {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function toDisplayDate(dateValue) {
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function estimateReadTimeFromHtml(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function mapWordPressPost(post) {
  const termBuckets = Array.isArray(post?._embedded?.['wp:term']) ? post._embedded['wp:term'] : []
  const terms = termBuckets.flat()
  const categories = terms
    .filter((t) => t?.taxonomy === 'category')
    .map((t) => decodeHtml(t?.name || ''))
    .filter(Boolean)
  const tags = terms
    .filter((t) => t?.taxonomy === 'post_tag')
    .map((t) => decodeHtml(t?.name || ''))
    .filter(Boolean)

  const featuredMedia = Array.isArray(post?._embedded?.['wp:featuredmedia'])
    ? post._embedded['wp:featuredmedia'][0]
    : null

  const classList = Array.isArray(post?.class_list) ? post.class_list : []
  const classCategory = classList
    .find((token) => String(token).startsWith('category-'))
    ?.replace('category-', '')
    ?.replace(/-/g, ' ')
  const fallbackCategory = classCategory
    ? classCategory.charAt(0).toUpperCase() + classCategory.slice(1)
    : ''

  const title = decodeHtml(post?.title?.rendered || 'Untitled post')
  const excerpt = stripHtml(post?.excerpt?.rendered || '').slice(0, 220)
  const content = String(post?.content?.rendered || '<p>No content available.</p>')

  return {
    id: Number(post?.id) || Date.now(),
    slug: String(post?.slug || '').trim() || `wp-post-${post?.id || Date.now()}`,
    title,
    excerpt,
    category: categories[0] || fallbackCategory || 'General',
    tags,
    date: toDisplayDate(post?.date),
    dateISO: String(post?.date || '').slice(0, 10),
    readTime: estimateReadTimeFromHtml(content),
    featured: false,
    cover: featuredMedia?.source_url || post?.jetpack_featured_media_url || '/covers/prepare-future.svg',
    content,
    sourceUrl: post?.link || '',
  }
}

function mergeBySlug(primary, secondary) {
  const map = new Map()
  for (const post of [...secondary, ...primary]) {
    if (!post?.slug) continue
    map.set(post.slug, post)
  }
  return [...map.values()]
}

export function getLocalPosts() {
  if (typeof window === 'undefined') return []

  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]')
    if (!Array.isArray(raw)) return []

    return raw.map((post, index) => ({
      id: Number(post?.id) || 10000 + index,
      slug: String(post?.slug || `local-post-${index}`),
      title: String(post?.title || 'Untitled post'),
      excerpt: String(post?.excerpt || ''),
      category: String(post?.category || 'Uncategorized'),
      tags: Array.isArray(post?.tags) ? post.tags : [],
      date: String(post?.date || ''),
      dateISO: String(post?.dateISO || ''),
      readTime: String(post?.readTime || '1 min read'),
      featured: Boolean(post?.featured),
      cover: String(post?.cover || '/covers/prepare-future.svg'),
      content: String(post?.content || '<p>No content provided.</p>'),
      local: true,
    }))
  } catch {
    return []
  }
}

export function saveLocalPost(post) {
  if (typeof window === 'undefined') return

  const posts = getLocalPosts()
  const idx = posts.findIndex((p) => p.slug === post.slug)
  if (idx !== -1) {
    posts[idx] = post
  } else {
    posts.unshift(post)
  }
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts))
}

function getCachedWpPosts() {
  if (typeof window === 'undefined') return []

  try {
    const raw = JSON.parse(localStorage.getItem(WP_POSTS_CACHE_KEY) || '{}')
    if (!Array.isArray(raw?.posts)) return []
    if (Number(raw?.version || 1) !== WP_POSTS_CACHE_VERSION) return []
    if (raw?.endpoint !== WP_POSTS_ENDPOINT) return []
    const isFresh = Date.now() - Number(raw?.fetchedAt || 0) < WP_POSTS_CACHE_TTL_MS
    return isFresh ? raw.posts : []
  } catch {
    return []
  }
}

function setCachedWpPosts(posts) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    WP_POSTS_CACHE_KEY,
    JSON.stringify({
      version: WP_POSTS_CACHE_VERSION,
      endpoint: WP_POSTS_ENDPOINT,
      fetchedAt: Date.now(),
      posts,
    })
  )
}

async function fetchJsonWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function fetchWordPressPosts() {
  const cached = getCachedWpPosts()
  if (cached.length) return cached

  try {
    const requests = [
      `${WP_POSTS_LEGACY_ENDPOINT}?_embed&per_page=20`,
      `${WP_POSTS_ENDPOINT}?_embed&per_page=20`,
      `${WP_POSTS_ENDPOINT}?per_page=20`,
      // WordPress.com v1.1 legacy feed fallback
      'https://public-api.wordpress.com/rest/v1.1/sites/juliusdornyo.wordpress.com/posts/?number=20',
    ]

    let data = []
    for (const url of requests) {
      const json = await fetchJsonWithTimeout(url)
      if (Array.isArray(json) && json.length) {
        data = json
        break
      }

      if (Array.isArray(json?.posts) && json.posts.length) {
        data = json.posts
        break
      }
    }

    if (!Array.isArray(data) || !data.length) return []

    const mapped = data
      .map(mapWordPressPost)
      // Skip posts with no real title or numeric-only slugs (WordPress junk drafts)
      .filter((p) => p.slug && p.title && !/^\d+$/.test(p.slug))

    if (mapped.length) {
      mapped[0].featured = true
      setCachedWpPosts(mapped)
    }

    return mapped
  } catch {
    return []
  }
}

export async function getLiveOrFallbackPosts() {
  const remote = await fetchWordPressPosts()
  const base = remote.length ? remote : POSTS
  return mergeBySlug(getLocalPosts(), base)
}

export async function getLiveOrFallbackCategories() {
  const posts = await getLiveOrFallbackPosts()
  return [...new Set(posts.map((p) => p.category || 'Uncategorized'))]
}

export function getPostViewCount(slug) {
  if (typeof window === 'undefined') return 0
  try {
    const store = JSON.parse(localStorage.getItem(POST_VIEWS_KEY) || '{}')
    return Number(store?.[slug] || 0)
  } catch {
    return 0
  }
}

export function incrementPostView(slug) {
  if (typeof window === 'undefined' || !slug) return

  try {
    const store = JSON.parse(localStorage.getItem(POST_VIEWS_KEY) || '{}')
    store[slug] = Number(store?.[slug] || 0) + 1
    localStorage.setItem(POST_VIEWS_KEY, JSON.stringify(store))
  } catch {
    // no-op when storage is unavailable
  }
}

export function getAllPosts() {
  return [...getLocalPosts(), ...POSTS]
}

export function getAllCategories() {
  return [...new Set(getAllPosts().map((p) => p.category))]
}

import { useEffect, useState } from 'react'
import {
  getAllCategories,
  getAllPosts,
  getLiveOrFallbackCategories,
  getLiveOrFallbackPosts,
} from '../data/posts'

export function usePostsData() {
  const [posts, setPosts] = useState(getAllPosts())
  const [categories, setCategories] = useState(getAllCategories())
  const [source, setSource] = useState('fallback')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const loadingStartedAt = Date.now()

    async function load() {
      try {
        const [livePosts, liveCategories] = await Promise.all([
          getLiveOrFallbackPosts(),
          getLiveOrFallbackCategories(),
        ])

        if (cancelled) return

        const safePosts = Array.isArray(livePosts) && livePosts.length ? livePosts : getAllPosts()
        const safeCategories = Array.isArray(liveCategories) && liveCategories.length
          ? liveCategories
          : [...new Set(safePosts.map((p) => p.category || 'Uncategorized'))]

        setPosts(safePosts)
        setCategories(safeCategories)

        const hasRemotePost = safePosts.some((p) => p?.sourceUrl)
        setSource(hasRemotePost ? 'wordpress' : 'fallback')
      } finally {
        if (!cancelled) {
          const elapsed = Date.now() - loadingStartedAt
          const minLoadingMs = 650
          const waitMs = Math.max(0, minLoadingMs - elapsed)
          setTimeout(() => {
            if (!cancelled) setLoading(false)
          }, waitMs)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { posts, categories, source, loading }
}

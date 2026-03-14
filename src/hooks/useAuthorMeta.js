import { useEffect, useState } from 'react'
import { DEFAULT_AUTHOR, fetchAuthorMeta } from '../data/posts'

export function useAuthorMeta() {
  const [author, setAuthor] = useState(DEFAULT_AUTHOR)

  useEffect(() => {
    fetchAuthorMeta().then(setAuthor)
  }, [])

  return author
}

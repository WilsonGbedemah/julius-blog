import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import ReadingProgress from './components/ReadingProgress'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Post from './pages/Post'
import About from './pages/About'
import NewPost from './pages/NewPost'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ReadingProgress />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Blog />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/write" element={<NewPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
      <div className="font-display text-[80px] font-black text-border mb-4">404</div>
      <h1 className="font-display text-[28px] font-bold mb-3">Page not found</h1>
      <p className="text-ink-3 mb-8">This page doesn&apos;t exist or has been moved.</p>
      <a href="/" className="btn-primary">Go home</a>
    </div>
  )
}

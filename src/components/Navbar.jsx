import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X, PenLine } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/stories', label: 'Stories' },
    { to: '/about', label: 'About' },
  ]

  return (
    <header
      className={`sticky top-0 z-40 bg-paper dark:bg-ink border-b border-border dark:border-border
                  backdrop-blur-md transition-shadow duration-200
                  ${scrolled ? 'shadow-card-sm' : ''}`}
    >
      <div className="max-w-content mx-auto px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="font-display text-[22px] font-bold tracking-tight text-ink dark:text-paper flex-shrink-0">
          Julius<span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/write"
            className="hidden md:flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase
                       bg-accent text-white px-5 py-2.5 rounded-full border border-accent
                       transition-all duration-200 hover:bg-accent-hover
                       hover:shadow-[0_0_14px_rgba(184,92,42,0.40)] hover:-translate-y-px"
          >
            <PenLine size={13} />
            Write
          </Link>
          <Link
            to="/stories"
            className="hidden md:block btn-primary text-sm"
          >
            Explore
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-9 h-9 rounded flex items-center justify-center
                       bg-paper-alt border border-border text-ink-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full flex items-center justify-center
                       bg-paper-alt dark:bg-paper-alt/10 border border-border dark:border-border
                       text-ink-2 dark:text-ink-3 transition-all duration-200 hover:bg-border"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-paper dark:bg-ink px-8 py-4 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link py-3 border-b border-border last:border-none
                          ${pathname === to ? 'text-accent' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/write"
            className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px]
                       tracking-wider uppercase bg-accent text-white px-5 py-3 rounded-full
                       border border-accent transition-all duration-200"
          >
            <PenLine size={13} /> Write
          </Link>
          <Link to="/stories" className="btn-primary text-center mt-3">Explore</Link>
        </div>
      )}
    </header>
  )
}

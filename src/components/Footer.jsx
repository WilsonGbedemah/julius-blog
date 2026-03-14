import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pt-16 pb-0 mt-auto">
      <div className="max-w-content mx-auto px-8 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12
                      border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold mb-3">
            Julius<span className="text-accent">.</span>
          </h2>
          <p className="text-sm text-paper/50 leading-relaxed max-w-[240px]">
            Archived essays by Julius Dornyo, with new drafts written locally in this app.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-widest uppercase text-accent-2 mb-4">Pages</h4>
          <ul className="flex flex-col gap-2">
            {[['/', 'Home'], ['/stories', 'Stories'], ['/about', 'About']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-paper/50 hover:text-paper transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-widest uppercase text-accent-2 mb-4">Topics</h4>
          <ul className="flex flex-col gap-2">
            {['Leadership', 'Personal Development', 'Nation Building'].map((cat) => (
              <li key={cat}>
                <Link
                  to={`/stories?category=${cat}`}
                  className="text-sm text-paper/50 hover:text-paper transition-colors duration-200"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-widest uppercase text-accent-2 mb-4">Connect</h4>
          <ul className="flex flex-col gap-2">
            {[
              ['https://juliusdornyo.wordpress.com', 'WordPress Archive'],
              ['https://juliusdornyo.wordpress.com/contact/', 'Contact Page'],
              ['https://juliusdornyo.wordpress.com/feed/', 'RSS Feed'],
              ['mailto:julius_dornyo@yahoo.com', 'Email'],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-sm text-paper/50 hover:text-paper transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-content mx-auto px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2
                      font-mono text-[11px] text-paper/28">
        <span>© {new Date().getFullYear()} Julius Dornyo. All rights reserved.</span>
        <span>Built with React, Vite & Tailwind CSS</span>
      </div>
    </footer>
  )
}

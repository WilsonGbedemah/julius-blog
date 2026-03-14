import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useAuthorMeta } from '../hooks/useAuthorMeta'

const TOPICS = [
  { icon: '🧭', title: 'Leadership', desc: 'Practical reflections on character, competence, and public responsibility.' },
  { icon: '📈', title: 'Personal Development', desc: 'Decision-making, discipline, and growth through intentional habits.' },
  { icon: '🇬🇭', title: 'Nation Building', desc: 'Writing rooted in Ghana and the broader transformation of society.' },
  { icon: '✍️', title: 'Civic Reflection', desc: 'Essays aimed at thoughtful participation in community and governance.' },
  { icon: '🙏', title: 'Values & Faith', desc: 'Moral imagination, integrity, and purpose in everyday life.' },
  { icon: '🗣️', title: 'Public Voice', desc: 'Writing to inform, encourage, and challenge complacency.' },
]

export default function About() {
  const navigate = useNavigate()
  const author = useAuthorMeta()

  useEffect(() => {
    document.title = 'About — Julius Dornyo'
  }, [])

  useScrollReveal([])

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="border-b border-border py-20">
        <div className="max-w-content mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-up">
            <div className="eyebrow mb-5">About the author</div>
            <h1 className="font-display text-[clamp(34px,5vw,58px)] font-black tracking-tight leading-tight mb-6">
              I&apos;m Julius.<br />
              <em className="italic text-accent">I write to inspire transformation.</em>
            </h1>
            <p className="text-[16px] text-ink-2 leading-relaxed mb-4">
              {author.bio}
            </p>
            <p className="text-[16px] text-ink-2 leading-relaxed">
              This site is born out of the desire to see transformation in the lives of readers,
              and to contribute to the transformation of nation and continent.
            </p>
            <div className="flex gap-8 mt-9 pt-7 border-t border-border">
              {[['3', 'Published Posts'], ['2017', 'Archive Start']].map(([n, l]) => (
                <div key={l} className="flex flex-col gap-1">
                  <span className="font-display text-[30px] font-black text-accent leading-none">{n}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-ink-3">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up delay-200">
            <div className="absolute -inset-2 border border-accent/25 rounded-[14px] -z-10" />
            <img
              src={author.avatarUrl.replace('s=96', 's=600')}
              alt={author.name}
              className="w-full aspect-[4/5] object-cover rounded-card shadow-card-lg"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="py-20">
        <div className="max-w-narrow mx-auto px-8">
          <h2 className="font-display text-[26px] font-bold mb-5">The longer version</h2>
          <p className="text-[16px] text-ink-2 leading-[1.85] mb-5">
            The public author profile describes Julius as a trained journalist and a well-driven
            young man committed to leadership and human potential. His essays focus on growth,
            discipline, civic integrity, and responsibility in public life.
          </p>
          <p className="text-[16px] text-ink-2 leading-[1.85] mb-5">
            The writing archive currently contains a focused set of posts published in 2017,
            including essays on decision-making, future preparation, and the link between character
            and competence in leadership.
          </p>
          <p className="text-[16px] text-ink-2 leading-[1.85]">
            This app mirrors that archive and also supports writing new local posts from the
            built-in editor, so the website can function as both an archive and an active writing workspace.
          </p>

          <hr className="my-14 border-border" />

          <h2 className="font-display text-[26px] font-bold mb-3">What this blog is about</h2>
          <p className="text-[16px] text-ink-2 leading-[1.85] mb-8">
            The archive centers on leadership, growth, and civic responsibility,
            reflected in the core themes below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((t) => (
              <div key={t.title} className="reveal p-5 border border-border rounded-card bg-surface">
                <div className="text-[22px] mb-2.5">{t.icon}</div>
                <h3 className="font-display text-[16px] font-bold mb-1.5">{t.title}</h3>
                <p className="text-[13px] text-ink-3 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <hr className="my-14 border-border" />

          <h2 className="font-display text-[26px] font-bold mb-5">How to read this blog</h2>
          <p className="text-[16px] text-ink-2 leading-[1.85] mb-5">
            If you&apos;re new here, I&apos;d suggest starting with{' '}
            <button
              onClick={() => navigate('/post/character-and-competence-virtues-that-should-guide-the-new-npp-government-and-its-appointees-in-leadership')}
              className="text-accent underline underline-offset-2"
            >
              Character and Competence
            </button>{' '}
            or{' '}
            <button
              onClick={() => navigate('/post/the-power-of-decision')}
              className="text-accent underline underline-offset-2"
            >
              The Power of Decision
            </button>
            . These essays give a strong sense of the tone and purpose of the archive.
          </p>
          <p className="text-[16px] text-ink-2 leading-[1.85]">
            For direct contact, use{' '}
            <a href="mailto:julius_dornyo@yahoo.com" className="text-accent underline underline-offset-2">julius_dornyo@yahoo.com</a>
            {' '}or visit the{' '}
            <a href="https://juliusdornyo.wordpress.com" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">original WordPress archive</a>.
          </p>
        </div>
      </div>

      <NewsletterSection />
      <Footer />
    </div>
  )
}

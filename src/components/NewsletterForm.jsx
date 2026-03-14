import { useState } from 'react'

export default function NewsletterForm({ variant = 'dark', compact = false }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (email.includes('@')) setDone(true)
  }

  if (done) {
    return (
      <p className={`text-sm py-3 px-4 rounded border w-full break-words
                     ${variant === 'dark'
                       ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                       : 'text-emerald-700 border-emerald-300 bg-emerald-50'}`}>
        ✓ You&apos;re subscribed! Welcome aboard.
      </p>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex gap-2.5 w-full mx-auto ${compact ? 'flex-col max-w-none' : 'flex-col sm:flex-row max-w-md'}`}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`flex-1 px-4 py-3 rounded font-body text-sm outline-none transition-colors duration-200
                    ${variant === 'dark'
                      ? 'bg-white/10 border border-white/15 text-paper placeholder:text-paper/40 focus:border-accent-2'
                      : 'bg-white border border-border text-ink placeholder:text-ink-3 focus:border-accent'}`}
      />
      <button
        type="submit"
        className="font-mono text-[11px] tracking-wider uppercase px-5 py-3 bg-accent text-white w-full sm:w-auto
                   rounded flex-shrink-0 transition-all duration-200 hover:bg-accent-hover hover:-translate-y-px"
      >
        Subscribe
      </button>
    </form>
  )
}

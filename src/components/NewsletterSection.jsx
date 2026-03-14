import NewsletterForm from './NewsletterForm'

export default function NewsletterSection() {
  return (
    <section className="bg-ink py-20 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute w-96 h-96 rounded-full -top-24 -right-24 pointer-events-none
                      bg-[radial-gradient(circle,rgba(184,92,42,0.2)_0%,transparent_70%)]" />

      <div className="max-w-[560px] mx-auto px-8 text-center relative">
        <div className="eyebrow text-accent-2 mb-4 flex items-center justify-center gap-2.5">
          Stay Connected
        </div>
        <h2 className="font-display text-[clamp(26px,4vw,42px)] font-bold leading-tight
                       text-paper mb-4 tracking-tight">
          Get new essays{' '}
          <em className="italic text-accent-2">in your inbox</em>
        </h2>
        <p className="text-[15px] text-paper/62 mb-8 leading-relaxed">
          Use this form for simple email capture in your own deployment.
          Reader counts are intentionally not hard-coded.
        </p>

        <NewsletterForm variant="dark" />
        <p className="font-mono text-[10px] text-paper/28 tracking-wide mt-4">
          Unsubscribe anytime · No ads, ever
        </p>
      </div>
    </section>
  )
}

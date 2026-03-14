import { useNavigate } from 'react-router-dom'

export default function PostCard({ post, size = 'normal' }) {
  const navigate = useNavigate()

  return (
    <article
      className="post-card group"
      onClick={() => navigate(`/post/${post.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/post/${post.slug}`)}
    >
      {/* Cover image */}
      <div className={`relative overflow-hidden bg-paper-alt ${size === 'large' ? 'aspect-[16/9]' : 'aspect-[16/9]'}`}>
        <img
          src={post.cover}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute bottom-2.5 right-2.5 font-mono text-[10px] bg-ink/75 text-white
                         px-2 py-0.5 rounded backdrop-blur-sm">
          {post.readTime}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="eyebrow mb-2">{post.category}</div>
        <h3 className={`font-display font-bold leading-tight text-ink dark:text-paper mb-2.5
                        group-hover:text-accent transition-colors duration-200
                        ${size === 'large' ? 'text-[22px]' : 'text-[18px]'}`}>
          {post.title}
        </h3>
        <p className="text-[13px] text-ink-3 leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 font-mono text-[11px] text-ink-3">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-border-dark" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  )
}

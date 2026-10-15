import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { ui, type journal } from '../../content'
import { cn, fill } from '../../lib/format'
import { Picture } from '../ui/Picture'

export type Post = (typeof journal.posts)[number]

/** Journal story card: image, category · read time, title, excerpt. */
export function PostCard({ post, className, large = false }: { post: Post; className?: string; large?: boolean }) {
  const href = `/journal/${post.slug}`
  return (
    <article className={cn('group', className)}>
      <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
        <Picture image={post.image} alt="" hoverZoom className={cn('rounded-sm', large ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[4/3]')} />
      </Link>
      <p className="eyebrow mt-5 text-secondary">
        {post.category} <span aria-hidden="true">·</span> {fill(ui.minRead, { minutes: post.minutes })}
      </p>
      <h3 className={cn('mt-3 font-display leading-snug', large ? 'text-[1.6rem] md:text-[2.1rem]' : 'text-[1.4rem] md:text-[1.55rem]')}>
        <Link to={href} className="transition-colors duration-300 hover:text-accent-deep">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
      <Link
        to={href}
        aria-label={`${ui.readMore}: ${post.title}`}
        className="mt-5 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.16em]"
      >
        <span className="link-draw">{ui.readMore}</span>
        <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </article>
  )
}

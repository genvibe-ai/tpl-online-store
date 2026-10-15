import { Link } from 'react-router'
import { home, journal } from '../../content'
import { PostCard } from '../journal/PostCard'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** The three latest journal stories. */
export function JournalTeaser() {
  const section = home.journal
  return (
    <section id={section.id} aria-labelledby="journal-title" className="section-pad border-t border-foreground/10 bg-surface/50">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="journal-title" eyebrow={section.eyebrow} heading={section.heading} />
          <Link to={section.cta.href} className="link-draw text-[0.75rem] font-medium uppercase tracking-[0.16em]">
            {section.cta.label}
          </Link>
        </div>
        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-8">
          {journal.posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

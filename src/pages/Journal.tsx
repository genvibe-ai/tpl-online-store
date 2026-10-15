import { PostCard } from '../components/journal/PostCard'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { journal } from '../content'
import { plain } from '../lib/format'
import { usePageMeta } from '../lib/site'

/** /journal — every story; the newest one is shown large. */
export function JournalPage() {
  usePageMeta({ title: plain(journal.title), description: journal.intro })
  const [first, ...rest] = journal.posts

  return (
    <div className="container-page pb-24 pt-8 md:pb-32 md:pt-12">
      <Breadcrumbs items={[{ label: journal.eyebrow }]} />
      <SectionHeading as="h1" className="mt-8 md:mt-10" eyebrow={journal.eyebrow} heading={journal.title} intro={journal.intro} />
      {first && (
        <Reveal className="mt-12 md:mt-16">
          <PostCard post={first} large />
        </Reveal>
      )}
      <div className="mt-16 grid gap-12 border-t border-foreground/10 pt-12 md:grid-cols-2 md:gap-8">
        {rest.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.08}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

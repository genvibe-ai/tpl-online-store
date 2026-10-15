import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useParams } from 'react-router'
import { PostCard } from '../components/journal/PostCard'
import { ProductCard } from '../components/product/ProductCard'
import { Accent } from '../components/ui/Accent'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Picture } from '../components/ui/Picture'
import { EASE, Reveal } from '../components/ui/Reveal'
import { journal, ui } from '../content'
import { getProducts } from '../lib/catalog'
import { cn, fill, formatDate, plain } from '../lib/format'
import { usePageMeta } from '../lib/site'
import { NotFoundPage } from './NotFound'

/** /journal/:slug — one story, the products it mentions, and more stories. */
export function JournalPostPage() {
  const { slug } = useParams()
  const post = journal.posts.find((p) => p.slug === slug)
  usePageMeta({ title: post?.title, description: post?.excerpt, image: post?.image })
  if (!post) return <NotFoundPage />

  const products = getProducts(post.productIds)
  const more = journal.posts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <article>
      <header className="container-page max-w-4xl pb-10 pt-8 text-center md:pb-14 md:pt-12">
        <Breadcrumbs items={[{ label: journal.eyebrow, href: '/journal' }, { label: post.title }]} className="flex justify-center" />
        <motion.p
          className="eyebrow mt-10 text-secondary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {post.category} <span aria-hidden="true">·</span> {fill(ui.minRead, { minutes: post.minutes })}
        </motion.p>
        <motion.h1
          className="display-lg mx-auto mt-5 max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
        >
          {post.title}
        </motion.h1>
        <motion.p
          className="mt-6 text-sm text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {post.author} · <time dateTime={post.date}>{formatDate(post.date)}</time>
        </motion.p>
      </header>

      <div className="container-page max-w-6xl">
        <Picture image={post.image} priority className="aspect-[16/10] rounded-sm md:aspect-[21/10]" />
      </div>

      <div className="container-page max-w-[44rem] py-14 md:py-20">
        <p className="font-display text-[1.45rem] font-light leading-[1.5] md:text-[1.65rem]">{post.excerpt}</p>
        <div className="mt-10 space-y-6 text-[1.075rem] leading-[1.8] text-foreground/85">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <Link to="/journal" className="group mt-12 inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]">
          <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="link-draw">{journal.back}</span>
        </Link>
      </div>

      {products.length > 0 && (
        <section aria-labelledby="story-products" className="section-pad border-t border-foreground/10 bg-surface/50">
          <div className="container-page">
            <Reveal>
              <h2 id="story-products" className="display-md">
                <Accent text={journal.shopTheStory} />
              </h2>
            </Reveal>
            <ul className={cn('mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:mt-12', products.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3')}>
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section aria-labelledby="more-stories" className="section-pad border-t border-foreground/10">
          <div className="container-page">
            <h2 id="more-stories" className="display-md">
              {plain(journal.moreStories)}
            </h2>
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-8">
              {more.map((p) => (
                <Reveal key={p.slug}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

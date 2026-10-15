import { BadgeCheck, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { productPage, ui } from '../../content'
import { ratingBreakdown, type Product } from '../../lib/catalog'
import { fill, formatDate } from '../../lib/format'
import { toast } from '../../store/toast'
import { Button } from '../ui/Button'
import { Reveal, EASE } from '../ui/Reveal'
import { Stars } from '../ui/Stars'

/** Rating summary with star bars, plus the written reviews. */
export function ProductReviews({ product }: { product: Product }) {
  const breakdown = ratingBreakdown(product.rating)

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-pad border-t border-foreground/10">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <h2 id="reviews-title" className="display-md">
            {productPage.reviewsHeading}
          </h2>
          <div className="mt-7 flex items-end gap-4">
            <span className="font-display text-[4.25rem] font-light leading-[0.85]">{product.rating.toFixed(1)}</span>
            <div className="pb-1">
              <Stars rating={product.rating} size={16} />
              <p className="mt-1 text-sm text-muted">{fill(productPage.basedOn, { count: product.reviewCount })}</p>
            </div>
          </div>
          <ul className="mt-8 space-y-2.5" aria-label={ui.ratingBreakdown}>
            {breakdown.map((percent, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="flex w-7 items-center gap-1 tabular-nums">
                  {5 - i}
                  <Star aria-hidden="true" className="size-3 text-accent" fill="currentColor" strokeWidth={0} />
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                  <motion.span
                    className="block h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.06 }}
                  />
                </span>
                <span className="w-10 text-right text-muted tabular-nums">{percent}%</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-9" onClick={() => toast({ title: productPage.writeReviewToast })}>
            {productPage.writeReview}
          </Button>
        </Reveal>

        <ol className="divide-y divide-foreground/10 lg:col-span-8">
          {product.reviews.map((review, i) => (
            <li key={review.id} className="py-8 first:pt-0 last:pb-0">
              <Reveal delay={i * 0.06}>
                <article>
                  <header className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <img
                      src={review.avatar.src}
                      alt=""
                      width={review.avatar.width}
                      height={review.avatar.height}
                      loading="lazy"
                      decoding="async"
                      className="size-12 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-x-2.5 font-medium">
                        {review.author}
                        <span className="inline-flex items-center gap-1 text-xs font-normal text-secondary">
                          <BadgeCheck aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                          {productPage.verified}
                        </span>
                      </p>
                      <p className="text-sm text-muted">
                        {review.skinType} · {review.location}
                      </p>
                    </div>
                    <time dateTime={review.date} className="text-sm text-muted">
                      {formatDate(review.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </header>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Stars rating={review.rating} size={13} />
                    <h3 className="font-display text-[1.25rem] leading-snug">{review.title}</h3>
                  </div>
                  <p className="mt-3 max-w-2xl leading-relaxed text-foreground/80">{review.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

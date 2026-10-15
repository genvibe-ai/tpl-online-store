import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { home, site } from '../../content'
import { catalogRating, getReview } from '../../lib/catalog'
import { fill } from '../../lib/format'
import { Accent } from '../ui/Accent'
import { Picture } from '../ui/Picture'
import { Reveal } from '../ui/Reveal'
import { Stars } from '../ui/Stars'

/** Three featured customer reviews (swipeable on phones) under the catalog-wide rating. */
export function ReviewsSection() {
  const section = home.reviews
  const { rating, count } = catalogRating()
  const featured = section.featured.flatMap((id) => {
    const found = getReview(id)
    return found ? [found] : []
  })

  return (
    <section aria-labelledby="reviews-home-title" className="section-pad">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-secondary">{section.eyebrow}</p>
          <h2 id="reviews-home-title" className="display-lg mt-4">
            <Accent text={section.heading} />
          </h2>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.95rem] text-muted">
            <Stars rating={rating} size={16} />
            {fill(section.summary, { rating: rating.toFixed(1), count: count.toLocaleString(site.locale) })}
          </p>
        </Reveal>

        <ul className="no-scrollbar mx-[calc(var(--gutter)*-1)] mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-2 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {featured.map(({ review, product }, i) => (
            <li key={review.id} className="w-[85%] shrink-0 snap-center sm:w-[60%] md:w-auto">
              <Reveal delay={i * 0.08} className="h-full">
                <figure className="flex h-full flex-col rounded-sm bg-card p-7 ring-1 ring-foreground/[0.06] md:p-9">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-6 flex-1">
                    <p className="font-display text-[1.25rem] font-light leading-[1.45] md:text-[1.4rem]">“{review.body}”</p>
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <img
                      src={review.avatar.src}
                      alt=""
                      width={review.avatar.width}
                      height={review.avatar.height}
                      loading="lazy"
                      decoding="async"
                      className="size-12 rounded-full object-cover"
                    />
                    <span>
                      <span className="block font-medium">{review.author}</span>
                      <span className="block text-sm text-muted">{review.skinType}</span>
                    </span>
                  </figcaption>
                  <Link to={`/products/${product.id}`} className="group mt-6 flex items-center gap-3 border-t border-foreground/10 pt-5 text-sm">
                    <Picture image={product.images[0]!} alt="" reveal={false} className="size-11 shrink-0 rounded-sm" />
                    <span className="min-w-0 flex-1 text-muted">
                      {section.on} <span className="text-foreground transition-colors duration-300 group-hover:text-accent-deep">{product.name}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

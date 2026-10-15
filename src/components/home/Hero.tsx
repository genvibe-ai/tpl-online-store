import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { home } from '../../content'
import { defaultSize, getProduct } from '../../lib/catalog'
import { formatPrice } from '../../lib/format'
import { Accent } from '../ui/Accent'
import { ButtonLink } from '../ui/Button'
import { Picture } from '../ui/Picture'
import { EASE } from '../ui/Reveal'

/**
 * Full-bleed photo hero. Signature moment: the photo settles from a slow zoom while the
 * headline lines rise out of their masks; on scroll the photo drifts down (parallax).
 */
export function Hero() {
  const { hero } = home
  const featured = getProduct(hero.featured.productId)
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex h-[calc(100svh-var(--header-h)-2.25rem)] max-h-[60rem] min-h-[36rem] flex-col overflow-hidden bg-foreground text-white"
    >
      <motion.div className="absolute inset-0 -z-20" style={reduce ? undefined : { y: imageY }}>
        <div className="hero-photo size-full">
        <motion.img
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover"
          style={{ objectPosition: hero.image.focus }}
          initial={{ scale: 1.16, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ scale: { duration: 2.8, ease: EASE }, opacity: { duration: 1.4, ease: 'easeOut' } }}
        />
        </div>
      </motion.div>
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      <motion.div className="container-page mt-auto pb-8 md:pb-16" style={reduce ? undefined : { opacity: contentOpacity }}>
        <div className="max-w-[46rem]">
          {/* Ink pill at 62%: keeps white text ≥ 4.5:1 even where the photo behind it is near-white. */}
          <motion.p
            className="eyebrow inline-flex items-center gap-2.5 rounded-full bg-[rgb(28_20_15/0.62)] px-4 py-2 text-[0.68rem] text-white backdrop-blur-md sm:text-[0.72rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          >
            <motion.span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[var(--accent-em)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
            />
            {hero.eyebrow}
          </motion.p>

          <h1 id="hero-title" className="display-hero mt-5 text-balance md:mt-7">
            {hero.headline.map((line, i) => (
              <span key={line} className="line-mask">
                <motion.span
                  className="block"
                  initial={{ y: '112%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.3, delay: 0.55 + i * 0.14, ease: EASE }}
                >
                  <Accent text={line} />
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.05, ease: EASE }}>
            <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-white md:mt-8 md:text-[1.08rem]">{hero.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
              <ButtonLink to={hero.primaryCta.href} size="lg" arrow className="max-sm:w-full">
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink to={hero.secondaryCta.href} variant="glass" size="lg" className="max-sm:hidden">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {featured && (
        <motion.div
          className="absolute bottom-16 right-[var(--gutter)] hidden xl:block"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 1.35, ease: EASE }}
        >
          <Link
            to={`/products/${featured.id}`}
            className="group flex w-[21rem] items-center gap-4 rounded-md bg-background/88 p-3 pr-5 text-foreground shadow-[0_24px_50px_-24px_rgb(0_0_0/0.5)] backdrop-blur-md transition-colors hover:bg-background"
          >
            <Picture image={featured.images[0]!} alt="" reveal={false} className="size-[4.5rem] shrink-0 rounded-sm" />
            <span className="min-w-0 flex-1">
              <span className="eyebrow block text-[0.65rem] text-muted">{hero.featured.label}</span>
              <span className="mt-1 block font-display text-[1.1rem] leading-snug">{featured.name}</span>
              <span className="mt-1 flex items-center gap-2 text-sm">
                {formatPrice(defaultSize(featured).price)}
                <span aria-hidden="true" className="text-muted">·</span>
                <span className="link-draw">{hero.featured.cta}</span>
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </section>
  )
}

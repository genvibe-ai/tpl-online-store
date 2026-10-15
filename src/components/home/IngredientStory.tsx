import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { home } from '../../content'
import { getProduct } from '../../lib/catalog'
import { cn } from '../../lib/format'
import { Accent } from '../ui/Accent'
import { ButtonLink } from '../ui/Button'
import { Picture } from '../ui/Picture'
import { EASE, Reveal } from '../ui/Reveal'

const number = (i: number) => String(i + 1).padStart(2, '0')

/** The botanicals flat lay with numbered markers; hovering a marker or a list row highlights the other. */
export function IngredientStory() {
  const section = home.ingredients
  const [active, setActive] = useState(0)
  const current = section.botanicals[active]!
  const product = getProduct(current.productId)

  return (
    <section id={section.id} aria-labelledby="ingredients-title" className="on-dark section-pad relative overflow-hidden bg-secondary text-secondary-foreground">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <div className="relative">
            <Picture image={section.image} className="aspect-[3/2] rounded-sm" />
            {section.botanicals.map((botanical, i) => (
              <button
                key={botanical.name}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={botanical.name}
                style={{ left: `${botanical.x}%`, top: `${botanical.y}%` }}
                className="absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
              >
                {i === active && <span aria-hidden="true" className="hotspot-ring absolute inset-0 rounded-full bg-background/70" />}
                <AnimatePresence>
                  {i === active && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, x: botanical.x > 60 ? 6 : -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={cn(
                        'pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-background px-3 py-1.5 font-display text-[0.95rem] leading-none text-foreground shadow-[0_8px_20px_-8px_rgb(0_0_0/0.45)]',
                        botanical.x > 60 ? 'right-full mr-1.5' : 'left-full ml-1.5',
                      )}
                    >
                      {botanical.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span
                  className={cn(
                    'relative grid size-8 place-items-center rounded-full text-[0.68rem] font-semibold tabular-nums shadow-[0_6px_16px_-6px_rgb(0_0_0/0.5)] transition-[background-color,color,transform] duration-300',
                    i === active ? 'scale-110 bg-accent text-accent-foreground' : 'bg-background text-foreground hover:scale-110',
                  )}
                >
                  {number(i)}
                </span>
              </button>
            ))}

          </div>
        </Reveal>

        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-secondary-foreground/80">{section.eyebrow}</p>
            <h2 id="ingredients-title" className="display-lg mt-4">
              <Accent text={section.heading} />
            </h2>
            <p className="mt-6 leading-relaxed text-secondary-foreground/85">{section.body}</p>
          </Reveal>

          <ol className="mt-10 border-t border-secondary-foreground/20">
            {section.botanicals.map((botanical, i) => {
              const isActive = i === active
              return (
                <li key={botanical.name} className="border-b border-secondary-foreground/20">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={isActive}
                    className="flex w-full items-baseline gap-5 py-4 text-left"
                  >
                    <span aria-hidden="true" className={cn('w-6 text-xs tabular-nums tracking-widest transition-opacity', isActive ? 'opacity-100' : 'opacity-60')}>
                      {number(i)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block font-display text-[1.35rem] leading-tight transition-transform duration-500 ease-silk', isActive && 'translate-x-1')}>
                        {botanical.name}
                      </span>
                      <motion.span
                        initial={false}
                        animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="block overflow-hidden"
                      >
                        <span className="block pt-2 text-[0.95rem] leading-relaxed text-secondary-foreground/85">{botanical.benefit}</span>
                      </motion.span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          {product && (
            <p className="mt-6 text-sm text-secondary-foreground/85">
              {section.usedIn}{' '}
              <Link to={`/products/${product.id}`} className="group inline-flex items-center gap-1.5 font-medium text-secondary-foreground underline decoration-secondary-foreground/40 underline-offset-4 transition-colors hover:decoration-secondary-foreground">
                {product.name}
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </p>
          )}

          <ButtonLink to={section.cta.href} variant="light" className="mt-9" arrow>
            {section.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { home, shop } from '../../content'
import { products } from '../../lib/catalog'
import { fill } from '../../lib/format'
import { Picture } from '../ui/Picture'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** Arch-shaped tiles, one per skin concern, each a close-up of the botanical that helps. */
export function Concerns() {
  const section = home.concerns
  return (
    <section id={section.id} aria-labelledby="concerns-title" className="section-pad bg-surface/70">
      <div className="container-page">
        <SectionHeading id="concerns-title" align="center" eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:mt-20 lg:grid-cols-4 lg:gap-x-8">
          {shop.concerns.map((concern, i) => {
            const count = products.filter((p) => p.concerns.includes(concern.id)).length
            return (
              <li key={concern.id}>
                <Reveal delay={i * 0.08}>
                  <Link to={`/shop?concern=${concern.id}`} className="group block text-center">
                    <div className="relative mx-auto max-w-[19rem]">
                      <Picture image={concern.image} hoverZoom className="aspect-[3/4] rounded-t-full" />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-t-full ring-1 ring-inset ring-foreground/10 transition-[box-shadow] duration-500 group-hover:ring-foreground/25"
                      />
                    </div>
                    <p className="eyebrow mt-6 text-secondary">{concern.botanical}</p>
                    <h3 className="mt-2 font-display text-[1.55rem] leading-tight md:text-[1.9rem]">{concern.label}</h3>
                    <p className="mx-auto mt-2 max-w-[16rem] text-[0.9rem] leading-relaxed text-muted lg:min-h-[3.1em]">{concern.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.16em]">
                      {fill(section.countLabel, { count })}
                      <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

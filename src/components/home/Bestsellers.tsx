import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { home, ui } from '../../content'
import { getProducts } from '../../lib/catalog'
import { ProductCard } from '../product/ProductCard'
import { IconButton } from '../ui/IconButton'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** Horizontal, swipeable carousel of bestsellers with arrow buttons and a progress line. */
export function Bestsellers() {
  const section = home.bestsellers
  const list = getProducts(section.productIds)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [view, setView] = useState({ start: true, end: false, progress: 0, visible: 1 })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setView({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft >= max - 4,
      progress: max > 0 ? el.scrollLeft / max : 0,
      visible: el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
    })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const scrollByCard = (direction: 1 | -1) => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>('[data-card]')
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section aria-labelledby="bestsellers-title" className="section-pad overflow-hidden">
      <div className="container-page flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <SectionHeading id="bestsellers-title" eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
        <div className="flex items-center gap-5">
          <Link to={section.cta.href} className="link-draw text-[0.75rem] font-medium uppercase tracking-[0.16em]">
            {section.cta.label}
          </Link>
          <div className="hidden gap-2 md:flex">
            <IconButton label={ui.previous} onClick={() => scrollByCard(-1)} disabled={view.start} className="size-11 border border-foreground/20 hover:border-foreground">
              <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </IconButton>
            <IconButton label={ui.next} onClick={() => scrollByCard(1)} disabled={view.end} className="size-11 border border-foreground/20 hover:border-foreground">
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </IconButton>
          </div>
        </div>
      </div>

      <div
        ref={track}
        onScroll={update}
        className="bleed-track no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:mt-14 md:gap-6"
      >
        {list.map((product, i) => (
          <Reveal key={product.id} data-card delay={Math.min(i, 4) * 0.08} className="carousel-card shrink-0 snap-start">
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <div className="container-page mt-8" aria-hidden="true">
        <div className="relative h-px bg-foreground/12">
          <div
            className="absolute inset-y-[-0.5px] rounded-full bg-foreground transition-[left] duration-200"
            style={{ width: `${view.visible * 100}%`, left: `${view.progress * (1 - view.visible) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}

import { useReducedMotion } from 'motion/react'
import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { productPage, type Img } from '../../content'
import { cn, fill } from '../../lib/format'
import { Picture } from '../ui/Picture'

/**
 * Swipeable image track (scroll-snap) with thumbnails. On mouse devices the
 * image magnifies where you point.
 */
export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const go = (index: number) => {
    const el = track.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
    setActive(index)
  }

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    if (index !== active) setActive(index)
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div className="relative min-w-0 flex-1">
        <div
          ref={track}
          onScroll={onScroll}
          role="region"
          aria-label={`${productPage.gallery}: ${name}`}
          tabIndex={0}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-sm bg-surface"
        >
          {images.map((image, i) => (
            <div key={`${image.src}-${i}`} className="aspect-square w-full shrink-0 snap-center" aria-hidden={i !== active}>
              <Magnifier>
                <Picture image={image} priority={i === 0} reveal={i !== 0} className="size-full" />
              </Magnifier>
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
            {images.map((image, i) => (
              <span key={`${image.src}-dot-${i}`} className={cn('h-1.5 rounded-full bg-foreground transition-all duration-500', i === active ? 'w-5 opacity-80' : 'w-1.5 opacity-30')} />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-2.5 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible">
          {images.map((image, i) => (
            <li key={`${image.src}-thumb-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={fill(productPage.showImage, { index: i + 1 })}
                aria-current={i === active}
                className={cn(
                  'block size-16 overflow-hidden rounded-sm ring-1 transition-[box-shadow,opacity] duration-300 lg:size-20',
                  i === active ? 'ring-foreground ring-offset-2 ring-offset-background' : 'opacity-70 ring-foreground/10 hover:opacity-100',
                )}
              >
                <Picture image={image} alt="" reveal={false} className="size-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Mouse devices: zooms the image 1.6× around the pointer while hovering. */
function Magnifier({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--zx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty('--zy', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }
  return (
    <div className="size-full overflow-hidden" onMouseMove={onMove}>
      <div
        ref={ref}
        className="size-full transition-transform duration-500 ease-silk [transform-origin:var(--zx,50%)_var(--zy,50%)] pointer-fine:hover:scale-[1.6] pointer-fine:hover:cursor-zoom-in"
      >
        {children}
      </div>
    </div>
  )
}

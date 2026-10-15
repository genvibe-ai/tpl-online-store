import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { ui } from '../../content'
import { defaultSize, type Product, type Size } from '../../lib/catalog'
import { cn, fill } from '../../lib/format'
import { useAddToBag } from '../../lib/useAddToBag'
import { Picture } from '../ui/Picture'
import { Price } from '../ui/Price'
import { Stars } from '../ui/Stars'
import { AddStateLabel, DrawCheck } from './AddStateLabel'

/** Product tile: image (with badge and quick add), name, tagline, price and rating. */
export function ProductCard({ product, className, priority = false }: { product: Product; className?: string; priority?: boolean }) {
  const size = defaultSize(product)
  const href = `/products/${product.id}`

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative">
        {/* Duplicate link for the image: hidden from screen readers and Tab (the name link below is the real one). */}
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
          <Picture image={product.images[0]!} alt="" hoverZoom priority={priority} className="aspect-[4/5] rounded-sm" />
        </Link>
        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.14em] text-foreground backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        <QuickAdd product={product} size={size} />
      </div>

      <div className="mt-4">
        <h3 className="font-display text-[1.06rem] leading-snug md:text-[1.18rem]">
          <Link to={href} className="transition-colors duration-300 hover:text-accent-deep">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.86rem] leading-snug text-muted md:text-[0.9rem]">{product.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <Price price={size.price} compareAt={size.compareAt} className="text-[0.98rem] font-medium" />
          <span className="flex items-center gap-1.5 text-[0.78rem] text-muted">
            <Stars rating={product.rating} size={11} />
            <span aria-hidden="true">{product.rating.toFixed(1)}</span>
            <span aria-hidden="true" className="hidden sm:inline">({product.reviewCount})</span>
            <span className="sr-only">{fill(ui.reviews, { count: product.reviewCount })}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

/** Mouse: a bar that rises over the image on hover. Touch: a round + button that is always visible. */
function QuickAdd({ product, size }: { product: Product; size: Size }) {
  const { state, addToBag } = useAddToBag()
  const label = `${ui.quickAdd}: ${product.name}, ${size.label}`

  return (
    <>
      <button
        type="button"
        onClick={() => addToBag(product, size)}
        aria-label={label}
        className={cn(
          'absolute inset-x-3 bottom-3 hidden h-11 items-center justify-center rounded-full px-5 text-[0.7rem] font-medium uppercase tracking-[0.16em] shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md transition-[opacity,transform,background-color,color] duration-500 ease-silk pointer-fine:flex',
          state === 'idle'
            ? 'translate-y-2 bg-background/92 text-foreground opacity-0 hover:bg-foreground hover:text-background focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100'
            : state === 'added'
              ? 'translate-y-0 bg-secondary text-secondary-foreground opacity-100'
              : 'translate-y-0 bg-foreground text-background opacity-100',
        )}
      >
        <AddStateLabel
          state={state}
          idle={
            <>
              <span>{ui.quickAdd}</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="normal-case tracking-normal">{size.label}</span>
            </>
          }
        />
      </button>
      <button
        type="button"
        onClick={() => addToBag(product, size)}
        aria-label={label}
        className={cn(
          'absolute bottom-2.5 right-2.5 hidden size-11 place-items-center rounded-full shadow-[0_8px_20px_-10px_rgb(0_0_0/0.4)] backdrop-blur-md transition-[background-color,transform] duration-300 active:scale-90 pointer-coarse:grid',
          state === 'added' ? 'bg-secondary text-secondary-foreground' : 'bg-background/92 text-foreground',
        )}
      >
        {state === 'added' ? <DrawCheck className="size-[1.1rem]" /> : state === 'adding' ? <span className="spinner text-[1rem]" aria-hidden="true" /> : <Plus aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.5} />}
      </button>
    </>
  )
}

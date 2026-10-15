import { ui } from '../../content'
import type { Product, Size } from '../../lib/catalog'
import { cn, formatPrice } from '../../lib/format'
import { useAddToBag } from '../../lib/useAddToBag'
import { buttonClasses } from '../ui/Button'
import { AddStateLabel } from './AddStateLabel'

/** The main "Add to bag · $68" button. Turns olive with a drawn check once added. */
export function AddToBagButton({
  product,
  size,
  qty = 1,
  compact = false,
  fullWidth = true,
  label = ui.addToBag,
  className,
}: {
  product: Product
  size: Size
  qty?: number
  compact?: boolean
  fullWidth?: boolean
  label?: string
  className?: string
}) {
  const { state, addToBag } = useAddToBag()
  return (
    <button
      type="button"
      onClick={() => addToBag(product, size, qty)}
      aria-label={state === 'idle' ? `${label}, ${product.name}, ${size.label}, ${formatPrice(size.price * qty)}` : undefined}
      className={buttonClasses(state === 'added' ? 'success' : 'primary', compact ? 'md' : 'lg', cn('overflow-hidden', fullWidth && 'w-full', className))}
    >
      <span aria-live="polite" className="contents">
        <AddStateLabel
          state={state}
          idle={
            <>
              <span>{label}</span>
              {!compact && (
                <span className="hidden items-center gap-2.5 min-[26rem]:inline-flex">
                  <span aria-hidden="true" className="opacity-60">·</span>
                  <span className="tabular-nums">{formatPrice(size.price * qty)}</span>
                </span>
              )}
            </>
          }
        />
      </span>
    </button>
  )
}

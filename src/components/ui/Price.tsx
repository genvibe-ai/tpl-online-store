import { ui } from '../../content'
import { cn, formatPrice } from '../../lib/format'

/** A price, with an optional struck-through original price. */
export function Price({ price, compareAt, className }: { price: number; compareAt?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-baseline gap-2 tabular-nums', className)}>
      <span>{formatPrice(price)}</span>
      {compareAt && compareAt > price && (
        <s className="text-[0.85em] text-muted decoration-1">
          <span className="sr-only">{ui.was} </span>
          {formatPrice(compareAt)}
        </s>
      )}
    </span>
  )
}

import { Star } from 'lucide-react'
import { ui } from '../../content'
import { cn, fill } from '../../lib/format'

function Row({ size }: { size: number }) {
  return (
    <span className="flex w-max gap-[0.15em]">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden="true" fill="currentColor" strokeWidth={0} style={{ width: size, height: size }} />
      ))}
    </span>
  )
}

/** Five stars filled to the rating (4.8 fills 96%). Announced as "Rated 4.8 out of 5". */
export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100))
  return (
    <span role="img" aria-label={fill(ui.ratedOutOf, { rating: rating.toFixed(1) })} className={cn('relative inline-flex shrink-0', className)}>
      <span className="text-foreground/15">
        <Row size={size} />
      </span>
      <span className="absolute inset-y-0 left-0 overflow-hidden text-accent" style={{ width: `${percent}%` }}>
        <Row size={size} />
      </span>
    </span>
  )
}

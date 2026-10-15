import { site } from '../../content'
import { cn } from '../../lib/format'

/** The brand name set in the display serif with wide tracking (the negative margin re-centers it). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-display font-normal uppercase leading-none tracking-[0.34em] mr-[-0.34em]', className)}>{site.name}</span>
  )
}

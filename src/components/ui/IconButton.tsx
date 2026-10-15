import type { ComponentProps } from 'react'
import { cn } from '../../lib/format'

/** A round, icon-only button. Always pass `label` (it becomes the accessible name). */
export function IconButton({ label, className, children, type = 'button', ...props }: ComponentProps<'button'> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'relative grid size-10 shrink-0 place-items-center rounded-full text-current transition-[background-color,transform] duration-300 hover:bg-foreground/[0.06] active:scale-95 disabled:opacity-35',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

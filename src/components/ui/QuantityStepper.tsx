import { Minus, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { store, ui } from '../../content'
import { cn } from '../../lib/format'
import { EASE } from './Reveal'

type Props = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  /** Accessible name for the group, e.g. "Quantity, Fig Leaf Renewal Serum". */
  label?: string
  className?: string
}

const roll = {
  enter: (dir: number) => ({ y: dir * 12, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir * -12, opacity: 0 }),
}

/** − 2 + stepper; the number rolls up or down as it changes. */
export function QuantityStepper({ value, onChange, min = 1, max = store.maxQuantity, size = 'md', label, className }: Props) {
  const [direction, setDirection] = useState(1)
  const step = (delta: number) => {
    setDirection(delta)
    onChange(Math.max(min, Math.min(max, value + delta)))
  }
  const button = cn(
    'grid place-items-center rounded-full text-foreground transition-colors duration-300 hover:bg-foreground/[0.07] disabled:cursor-not-allowed disabled:opacity-30',
    size === 'sm' ? 'size-8' : 'size-11',
  )

  return (
    <div
      role="group"
      aria-label={label ?? ui.quantity}
      className={cn('inline-flex items-center rounded-full border border-foreground/20 bg-card/60', size === 'sm' ? 'p-0.5' : 'p-0.5', className)}
    >
      <button type="button" className={button} onClick={() => step(-1)} disabled={value <= min} aria-label={ui.decrease}>
        <Minus aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
      </button>
      <span className={cn('relative grid overflow-hidden text-center tabular-nums', size === 'sm' ? 'h-8 w-7 text-sm' : 'h-11 w-9')} aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.span
            key={value}
            custom={direction}
            variants={roll}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: EASE }}
            className="col-start-1 row-start-1 self-center"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button type="button" className={button} onClick={() => step(1)} disabled={value >= max} aria-label={ui.increase}>
        <Plus aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  )
}

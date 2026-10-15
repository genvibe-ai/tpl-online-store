import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../lib/format'
import { EASE } from './Reveal'

/** One expandable row. The panel stays in the DOM (inert while closed) so links inside stay valid. */
export function AccordionItem({ title, children, defaultOpen = false, className }: { title: string; children: ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className={cn('border-b border-foreground/12', className)}>
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.15rem] leading-snug transition-colors duration-300 hover:text-accent-deep"
        >
          {title}
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-foreground/15 transition-colors duration-300 group-hover:border-foreground/40">
            <Plus aria-hidden="true" className={cn('size-3.5 transition-transform duration-500 ease-silk', open && 'rotate-[135deg]')} strokeWidth={1.75} />
          </span>
        </button>
      </h3>
      <motion.div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        inert={!open}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ height: { duration: 0.5, ease: EASE }, opacity: { duration: 0.35 } }}
        className="overflow-hidden"
      >
        <div className="pb-6 text-[0.98rem] leading-relaxed text-muted">{children}</div>
      </motion.div>
    </div>
  )
}

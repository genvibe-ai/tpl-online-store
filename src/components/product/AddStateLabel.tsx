import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { ui } from '../../content'
import type { AddState } from '../../lib/useAddToBag'
import { EASE } from '../ui/Reveal'

/** A check mark that draws itself. */
export function DrawCheck({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <motion.path
        d="M4.5 12.5l4.75 4.75L19.5 7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
      />
    </svg>
  )
}

/** Swaps the button text idle → "Adding" → "Added ✓" with a vertical slide. */
export function AddStateLabel({ state, idle }: { state: AddState; idle: ReactNode }) {
  return (
    <span className="relative grid overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.38, ease: EASE }}
          className="col-start-1 row-start-1 flex items-center justify-center gap-2.5"
        >
          {state === 'idle' && idle}
          {state === 'adding' && (
            <>
              <span className="spinner" aria-hidden="true" />
              {ui.adding}
            </>
          )}
          {state === 'added' && (
            <>
              <DrawCheck />
              {ui.added}
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

import { ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ui } from '../../content'
import { fill } from '../../lib/format'
import { useCart, useCartCount } from '../../store/cart'

/** Header bag icon with a count badge. It does a little hop each time something is added. */
export function BagButton() {
  const count = useCartCount()
  const tick = useCart((state) => state.addedTick)
  const openBag = useCart((state) => state.openBag)
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate()
  const lastTick = useRef(tick)

  useEffect(() => {
    if (tick === lastTick.current) return
    lastTick.current = tick
    if (reduce || !scope.current) return
    animate(scope.current, { scale: [1, 1.22, 0.94, 1], rotate: [0, -9, 5, 0] }, { duration: 0.65, ease: 'easeOut' })
  }, [tick, reduce, animate, scope])

  return (
    <button
      type="button"
      onClick={openBag}
      aria-label={fill(ui.openBag, { count })}
      className="relative flex h-10 items-center gap-2.5 rounded-full px-2.5 transition-colors duration-300 hover:bg-foreground/[0.06]"
    >
      <span ref={scope} className="relative grid place-items-center">
        <ShoppingBag aria-hidden="true" className="size-[1.3rem]" strokeWidth={1.5} />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
              className="absolute -right-2.5 -top-2 grid h-[1.2rem] min-w-[1.2rem] place-items-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold leading-none text-accent-foreground tabular-nums"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="ml-1.5 hidden text-[0.75rem] font-medium uppercase tracking-[0.16em] lg:inline">{ui.bag}</span>
    </button>
  )
}

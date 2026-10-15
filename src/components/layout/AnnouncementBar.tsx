import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { announcement } from '../../content'
import { fill } from '../../lib/format'
import { EASE } from '../ui/Reveal'

/** The olive strip above the header. Messages rotate every few seconds (paused on hover/focus and for reduced motion). */
export function AnnouncementBar() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const messages = announcement.messages.map((message) => fill(message))

  useEffect(() => {
    if (reduce || paused || messages.length < 2) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 4800)
    return () => window.clearInterval(timer)
  }, [reduce, paused, messages.length])

  return (
    <div
      className="relative bg-secondary text-secondary-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page grid h-9 place-items-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="truncate text-[0.68rem] font-medium uppercase tracking-[0.14em] sm:text-[0.72rem] sm:tracking-[0.2em]"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

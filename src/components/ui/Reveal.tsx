import { motion, type HTMLMotionProps } from 'motion/react'

/** The house easing: a long, silky settle. */
export const EASE = [0.22, 1, 0.36, 1] as const

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number }

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ delay = 0, y = 24, transition, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay, ...transition }}
      {...props}
    />
  )
}

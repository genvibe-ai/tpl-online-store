import type { ReactNode } from 'react'
import { cn } from '../../lib/format'
import { Accent } from './Accent'
import { Reveal } from './Reveal'

type Props = {
  eyebrow?: string
  heading: string
  intro?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  size?: 'lg' | 'md'
  /** id for the heading, so the section can point aria-labelledby at it. */
  id?: string
  className?: string
  children?: ReactNode
}

/** Eyebrow label, serif heading (supports *accent*) and an optional intro, revealed on scroll. */
export function SectionHeading({ eyebrow, heading, intro, align = 'left', as: Tag = 'h2', size = 'lg', id, className, children }: Props) {
  return (
    <Reveal className={cn(align === 'center' && 'mx-auto text-center', 'max-w-2xl', className)}>
      {eyebrow && <p className="eyebrow text-secondary">{eyebrow}</p>}
      <Tag id={id} className={cn(size === 'lg' ? 'display-lg' : 'display-md', eyebrow && 'mt-4')}>
        <Accent text={heading} />
      </Tag>
      {intro && <p className={cn('mt-5 text-[1.0625rem] leading-relaxed text-muted', align === 'center' && 'mx-auto max-w-xl')}>{intro}</p>}
      {children}
    </Reveal>
  )
}

import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '../../lib/format'

type Variant = 'primary' | 'outline' | 'dark' | 'light' | 'glass' | 'success'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-sans font-medium uppercase tracking-[0.16em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-silk active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[0.7rem]',
  md: 'h-12 px-7 text-[0.75rem]',
  lg: 'h-14 px-8 text-[0.78rem]',
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-accent-deep',
  outline: 'border border-foreground/25 text-foreground hover:border-foreground hover:bg-foreground hover:text-background',
  dark: 'bg-foreground text-background hover:bg-foreground/85',
  light: 'bg-background text-foreground hover:bg-card hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)]',
  glass: 'border border-white/60 bg-white/10 text-white backdrop-blur-md hover:border-white hover:bg-white hover:text-foreground',
  success: 'bg-secondary text-secondary-foreground',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, sizes[size], variants[variant], className)
}

/** The arrow that slides right on hover. */
export function ButtonArrow() {
  return <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 ease-silk group-hover/btn:translate-x-1" />
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode }

export function ButtonLink({ variant, size, arrow, className, children, ...props }: Common & LinkProps) {
  return (
    <Link className={buttonClasses(variant, size, typeof className === 'string' ? className : undefined)} {...props}>
      {children}
      {arrow && <ButtonArrow />}
    </Link>
  )
}

export function Button({ variant, size, arrow, className, children, type = 'button', ...props }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {arrow && <ButtonArrow />}
    </button>
  )
}

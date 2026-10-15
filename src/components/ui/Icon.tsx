import { Droplet, FlaskConical, Gift, Leaf, Lock, Recycle, RotateCcw, ShieldCheck, Sparkles, Truck, type LucideProps } from 'lucide-react'
import type { IconName } from '../../content'

const icons = {
  leaf: Leaf,
  flask: FlaskConical,
  recycle: Recycle,
  shield: ShieldCheck,
  truck: Truck,
  gift: Gift,
  returns: RotateCcw,
  sparkles: Sparkles,
  droplet: Droplet,
  lock: Lock,
} satisfies Record<IconName, unknown>

/** Icons referenced by name from content.ts (e.g. icon: 'leaf'). */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name]
  return <Component aria-hidden="true" strokeWidth={1.5} {...props} />
}

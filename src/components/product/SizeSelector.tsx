import { productPage } from '../../content'
import type { Size } from '../../lib/catalog'
import { cn, formatPrice } from '../../lib/format'

/** Size pills (native radio buttons, so arrow keys work). */
export function SizeSelector({ sizes, value, onChange, name }: { sizes: Size[]; value: string; onChange: (id: string) => void; name: string }) {
  if (sizes.length < 2) return null
  return (
    <fieldset>
      <legend className="eyebrow text-muted">{productPage.size}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => {
          const checked = size.id === value
          return (
            <label
              key={size.id}
              className={cn(
                'relative inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-full border px-5 text-[0.95rem] transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                checked ? 'border-foreground bg-foreground text-background' : 'border-foreground/20 hover:border-foreground/60',
              )}
            >
              <input type="radio" name={name} value={size.id} checked={checked} onChange={() => onChange(size.id)} className="sr-only" />
              <span>{size.label}</span>
              <span className={cn('tabular-nums', checked ? 'text-background/75' : 'text-muted')}>{formatPrice(size.price)}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

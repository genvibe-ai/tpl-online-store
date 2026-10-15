import { Plus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { store, ui } from '../../content'
import { defaultSize, getProduct, type Product } from '../../lib/catalog'
import { fill, formatMoney, formatPrice } from '../../lib/format'
import { useDialog } from '../../lib/hooks'
import { useAddToBag } from '../../lib/useAddToBag'
import { useCart, useCartLines, type ResolvedLine } from '../../store/cart'
import { useToasts } from '../../store/toast'
import { AddStateLabel } from '../product/AddStateLabel'
import { ButtonLink } from '../ui/Button'
import { IconButton } from '../ui/IconButton'
import { Picture } from '../ui/Picture'
import { QuantityStepper } from '../ui/QuantityStepper'
import { EASE } from '../ui/Reveal'

/** The bag: slides in from the right with quantities, free-shipping progress and checkout. */
export function CartDrawer() {
  const isOpen = useCart((state) => state.isOpen)
  const closeBag = useCart((state) => state.closeBag)
  const { lines, subtotal } = useCartLines()
  const count = lines.reduce((sum, line) => sum + line.qty, 0)
  const panel = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useDialog(panel, isOpen, closeBag)

  // Navigating anywhere closes the bag.
  useEffect(() => {
    closeBag()
  }, [location.pathname, location.search, closeBag])

  // The open bag is its own feedback: clear "Added" toasts so they don't sit on top of it.
  useEffect(() => {
    if (isOpen) useToasts.setState({ toasts: [] })
  }, [isOpen])

  const remaining = Math.max(0, store.freeShippingThreshold - subtotal)
  const progress = Math.min(1, subtotal / store.freeShippingThreshold)

  // One "pairs well with" suggestion that is not in the bag yet.
  const suggestion = useMemo(() => {
    const inBag = new Set(lines.map((line) => line.productId))
    for (const line of lines) {
      for (const id of line.product.pairsWith) {
        const product = getProduct(id)
        if (product && !inBag.has(id)) return product
      }
    }
    return undefined
  }, [lines])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeBag}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-card shadow-[-30px_0_60px_-30px_rgb(0_0_0/0.35)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <header className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-foreground/10 px-5 sm:px-7">
              <h2 id="bag-title" className="font-display text-[1.6rem] leading-none">
                {ui.yourBag}
                <span className="ml-2 align-middle font-sans text-sm text-muted tabular-nums">({count})</span>
              </h2>
              <IconButton label={ui.closeBag} onClick={closeBag} className="-mr-2" data-autofocus>
                <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </IconButton>
            </header>

            {lines.length > 0 && (
              <div className="shrink-0 border-b border-foreground/10 px-5 py-4 sm:px-7">
                <p className="text-sm" aria-live="polite">
                  {remaining > 0 ? fill(ui.freeShippingProgress, { amount: formatMoney(remaining) }) : ui.freeShippingUnlocked}
                </p>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    className="h-full rounded-full bg-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7">
              {lines.length === 0 ? (
                <EmptyBag onClose={closeBag} />
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((line, i) => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.15 + i * 0.05 } }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.35, ease: EASE } }}
                        className="overflow-hidden border-b border-foreground/10 last:border-b-0"
                      >
                        <LineItem line={line} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
              {suggestion && <Suggestion product={suggestion} />}
            </div>

            {lines.length > 0 && (
              <footer className="shrink-0 border-t border-foreground/10 px-5 pb-6 pt-5 sm:px-7">
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.95rem]">{ui.subtotal}</span>
                  <span className="font-display text-2xl tabular-nums">{formatMoney(subtotal)}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{ui.shippingNote}</p>
                <ButtonLink to="/checkout" onClick={closeBag} size="lg" arrow className="mt-5 w-full">
                  {ui.checkout}
                </ButtonLink>
                <button type="button" onClick={closeBag} className="link-draw mx-auto mt-4 block text-sm text-muted transition-colors hover:text-foreground">
                  {ui.continueShopping}
                </button>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function LineItem({ line }: { line: ResolvedLine }) {
  const setQty = useCart((state) => state.setQty)
  const remove = useCart((state) => state.remove)
  const { product, size } = line

  return (
    <div className="flex gap-4 py-5">
      <Link to={`/products/${product.id}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
        <Picture image={product.images[0]!} alt="" reveal={false} className="size-24 rounded-sm" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/products/${product.id}`} className="font-display text-[1.08rem] leading-snug transition-colors hover:text-accent-deep">
              {product.name}
            </Link>
            <p className="mt-0.5 text-sm text-muted">
              {size.label} · {formatPrice(size.price)}
            </p>
          </div>
          <p className="shrink-0 text-[0.95rem] tabular-nums">{formatMoney(line.lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper size="sm" value={line.qty} onChange={(qty) => setQty(product.id, size.id, qty)} label={`${ui.quantity}, ${product.name}`} />
          <button
            type="button"
            onClick={() => remove(product.id, size.id)}
            className="link-draw text-[0.8rem] text-muted transition-colors hover:text-foreground"
            aria-label={`${ui.remove} ${product.name}, ${size.label}`}
          >
            {ui.remove}
          </button>
        </div>
      </div>
    </div>
  )
}

function Suggestion({ product }: { product: Product }) {
  const size = defaultSize(product)
  const { state, addToBag } = useAddToBag({ silent: true })
  return (
    <div className="my-5 rounded-sm bg-surface p-4">
      <p className="eyebrow text-secondary">{ui.pairsWellWith}</p>
      <div className="mt-3 flex items-center gap-3">
        <Picture image={product.images[0]!} alt="" reveal={false} className="size-14 shrink-0 rounded-sm" />
        <div className="min-w-0 flex-1">
          <Link to={`/products/${product.id}`} className="line-clamp-2 font-display text-[1rem] leading-snug transition-colors hover:text-accent-deep">
            {product.name}
          </Link>
          <p className="text-sm text-muted">
            {size.label} · {formatPrice(size.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => addToBag(product, size)}
          aria-label={`${ui.addToBag}: ${product.name}, ${size.label}`}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-foreground/20 px-3.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          <AddStateLabel
            state={state}
            idle={
              <>
                <Plus aria-hidden="true" className="size-3.5" />
                {ui.add}
              </>
            }
          />
        </button>
      </div>
    </div>
  )
}

function EmptyBag({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-[1.9rem] leading-tight">{ui.emptyBag}</p>
      <p className="mt-3 max-w-xs text-muted">{ui.emptyBagText}</p>
      <ButtonLink to="/shop?sort=bestselling" onClick={onClose} className="mt-8" arrow>
        {ui.emptyBagCta}
      </ButtonLink>
    </div>
  )
}

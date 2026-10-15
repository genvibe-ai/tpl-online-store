import { useCallback, useEffect, useRef, useState } from 'react'
import { ui } from '../content'
import { useCart } from '../store/cart'
import { toast } from '../store/toast'
import type { Product, Size } from './catalog'

export type AddState = 'idle' | 'adding' | 'added'

/**
 * Adds a product to the bag with a short "adding → added" moment and a toast
 * ("Added to your bag" + View bag). Returns the state for the button animation.
 * `silent` skips the toast (used inside the bag itself, where the new row is the feedback).
 */
export function useAddToBag({ silent = false }: { silent?: boolean } = {}) {
  const add = useCart((state) => state.add)
  const [state, setState] = useState<AddState>('idle')
  const busy = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const addToBag = useCallback(
    (product: Product, size: Size, qty = 1) => {
      if (busy.current) return
      busy.current = true
      setState('adding')
      timers.current.push(
        window.setTimeout(() => {
          add(product.id, size.id, qty)
          setState('added')
          if (!silent) {
            toast({
              title: ui.addedToast,
              description: `${product.name} · ${size.label}${qty > 1 ? ` × ${qty}` : ''}`,
              image: product.images[0],
              action: { label: ui.viewBag, onClick: () => useCart.getState().openBag() },
            })
          }
          timers.current.push(
            window.setTimeout(() => {
              setState('idle')
              busy.current = false
            }, 1500),
          )
        }, 420),
      )
    },
    [add, silent],
  )

  return { state, addToBag }
}

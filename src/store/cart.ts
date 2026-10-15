import { useMemo } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { site, store as settings, type Img } from '../content'
import { getProduct, getSize, type Product, type Size } from '../lib/catalog'

/** One row in the bag: a product in one size. Saved to localStorage. */
export type CartLine = { productId: string; sizeId: string; qty: number }

/** A bag row joined with its product and size (computed, never saved). */
export type ResolvedLine = CartLine & { key: string; product: Product; size: Size; lineTotal: number }

/** A placed (demo) order. Saved to localStorage so the confirmation page survives a reload. */
export type Order = {
  id: string
  createdAt: string
  email: string
  phone?: string
  shipTo: { firstName: string; lastName: string; address: string; apartment?: string; city: string; state: string; zip: string; country: string }
  delivery: { id: string; label: string; detail: string; price: number; window: string }
  cardLast4: string
  lines: Array<{ productId: string; name: string; sizeLabel: string; price: number; qty: number; image: Img }>
  subtotal: number
  discount: number
  discountCode?: string
  shipping: number
  tax: number
  total: number
}

type CartState = {
  lines: CartLine[]
  orders: Order[]
  /** Whether the bag drawer is open. */
  isOpen: boolean
  /** Goes up by one on every add; the bag icon animates when it changes. */
  addedTick: number
  add: (productId: string, sizeId: string, qty?: number) => void
  setQty: (productId: string, sizeId: string, qty: number) => void
  remove: (productId: string, sizeId: string) => void
  clear: () => void
  openBag: () => void
  closeBag: () => void
  saveOrder: (order: Order) => void
}

const clampQty = (qty: number) => Math.max(1, Math.min(settings.maxQuantity, Math.round(qty) || 1))
const same = (line: CartLine, productId: string, sizeId: string) => line.productId === productId && line.sizeId === sizeId

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      orders: [],
      isOpen: false,
      addedTick: 0,
      add: (productId, sizeId, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((line) => same(line, productId, sizeId))
          const lines = existing
            ? state.lines.map((line) => (line === existing ? { ...line, qty: clampQty(line.qty + qty) } : line))
            : [...state.lines, { productId, sizeId, qty: clampQty(qty) }]
          return { lines, addedTick: state.addedTick + 1 }
        }),
      setQty: (productId, sizeId, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((line) => !same(line, productId, sizeId))
              : state.lines.map((line) => (same(line, productId, sizeId) ? { ...line, qty: clampQty(qty) } : line)),
        })),
      remove: (productId, sizeId) => set((state) => ({ lines: state.lines.filter((line) => !same(line, productId, sizeId)) })),
      clear: () => set({ lines: [] }),
      openBag: () => set({ isOpen: true }),
      closeBag: () => set({ isOpen: false }),
      saveOrder: (order) => set((state) => ({ orders: [order, ...state.orders].slice(0, 10) })),
    }),
    {
      name: site.storageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines, orders: state.orders }),
      // Drop saved lines whose product or size no longer exists in the catalog.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<Pick<CartState, 'lines' | 'orders'>>
        const lines = (Array.isArray(saved.lines) ? saved.lines : [])
          .filter((line) => {
            const product = getProduct(line?.productId)
            return Boolean(product && getSize(product, line.sizeId))
          })
          .map((line) => ({ ...line, qty: clampQty(line.qty) }))
        return { ...current, lines, orders: Array.isArray(saved.orders) ? saved.orders : [] }
      },
    },
  ),
)

/** Total number of items in the bag. */
export const useCartCount = () => useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0))

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.productId)
    const size = product && getSize(product, line.sizeId)
    if (!product || !size) return []
    return [{ ...line, key: `${line.productId}:${line.sizeId}`, product, size, lineTotal: size.price * line.qty }]
  })
}

/** The bag's rows with products and sizes attached, plus the subtotal. */
export function useCartLines() {
  const lines = useCart((state) => state.lines)
  return useMemo(() => {
    const resolved = resolveLines(lines)
    return { lines: resolved, subtotal: resolved.reduce((sum, line) => sum + line.lineTotal, 0) }
  }, [lines])
}

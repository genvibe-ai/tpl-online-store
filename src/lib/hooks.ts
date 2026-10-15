import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'

/** Live result of a CSS media query, e.g. useMediaQuery('(min-width: 64rem)'). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolledPast(offset = 8) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return past
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal behavior for drawers and overlays while `open`: locks page scroll, moves focus inside
 * (to the element marked data-autofocus, else the first focusable), keeps Tab inside,
 * closes on Escape and returns focus to where it was.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const scrollbar = window.innerWidth - root.clientWidth
    const saved = { overflow: root.style.overflow, paddingRight: root.style.paddingRight }
    root.style.overflow = 'hidden'
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`

    const frame = requestAnimationFrame(() => {
      const panel = ref.current
      const target = panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel?.querySelector<HTMLElement>(FOCUSABLE)
      target?.focus({ preventScroll: true })
    })

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close.current()
        return
      }
      const panel = ref.current
      if (event.key !== 'Tab' || !panel) return
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (items.length === 0) return
      const first = items[0]!
      const last = items[items.length - 1]!
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      root.style.overflow = saved.overflow
      root.style.paddingRight = saved.paddingRight
      previous?.focus?.({ preventScroll: true })
    }
  }, [open, ref])
}

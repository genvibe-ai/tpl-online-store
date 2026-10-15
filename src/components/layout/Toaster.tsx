import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { ui } from '../../content'
import { useToasts, type Toast } from '../../store/toast'
import { EASE } from '../ui/Reveal'

/** Toast stack, top right under the header (top center on phones). */
export function Toaster() {
  const toasts = useToasts((state) => state.toasts)
  const { pathname } = useLocation()

  // Toasts belong to the page they were raised on.
  useEffect(() => {
    useToasts.setState({ toasts: [] })
  }, [pathname])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[4.75rem] z-[80] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end sm:px-0 lg:top-[5.75rem]"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ toast }: { toast: Toast }) {
  const dismiss = useToasts((state) => state.dismiss)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => dismiss(toast.id), 5000)
    return () => window.clearTimeout(timer)
  }, [paused, dismiss, toast.id])

  return (
    <motion.div
      layout
      role="status"
      initial={{ opacity: 0, y: -14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: EASE }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-[25rem] items-center gap-3 rounded-md bg-foreground p-2 pr-2.5 text-background shadow-[0_22px_44px_-18px_rgb(0_0_0/0.55)] sm:gap-3.5 sm:p-2.5 sm:pr-3"
    >
      {toast.image && (
        <img src={toast.image.src} alt="" width={toast.image.width} height={toast.image.height} className="size-12 shrink-0 rounded-sm object-cover sm:size-14" style={{ objectPosition: toast.image.focus }} />
      )}
      <div className={toast.image ? 'min-w-0 flex-1' : 'min-w-0 flex-1 py-1.5 pl-2'}>
        <p className="text-[0.9rem] font-medium leading-snug sm:text-[0.92rem]">{toast.title}</p>
        {toast.description && <p className="truncate text-[0.85rem] text-background/70">{toast.description}</p>}
      </div>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick()
            dismiss(toast.id)
          }}
          className="shrink-0 rounded-full border border-background/30 px-2.5 py-1.5 text-[0.66rem] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-background hover:text-foreground sm:px-3 sm:tracking-[0.14em]"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label={ui.dismiss}
        className="grid size-8 shrink-0 place-items-center rounded-full text-background/70 transition-colors hover:bg-background/10 hover:text-background"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </motion.div>
  )
}

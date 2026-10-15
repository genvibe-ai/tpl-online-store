import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { contact, nav, shop, ui } from '../../content'
import { useDialog } from '../../lib/hooks'
import { IconButton } from '../ui/IconButton'
import { Picture } from '../ui/Picture'
import { EASE } from '../ui/Reveal'
import { Wordmark } from '../ui/Wordmark'

/** Slide-in menu for phones and tablets. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useDialog(panel, open, onClose)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={ui.mainNav}
            className="absolute inset-y-0 left-0 flex w-[min(88vw,24rem)] flex-col overflow-y-auto bg-background shadow-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-foreground/10 px-5">
              <Wordmark className="text-[1.1rem]" />
              <IconButton label={ui.closeMenu} onClick={onClose} className="-mr-2">
                <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </IconButton>
            </div>

            <nav aria-label={ui.mainNav} className="px-5 pt-6">
              <ul>
                {nav.links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: EASE }}
                  >
                    <Link to={link.href} className="flex items-baseline justify-between border-b border-foreground/10 py-3.5 font-display text-[1.85rem] leading-tight transition-colors hover:text-accent-deep">
                      {link.label}
                      <span className="font-sans text-xs tracking-widest text-muted">{String(i + 1).padStart(2, '0')}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="px-5 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="eyebrow text-secondary">{nav.menu.categoriesTitle}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {shop.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/shop?category=${category.id}`}
                      className="inline-flex h-10 items-center rounded-full border border-foreground/15 px-4 text-sm transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="eyebrow mt-8 text-secondary">{nav.menu.concernsTitle}</p>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {shop.concerns.map((concern) => (
                  <li key={concern.id}>
                    <Link to={`/shop?concern=${concern.id}`} className="group flex items-center gap-3 rounded-sm py-1">
                      <Picture image={concern.image} alt="" reveal={false} className="size-10 shrink-0 rounded-full" />
                      <span className="text-[0.95rem] transition-colors group-hover:text-accent-deep">{concern.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="mt-auto space-y-1 border-t border-foreground/10 px-5 py-6 text-sm text-muted">
              <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-foreground">
                {contact.email}
              </a>
              <p>{contact.hours}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

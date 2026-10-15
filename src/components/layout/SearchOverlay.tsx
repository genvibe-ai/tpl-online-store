import { ArrowRight, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { search, ui } from '../../content'
import { defaultSize, searchProducts } from '../../lib/catalog'
import { fill, formatPrice } from '../../lib/format'
import { useDialog } from '../../lib/hooks'
import { IconButton } from '../ui/IconButton'
import { Picture } from '../ui/Picture'
import { EASE } from '../ui/Reveal'

/** Search panel that drops from the top, with live product results. Enter opens the shop filtered by the query. */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useDialog(panel, open, onClose)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => searchProducts(query).slice(0, 5), [query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={search.label}
            className="absolute inset-x-0 top-0 max-h-[90svh] overflow-y-auto bg-background shadow-[0_30px_60px_-30px_rgb(0_0_0/0.4)]"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="container-page py-5 md:py-9">
              <form role="search" onSubmit={submit} className="flex items-center gap-3 border-b border-foreground/20 pb-3 transition-colors focus-within:border-foreground md:gap-5 md:pb-5">
                <Search aria-hidden="true" className="size-5 shrink-0 text-muted md:size-6" strokeWidth={1.5} />
                <input
                  data-autofocus
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={search.placeholder}
                  aria-label={search.label}
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent font-display text-[1.4rem] font-light placeholder:text-foreground/40 focus:outline-none md:text-[2.4rem] [&::-webkit-search-cancel-button]:hidden"
                />
                <IconButton label={ui.closeSearch} onClick={onClose} className="-mr-2">
                  <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
                </IconButton>
              </form>

              <div className="pt-6 md:pt-8">
                {query.trim() === '' ? (
                  <div>
                    <p className="eyebrow text-secondary">{search.popularTitle}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {search.popular.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => setQuery(term)}
                            className="inline-flex h-10 items-center rounded-full border border-foreground/15 px-4 text-sm transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <p className="eyebrow text-secondary">{search.resultsTitle}</p>
                    <ul className="mt-4 grid gap-1 md:grid-cols-2 md:gap-x-8">
                      {results.map((product) => (
                        <li key={product.id}>
                          <Link to={`/products/${product.id}`} className="group flex items-center gap-4 rounded-sm py-2.5">
                            <Picture image={product.images[0]!} alt="" reveal={false} className="size-16 shrink-0 rounded-sm" />
                            <span className="min-w-0 flex-1">
                              <span className="block font-display text-lg leading-snug transition-colors group-hover:text-accent-deep">{product.name}</span>
                              <span className="block truncate text-sm text-muted">{product.tagline}</span>
                            </span>
                            <span className="text-sm tabular-nums">{formatPrice(defaultSize(product).price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={submit} className="link-draw mt-6 inline-flex items-center gap-2 text-sm font-medium">
                      {search.viewAll}
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-muted">{fill(search.noResults, { query: query.trim() })}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

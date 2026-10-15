import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { ProductCard } from '../components/product/ProductCard'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { IconButton } from '../components/ui/IconButton'
import { EASE, Reveal } from '../components/ui/Reveal'
import { shop, type CategoryId, type ConcernId, type SortId } from '../content'
import { categoryLabel, concernLabel, filterProducts, isCategory, isConcern, isSort, products, sortProducts } from '../lib/catalog'
import { cn, fill } from '../lib/format'
import { useDialog } from '../lib/hooks'
import { usePageMeta } from '../lib/site'

const labels = shop.labels
const countIn = (category: CategoryId) => products.filter((p) => p.category === category).length
const countWith = (concern: ConcernId) => products.filter((p) => p.concerns.includes(concern)).length

/** Shop: category and concern filters, search, sort and the product grid. Filters live in the URL (?category=&concern=&sort=&q=). */
export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const categoryParam = params.get('category')
  const category = isCategory(categoryParam) ? categoryParam : undefined
  const concerns = (params.get('concern') ?? '').split(',').filter((id): id is ConcernId => isConcern(id))
  const sortParam = params.get('sort')
  const sort: SortId = isSort(sortParam) ? sortParam : 'featured'
  const query = (params.get('q') ?? '').trim()
  const concernKey = concerns.join(',')

  const results = useMemo(
    () => sortProducts(filterProducts(products, { category, concerns: concernKey ? (concernKey.split(',') as ConcernId[]) : [], query }), sort),
    [category, concernKey, query, sort],
  )

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const setCategory = (id: CategoryId | null) => update({ category: id })
  const toggleConcern = (id: ConcernId) => {
    const set = new Set(concerns)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    update({ concern: [...set].join(',') || null })
  }
  const clearAll = () => update({ category: null, concern: null, q: null })

  const singleConcern = concerns.length === 1 && !category ? shop.concerns.find((c) => c.id === concerns[0]) : undefined
  const title = query ? fill(labels.searchResults, { query }) : category ? categoryLabel(category) : singleConcern ? singleConcern.label : shop.title
  const intro = singleConcern && !query ? singleConcern.blurb : shop.intro
  const activeCount = (category ? 1 : 0) + concerns.length + (query ? 1 : 0)
  const countText = results.length === 1 ? labels.oneResult : fill(labels.results, { count: results.length })
  usePageMeta({ title })

  const [sheetOpen, setSheetOpen] = useState(false)
  const panel = (
    <FilterPanel category={category} concerns={concerns} onCategory={setCategory} onToggleConcern={toggleConcern} onClear={clearAll} activeCount={activeCount} />
  )

  return (
    <>
      <section className="container-page pb-8 pt-8 md:pb-12 md:pt-12">
        <Breadcrumbs items={title === shop.title ? [{ label: shop.title }] : [{ label: shop.title, href: '/shop' }, { label: title }]} />
        <Reveal className="mt-8 max-w-2xl md:mt-10">
          <p className="eyebrow text-secondary">{shop.eyebrow}</p>
          <h1 className="display-lg mt-4">{title}</h1>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{intro}</p>
        </Reveal>
      </section>

      <div className="container-page grid gap-10 pb-24 md:pb-32 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-14">
        <aside aria-label={labels.filters} className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)]">{panel}</div>
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4 border-b border-foreground/10 pb-4">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              className="inline-flex h-11 items-center gap-2.5 rounded-full border border-foreground/20 px-5 text-sm transition-colors hover:border-foreground lg:hidden"
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" strokeWidth={1.5} />
              {labels.filters}
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-foreground text-[0.65rem] font-semibold text-background">{activeCount}</span>
              )}
            </button>
            <p className="hidden text-sm text-muted lg:block" aria-live="polite">
              {countText}
            </p>
            <label className="flex items-center gap-3 text-sm">
              <span className="hidden text-muted sm:inline">{labels.sort}</span>
              <span className="relative">
                <select
                  value={sort}
                  onChange={(event) => update({ sort: event.target.value === 'featured' ? null : event.target.value })}
                  aria-label={labels.sort}
                  className="h-11 appearance-none rounded-full border border-foreground/20 bg-transparent pl-4 pr-10 text-sm transition-colors hover:border-foreground focus:outline-none focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  {shop.sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" strokeWidth={1.5} />
              </span>
            </label>
          </div>

          {activeCount > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label={labels.filters}>
              {query && <Chip label={`“${query}”`} onRemove={() => update({ q: null })} removeLabel={labels.clearSearch} />}
              {category && <Chip label={categoryLabel(category)} onRemove={() => setCategory(null)} removeLabel={`${labels.clear}: ${categoryLabel(category)}`} />}
              {concerns.map((id) => (
                <Chip key={id} label={concernLabel(id)} onRemove={() => toggleConcern(id)} removeLabel={`${labels.clear}: ${concernLabel(id)}`} />
              ))}
              <li>
                <button type="button" onClick={clearAll} className="link-draw ml-1 text-sm text-muted transition-colors hover:text-foreground">
                  {labels.clear}
                </button>
              </li>
            </ul>
          )}
          <p className="mt-4 text-sm text-muted lg:hidden" aria-live="polite">
            {countText}
          </p>

          {results.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:mt-10 md:grid-cols-3 md:gap-y-16">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((product, i) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.55, ease: EASE, delay: Math.min(i, 5) * 0.05 }}
                  >
                    <ProductCard product={product} priority={i < 3} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div className="mt-10 rounded-sm bg-surface px-6 py-16 text-center">
              <p className="font-display text-2xl">{labels.noResults}</p>
              <Button variant="outline" className="mt-6" onClick={clearAll}>
                {labels.noResultsCta}
              </Button>
            </div>
          )}
        </div>
      </div>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} count={results.length}>
        {panel}
      </FilterSheet>
    </>
  )
}

function Chip({ label, onRemove, removeLabel }: { label: string; onRemove: () => void; removeLabel: string }) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-surface pl-4 pr-3 text-sm transition-colors hover:bg-foreground hover:text-background"
      >
        {label}
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </li>
  )
}

type PanelProps = {
  category?: CategoryId
  concerns: ConcernId[]
  onCategory: (id: CategoryId | null) => void
  onToggleConcern: (id: ConcernId) => void
  onClear: () => void
  activeCount: number
}

function FilterPanel({ category, concerns, onCategory, onToggleConcern, onClear, activeCount }: PanelProps) {
  return (
    <div className="space-y-10">
      <div>
        <p id="filter-category" className="eyebrow text-muted">
          {labels.category}
        </p>
        <ul className="mt-4 space-y-0.5" aria-labelledby="filter-category">
          <li>
            <CategoryButton active={!category} label={labels.all} count={products.length} onClick={() => onCategory(null)} />
          </li>
          {shop.categories.map((c) => (
            <li key={c.id}>
              <CategoryButton active={category === c.id} label={c.label} count={countIn(c.id)} onClick={() => onCategory(c.id)} />
            </li>
          ))}
        </ul>
      </div>

      <fieldset>
        <legend className="eyebrow text-muted">{labels.concern}</legend>
        <div className="mt-4 space-y-1">
          {shop.concerns.map((c) => {
            const checked = concerns.includes(c.id)
            return (
              <label key={c.id} className="group flex cursor-pointer items-center gap-3 py-1.5 text-[0.98rem]">
                <input type="checkbox" checked={checked} onChange={() => onToggleConcern(c.id)} className="peer sr-only" />
                <span
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded-[5px] border transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                    checked ? 'border-foreground bg-foreground text-background' : 'border-foreground/30 group-hover:border-foreground',
                  )}
                >
                  {checked && <Check aria-hidden="true" className="size-3.5" strokeWidth={2.25} />}
                </span>
                <span className={checked ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}>{c.label}</span>
                <span className="ml-auto text-xs text-muted tabular-nums">{countWith(c.id)}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {activeCount > 0 && (
        <button type="button" onClick={onClear} className="link-draw text-sm">
          {labels.clear}
        </button>
      )}
    </div>
  )
}

function CategoryButton({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn('group flex w-full items-center justify-between py-1.5 text-left text-[0.98rem] transition-colors duration-300', active ? 'text-foreground' : 'text-foreground/70 hover:text-foreground')}
    >
      <span className="flex items-center">
        <span aria-hidden="true" className={cn('h-px bg-accent transition-all duration-500 ease-silk', active ? 'mr-2.5 w-4' : 'mr-0 w-0 group-hover:mr-2 group-hover:w-2')} />
        {label}
      </span>
      <span className="text-xs text-muted tabular-nums">{count}</span>
    </button>
  )
}

/** Phones and tablets: the filter panel in a bottom sheet. */
function FilterSheet({ open, onClose, count, children }: { open: boolean; onClose: () => void; count: number; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  useDialog(panel, open, onClose)
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div aria-hidden="true" className="absolute inset-0 bg-foreground/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={labels.filters}
            className="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col rounded-t-2xl bg-background shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
              <p className="font-display text-xl">{labels.filters}</p>
              <IconButton label={labels.closeFilters} onClick={onClose} className="-mr-2">
                <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
            <div className="border-t border-foreground/10 p-4">
              <Button className="w-full" size="lg" onClick={onClose}>
                {fill(labels.showResults, { count })}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

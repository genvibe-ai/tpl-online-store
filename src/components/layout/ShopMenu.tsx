import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router'
import { nav, shop } from '../../content'
import { defaultSize, getProduct, products } from '../../lib/catalog'
import { formatPrice } from '../../lib/format'
import { Picture } from '../ui/Picture'
import { EASE } from '../ui/Reveal'

const count = (category: string) => products.filter((p) => p.category === category).length

/** Desktop dropdown under "Shop": categories, concerns and one featured product. */
export function ShopMenu({ open, id }: { open: boolean; id: string }) {
  const featured = getProduct(nav.menu.featuredProductId)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-x-0 top-full hidden border-b border-foreground/10 bg-background shadow-[0_30px_50px_-30px_rgb(35_28_23/0.35)] lg:block"
        >
          <div className="container-page grid grid-cols-12 gap-10 py-10">
            <div className="col-span-3">
              <p className="eyebrow text-secondary">{nav.menu.categoriesTitle}</p>
              <ul className="mt-5 space-y-2.5">
                {shop.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/shop?category=${category.id}`}
                      className="group flex items-baseline justify-between gap-4 font-display text-[1.3rem] leading-snug transition-colors duration-300 hover:text-accent-deep"
                    >
                      <span className="transition-transform duration-500 ease-silk group-hover:translate-x-1">{category.label}</span>
                      <span className="font-sans text-xs text-muted tabular-nums">{count(category.id)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/shop" className="link-draw mt-7 inline-flex items-center gap-2 text-sm font-medium">
                {nav.menu.shopAll}
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>

            <div className="col-span-3">
              <p className="eyebrow text-secondary">{nav.menu.concernsTitle}</p>
              <ul className="mt-5 space-y-4">
                {shop.concerns.map((concern) => (
                  <li key={concern.id}>
                    <Link to={`/shop?concern=${concern.id}`} className="group flex items-center gap-4">
                      <Picture image={concern.image} alt="" reveal={false} hoverZoom className="size-12 shrink-0 rounded-full" />
                      <span>
                        <span className="block font-display text-lg leading-tight transition-colors duration-300 group-hover:text-accent-deep">{concern.label}</span>
                        <span className="text-xs text-muted">{concern.botanical}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {featured && (
              <Link to={`/products/${featured.id}`} className="group col-span-6 grid grid-cols-2 items-center gap-8 rounded-sm bg-surface p-4">
                <Picture image={featured.images[0]!} alt="" reveal={false} hoverZoom className="aspect-[4/3] rounded-sm" />
                <div className="pr-4">
                  <p className="eyebrow text-secondary">{nav.menu.featuredLabel}</p>
                  <p className="mt-3 font-display text-[1.75rem] leading-tight">{featured.name}</p>
                  <p className="mt-2 text-sm text-muted">{featured.tagline}</p>
                  <p className="mt-4 flex items-center gap-3 text-sm font-medium">
                    {formatPrice(defaultSize(featured).price)}
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

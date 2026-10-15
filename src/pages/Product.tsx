import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { AddToBagButton } from '../components/product/AddToBagButton'
import { ProductCard } from '../components/product/ProductCard'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductReviews } from '../components/product/ProductReviews'
import { SizeSelector } from '../components/product/SizeSelector'
import { AccordionItem } from '../components/ui/Accordion'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonLink } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Picture } from '../components/ui/Picture'
import { Price } from '../components/ui/Price'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { EASE } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Stars } from '../components/ui/Stars'
import { productPage, shop, ui } from '../content'
import { categoryLabel, defaultSize, getProduct, getProducts, getSize, type Product } from '../lib/catalog'
import { fill, formatPrice } from '../lib/format'
import { productJsonLd, useJsonLd, usePageMeta } from '../lib/site'

/** /products/:slug */
export function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)
  if (!product) return <ProductNotFound />
  // Keyed so size and quantity reset when moving between products.
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }: { product: Product }) {
  const [sizeId, setSizeId] = useState(defaultSize(product).id)
  const size = getSize(product, sizeId) ?? defaultSize(product)
  const [qty, setQty] = useState(1)
  const addRow = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)
  const included = product.includes ? getProducts(product.includes) : []
  const pairs = getProducts(product.pairsWith).slice(0, 3)

  usePageMeta({ title: product.name, description: product.description, image: product.images[0] })
  useJsonLd('product-jsonld', productJsonLd(product))

  // The sticky add bar (phones) appears once the main Add button has scrolled up out of view.
  // A scroll check (not IntersectionObserver): jumping straight from below to above the row fires no IO event.
  useEffect(() => {
    const el = addRow.current
    if (!el) return
    let frame = 0
    const check = () => {
      frame = 0
      setShowSticky(el.getBoundingClientRect().bottom < 0)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const enter = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay: 0.1 + i * 0.07 },
  })

  return (
    <>
      <div className="container-page pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { label: shop.title, href: '/shop' },
            { label: categoryLabel(product.category), href: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-page grid gap-10 pb-20 pt-6 md:pb-28 md:pt-8 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <motion.div className="min-w-0 lg:col-span-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <ProductGallery images={product.images} name={product.name} />
          </div>
        </motion.div>

        <div className="min-w-0 lg:col-span-5">
          <motion.p {...enter(0)} className="eyebrow text-secondary">
            {categoryLabel(product.category)}
            {product.badge && <span className="text-muted"> · {product.badge}</span>}
          </motion.p>
          <motion.h1 {...enter(1)} className="display-md mt-3">
            {product.name}
          </motion.h1>
          <motion.p {...enter(2)} className="mt-2 text-[1.05rem] text-muted">
            {product.tagline}
          </motion.p>

          <motion.div {...enter(3)} className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <Price price={size.price} compareAt={size.compareAt} className="font-display text-[2rem] font-light leading-none" />
            <a href="#reviews" className="group inline-flex items-center gap-2 text-sm">
              <Stars rating={product.rating} size={14} />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="link-draw text-muted transition-colors group-hover:text-foreground">{fill(ui.reviews, { count: product.reviewCount })}</span>
            </a>
          </motion.div>

          <motion.p {...enter(4)} className="mt-6 leading-relaxed text-foreground/80">
            {product.description}
          </motion.p>
          <motion.ul {...enter(5)} className="mt-5 flex flex-wrap gap-2">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="rounded-full bg-surface px-3.5 py-1.5 text-[0.8rem]">
                {highlight}
              </li>
            ))}
          </motion.ul>

          <motion.div {...enter(6)} className="mt-8 space-y-6 border-t border-foreground/10 pt-8">
            <SizeSelector sizes={product.sizes} value={size.id} onChange={setSizeId} name={`size-${product.id}`} />
            <div ref={addRow} className="flex gap-3">
              <QuantityStepper value={qty} onChange={setQty} label={`${ui.quantity}, ${product.name}`} />
              <AddToBagButton product={product} size={size} qty={qty} className="flex-1" />
            </div>
          </motion.div>

          <motion.ul {...enter(7)} className="mt-7 space-y-3 text-[0.92rem]">
            {productPage.perks.map((perk) => (
              <li key={perk.text} className="flex items-center gap-3 text-foreground/80">
                <Icon name={perk.icon} className="size-[1.15rem] shrink-0 text-secondary" />
                {fill(perk.text)}
              </li>
            ))}
          </motion.ul>

          {included.length > 0 && (
            <motion.div {...enter(8)} className="mt-8 rounded-sm bg-surface p-5">
              <p className="eyebrow text-secondary">{productPage.inside}</p>
              <ul className="mt-4 space-y-3">
                {included.map((item) => (
                  <li key={item.id}>
                    <Link to={`/products/${item.id}`} className="group flex items-center gap-3.5">
                      <Picture image={item.images[0]!} alt="" reveal={false} className="size-12 shrink-0 rounded-sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1.02rem] leading-snug transition-colors group-hover:text-accent-deep">{item.name}</span>
                        <span className="block text-sm text-muted">{item.tagline}</span>
                      </span>
                      <span className="text-sm text-muted tabular-nums">{formatPrice(defaultSize(item).price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div {...enter(9)} className="mt-9 border-t border-foreground/12">
            <AccordionItem title={productPage.sections.ingredients} defaultOpen>
              <ul className="space-y-3">
                {product.keyIngredients.map((ingredient) => (
                  <li key={ingredient.name}>
                    <span className="font-medium text-foreground">{ingredient.name}.</span> {ingredient.benefit}
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title={productPage.sections.howTo}>
              <ol className="space-y-2.5">
                {product.howTo.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-display text-foreground">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </AccordionItem>
            <AccordionItem title={productPage.sections.inci}>
              <p className="text-[0.88rem] leading-relaxed">{product.inci}</p>
            </AccordionItem>
            <AccordionItem title={productPage.sections.shipping}>
              <p>{fill(productPage.shippingText)}</p>
            </AccordionItem>
          </motion.div>
        </div>
      </section>

      <ProductReviews product={product} />

      {pairs.length > 0 && (
        <section aria-labelledby="pairs-title" className="section-pad border-t border-foreground/10 bg-surface/50">
          <div className="container-page">
            <SectionHeading id="pairs-title" heading={productPage.pairsHeading} />
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:mt-14 md:grid-cols-3">
              {pairs.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <StickyAddBar visible={showSticky} product={product} sizeLabel={size.label} price={size.price * qty}>
        <AddToBagButton product={product} size={size} qty={qty} compact fullWidth={false} label={productPage.stickyAdd} />
      </StickyAddBar>
    </>
  )
}

function StickyAddBar({ visible, product, sizeLabel, price, children }: { visible: boolean; product: Product; sizeLabel: string; price: number; children: ReactNode }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
        >
          <div className="container-page flex items-center gap-3 py-3">
            <Picture image={product.images[0]!} alt="" reveal={false} className="size-12 shrink-0 rounded-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[1rem] leading-snug">{product.name}</p>
              <p className="text-sm text-muted">
                {sizeLabel} · {formatPrice(price)}
              </p>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProductNotFound() {
  usePageMeta({ title: productPage.notFound.heading })
  return (
    <section className="container-page py-28 text-center md:py-40">
      <h1 className="display-md mx-auto max-w-xl">{productPage.notFound.heading}</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">{productPage.notFound.text}</p>
      <ButtonLink to="/shop" className="mt-8" arrow>
        {productPage.notFound.cta}
      </ButtonLink>
    </section>
  )
}

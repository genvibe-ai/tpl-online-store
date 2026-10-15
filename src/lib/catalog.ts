import { shop, type CategoryId, type ConcernId, type SortId } from '../content'
import { products, type Product, type Review, type Size } from '../data/products'

export { products }
export type { Product, Review, Size }

const byId = new Map(products.map((product) => [product.id, product]))

export const getProduct = (id: string | null | undefined) => (id ? byId.get(id) : undefined)

/** Products for a list of ids, in that order (unknown ids are skipped). */
export const getProducts = (ids: readonly string[]) =>
  ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product))

export const defaultSize = (product: Product): Size =>
  product.sizes.find((size) => size.id === product.defaultSize) ?? product.sizes[0]!

export const getSize = (product: Product, sizeId: string | null | undefined) => product.sizes.find((size) => size.id === sizeId)

/** The price shown on cards and used for sorting (the default size). */
export const displayPrice = (product: Product) => defaultSize(product).price

export const categoryLabel = (id: string) => shop.categories.find((c) => c.id === id)?.label ?? id
export const concernLabel = (id: string) => shop.concerns.find((c) => c.id === id)?.label ?? id

export const isCategory = (id: string | null): id is CategoryId => !!id && shop.categories.some((c) => c.id === id)
export const isConcern = (id: string | null): id is ConcernId => !!id && shop.concerns.some((c) => c.id === id)
export const isSort = (id: string | null): id is SortId => !!id && shop.sortOptions.some((option) => option.id === id)

/** A review and the product it belongs to, by review id. */
export function getReview(id: string): { review: Review; product: Product } | undefined {
  for (const product of products) {
    const review = product.reviews.find((r) => r.id === id)
    if (review) return { review, product }
  }
  return undefined
}

/** Weighted average rating and total review count across the whole catalog. */
export function catalogRating() {
  const count = products.reduce((sum, p) => sum + p.reviewCount, 0)
  const weighted = products.reduce((sum, p) => sum + p.rating * p.reviewCount, 0)
  return { rating: count ? Math.round((weighted / count) * 10) / 10 : 0, count }
}

/** A plausible 5→1 star split (in %) for an average rating, for the review summary bars. */
export function ratingBreakdown(average: number) {
  const five = Math.round(Math.min(96, Math.max(30, ((average - 3.9) / 1.1) * 100)))
  const four = Math.round((100 - five) * 0.6)
  const three = Math.round((100 - five - four) * 0.6)
  const two = Math.round((100 - five - four - three) * 0.6)
  return [five, four, three, two, 100 - five - four - three - two]
}

/* ── Search, filters & sorting (shop page, search overlay) ───────────────── */

const haystacks = new Map(
  products.map((p) => [
    p.id,
    [
      p.name,
      p.tagline,
      p.description,
      categoryLabel(p.category),
      ...p.concerns.map(concernLabel),
      ...p.highlights,
      ...p.keyIngredients.map((k) => k.name),
    ]
      .join(' ')
      .toLowerCase(),
  ]),
)

/** Every word of the query must appear (long words match by their stem: "sensitive" finds "sensitivity"). */
export function matchesQuery(product: Product, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const haystack = haystacks.get(product.id) ?? ''
  return words.every((word) => haystack.includes(word.length > 6 ? word.slice(0, 6) : word))
}

export const searchProducts = (query: string) => (query.trim() ? products.filter((p) => matchesQuery(p, query)) : [])

export type ShopFilters = { category?: CategoryId; concerns: ConcernId[]; query: string }

export function filterProducts(list: Product[], { category, concerns, query }: ShopFilters) {
  return list.filter(
    (p) =>
      (!category || p.category === category) &&
      (concerns.length === 0 || concerns.some((c) => p.concerns.includes(c))) &&
      (!query || matchesQuery(p, query)),
  )
}

export function sortProducts(list: Product[], sort: SortId) {
  const sorted = [...list]
  switch (sort) {
    case 'bestselling':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'price-asc':
      return sorted.sort((a, b) => displayPrice(a) - displayPrice(b))
    case 'price-desc':
      return sorted.sort((a, b) => displayPrice(b) - displayPrice(a))
    default:
      return sorted
  }
}

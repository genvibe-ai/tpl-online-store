import { useEffect } from 'react'
import { contact, site, theme, type Img } from '../content'
import { defaultSize, type Product } from './catalog'

/** Pushes theme.colors from content.ts into CSS variables (Tailwind's color tokens read them). */
export function applyTheme() {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.colors)) {
    // accentForeground → --color-accent-foreground
    root.style.setProperty(`--color-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, value)
  }
  setMeta('name', 'theme-color', theme.colors.background)
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const origin = () => site.url || window.location.origin
export const absoluteUrl = (path: string) => new URL(path, origin()).href

/** Language, social tags and the store's Organization JSON-LD (once, at startup). */
export function applyHead() {
  document.documentElement.lang = site.locale
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', site.name)
  setMeta('property', 'og:locale', site.locale.replace('-', '_'))
  setMeta('name', 'twitter:card', 'summary_large_image')
  setJsonLd('org-jsonld', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: origin(),
    logo: absoluteUrl('/favicon.svg'),
    email: contact.email,
    telephone: contact.phone,
  })
}

function setJsonLd(id: string, data: unknown) {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

/** Per-page title, description and share image ("Fig Leaf Renewal Serum · Fernlace"). */
export function usePageMeta({ title, description, image }: { title?: string; description?: string; image?: Img }) {
  const imageSrc = (image ?? site.socialImage).src
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : site.title
    const text = description ?? site.description
    setMeta('name', 'description', text)
    setMeta('property', 'og:title', document.title)
    setMeta('property', 'og:description', text)
    setMeta('property', 'og:image', absoluteUrl(imageSrc))
  }, [title, description, imageSrc])
}

/** Adds a JSON-LD block while the page is mounted. */
export function useJsonLd(id: string, data: unknown) {
  const json = JSON.stringify(data)
  useEffect(() => {
    setJsonLd(id, JSON.parse(json))
    return () => document.getElementById(id)?.remove()
  }, [id, json])
}

/** schema.org Product with offers and rating, for product pages. */
export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => absoluteUrl(img.src)),
    sku: `${product.id}-${defaultSize(product).id}`,
    brand: { '@type': 'Brand', name: site.name },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: product.sizes.map((size) => ({
      '@type': 'Offer',
      name: size.label,
      price: size.price.toFixed(2),
      priceCurrency: site.currency,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/products/${product.id}`),
    })),
  }
}

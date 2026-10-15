## What this app is
Fernlace: a premium online store template for a fictional botanical skincare brand. Vite 8, React 19, TypeScript, Tailwind CSS 4, React Router 7, Zustand, motion, lucide-react. Runs fully in the browser on mock data: no backend, no env vars. Ported from GoCart (MIT).

## Built so far
- Home: full-bleed photo hero, promise strip, bestsellers carousel, shop-by-concern arches, ingredient story with numbered hotspots, reviews, journal teaser, newsletter.
- Shop (/shop): category + concern filters, search (?q=), sort, grid with quick add. Filters live in the URL.
- Product (/products/:id): gallery, size variants, quantity, add to bag with toast, accordions, reviews, "complete the ritual".
- Bag drawer (free-shipping progress), checkout (/checkout, demo only: no payment), confirmation (/order/:id), journal, info pages, 404.

## Design
Colors: ivory #F7F1EA background, linen #EFE6DA surface, ink #231C17 text, muted #6E6259, terracotta #B5543C accent (white text on it), olive #4B5A3C secondary. Fonts: Playfair (light, optical sizes) for display, Jost for body. Pill buttons, 4px image radius, arch tiles. Hero copy is white over an ink scrim (.hero-scrim, deeper on phones) with the eyebrow in a 62% ink pill: measured ≥ 4.5:1 at 360–1920px, keep it that way. Motion: hero zoom-settle + line-mask headline reveal, fade/scale image reveals on scroll, add-to-bag adding → added check, bag icon hop, drawer slide. Reduced motion respected.

## Structure
- src/content.ts: ALL copy, colors (theme.colors), images (path, alt, size, focus/zoom), store settings (shipping, discount codes, tax), nav, page copy.
- src/data/products.ts: catalog (prices, sizes, ingredients, reviews).
- src/store/cart.ts: Zustand bag + saved orders (localStorage); src/store/toast.ts.
- src/lib: catalog.ts (lookups, filters), format.ts (prices, fill), site.ts (theme, meta, JSON-LD), hooks.ts, useAddToBag.ts.
- src/pages/*, src/components/{layout,home,product,journal,ui}. Router in src/App.tsx.
- public/images/*.webp, public/favicon.svg.

## User preferences & rules
- Edit src/content.ts first (and src/data/products.ts for products); never hard-code copy or hex colors in components.
- Keep the design system: tokens bg-background, bg-surface, text-foreground, text-muted, bg-accent, bg-secondary; display-lg/display-md/eyebrow utilities; *word* italic accents.
- Product ids are URL slugs. Images: WebP in public/images with real width/height.

## Open issues & next ideas
- Checkout is a mock: connect a payment provider (e.g. via a backend) to take real orders.
- Newsletter and "write a review" are front-end only.
- Ideas: accounts and order history (Supabase), wishlist, more products and images per product.

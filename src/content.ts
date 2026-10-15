/* =============================================================================
 *  FERNLACE · STORE CONTENT
 *  This is the ONE file to edit for the brand: every word, color, image path,
 *  store setting (shipping, discount codes) and page copy lives here.
 *  Components in src/components and src/pages only read it.
 *
 *  The product catalog (names, prices, sizes, ingredients, reviews) is the
 *  one large dataset kept apart: src/data/products.ts. It uses the images below.
 *
 *  Conventions
 *  • *word*    Single asterisks in headings render as the italic accent,
 *              e.g. "Skin care, *slowly* grown."
 *  • {token}   Filled in at runtime: {freeShipping} → "$75", {amount}, {count}…
 *  • Images    WebP files in public/images/, referenced as "/images/<file>.webp".
 *              Keep width/height equal to the real file. Optional `focus`
 *              (CSS object-position) and `zoom` (1 = no zoom) crop an image.
 *  • Colors    theme.colors become CSS variables and Tailwind classes:
 *              bg-background, bg-surface, bg-card, text-foreground, text-muted,
 *              bg-accent / text-accent-foreground, bg-secondary / text-secondary-foreground.
 *  • Links     Internal links start with "/" (React Router). "/#ingredients"
 *              jumps to a section on the home page.
 * ========================================================================== */

export type Img = {
  src: string
  alt: string
  width: number
  height: number
  /** CSS object-position used when the image is cropped, e.g. "60% 40%". */
  focus?: string
  /** Zooms into `focus` (1 = no zoom). Used for close-up crops of one photo. */
  zoom?: number
}
export type Link = { label: string; href: string }
export type IconName = 'leaf' | 'flask' | 'recycle' | 'shield' | 'truck' | 'gift' | 'returns' | 'sparkles' | 'droplet' | 'lock'

/* ── Colors ─────────────────────────────────────────────────────────────── */
export const theme = {
  colors: {
    background: '#F7F1EA', // warm ivory: page background
    surface: '#EFE6DA', // linen: image wells, alternate sections
    card: '#FBF8F4', // cards, inputs, the bag drawer
    foreground: '#231C17', // ink: main text
    muted: '#6E6259', // secondary text (keep at least 4.5:1 against background)
    accent: '#B5543C', // terracotta: buttons, badges, stars, italic accents
    accentForeground: '#FFFFFF', // text on terracotta (white keeps 4.9:1)
    secondary: '#4B5A3C', // olive: announcement bar, ingredient story, small labels
    secondaryForeground: '#F7F1EA', // text on olive
  },
}

/* ── Images (public/images) ─────────────────────────────────────────────── */
const botanicals: Img = {
  src: '/images/store-botanicals.webp',
  alt: 'Olive leaves, kaolin clay, oat grains, calendula petals and a halved fig on cream linen',
  width: 1600,
  height: 1067,
}

export const images = {
  hero: {
    src: '/images/store-hero.webp',
    alt: 'A hand holding an amber glass dropper bottle above a travertine ledge in soft morning light',
    width: 1600,
    height: 1067,
    focus: '60% 45%',
  },
  botanicals,
  // Close-up crops of the flat lay (same file, zoomed in on one botanical).
  oliveLeaf: { ...botanicals, alt: 'Fresh olive leaves on linen', focus: '12% 42%', zoom: 1.9 },
  calendula: { ...botanicals, alt: 'Dried calendula petals on a stone dish', focus: '42% 72%', zoom: 1.9 },
  oat: { ...botanicals, alt: 'A small pile of oat grains on linen', focus: '76% 8%', zoom: 2.1 },
  fig: { ...botanicals, alt: 'A halved ripe fig on linen', focus: '77% 66%', zoom: 2.2 },
  serum: { src: '/images/store-serum.webp', alt: 'Amber glass dropper bottle of serum on a terracotta plinth', width: 1000, height: 1000 },
  cream: { src: '/images/store-cream.webp', alt: 'Open frosted glass jar of rich cream beside a sprig of olive leaves', width: 1000, height: 1000 },
  cleanser: { src: '/images/store-cleanser.webp', alt: 'Olive-green tube of cream cleanser resting on wet stone', width: 1000, height: 1000 },
  oil: { src: '/images/store-oil.webp', alt: 'A woman pressing a drop of golden facial oil from a dropper', width: 1000, height: 1000, focus: '50% 40%' },
  toner: { src: '/images/store-toner.webp', alt: 'Frosted pink spray bottle of toning mist beside garden roses', width: 1000, height: 1000 },
  balm: { src: '/images/store-balm.webp', alt: 'Open brass tin of lip balm on pale stone', width: 1000, height: 1000, focus: '60% 65%' },
  avatars: [
    { src: '/images/av-1.webp', alt: 'Portrait of Amara O.', width: 320, height: 320 },
    { src: '/images/av-2.webp', alt: 'Portrait of Daniel K.', width: 320, height: 320 },
    { src: '/images/av-3.webp', alt: 'Portrait of Lucía M.', width: 320, height: 320 },
    { src: '/images/av-4.webp', alt: 'Portrait of Graham P.', width: 320, height: 320 },
    { src: '/images/av-5.webp', alt: 'Portrait of Yasmin H.', width: 320, height: 320 },
    { src: '/images/av-6.webp', alt: 'Portrait of Rohan S.', width: 320, height: 320 },
    { src: '/images/av-7.webp', alt: 'Portrait of Niamh C.', width: 320, height: 320 },
    { src: '/images/av-8.webp', alt: 'Portrait of Marcus T.', width: 320, height: 320 },
  ],
} satisfies Record<string, Img | Img[]>

/* ── Brand, SEO & store settings ────────────────────────────────────────── */
export const site = {
  name: 'Fernlace',
  title: 'Fernlace · Botanical skincare, slowly grown',
  description:
    'Small-batch botanical skincare made with olive leaf, calendula, oat and fig. Serums, creams and oils for calm, nourished skin, bottled in glass.',
  /** Live domain for SEO, e.g. "https://fernlace.com". Leave empty to use the current domain. */
  url: '',
  locale: 'en-US',
  currency: 'USD',
  socialImage: images.hero,
  /** localStorage key for the bag and past orders. */
  storageKey: 'fernlace-store',
}

export const store = {
  /** Orders at or above this subtotal ship free (Standard). */
  freeShippingThreshold: 75,
  shippingMethods: [
    { id: 'standard', label: 'Standard', detail: '3–5 business days', price: 6, freeOverThreshold: true, days: [3, 5] },
    { id: 'express', label: 'Express', detail: '1–2 business days', price: 18, freeOverThreshold: false, days: [1, 2] },
  ],
  /** Codes customers can type at checkout. */
  discountCodes: [{ code: 'WELCOME10', percent: 10, label: '10% off your first order' }],
  /** Estimated sales tax shown at checkout, e.g. 0.08 = 8%. 0 hides the line. */
  taxRate: 0,
  orderPrefix: 'VLM',
  maxQuantity: 10,
  countries: ['United States', 'Canada', 'United Kingdom', 'Australia'],
}

export const contact = {
  email: 'hello@fernlace.example',
  phone: '+1 (805) 555-0142',
  address: '41 Orchard Row, Larkhaven, CA 93099',
  hours: 'Monday to Friday, 9am to 5pm PT',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/' },
  ] satisfies Link[],
}

/* ── Shop taxonomy (product data refers to these ids) ───────────────────── */
const categories = [
  { id: 'cleanse', label: 'Cleanse' },
  { id: 'tone', label: 'Tone' },
  { id: 'treat', label: 'Treat' },
  { id: 'moisturize', label: 'Moisturize' },
  { id: 'lips', label: 'Lip care' },
  { id: 'sets', label: 'Sets & gifts' },
] as const

const concerns = [
  { id: 'dryness', label: 'Dryness', blurb: 'Rich textures that rebuild a thirsty barrier.', botanical: 'Olive leaf', image: images.oliveLeaf },
  { id: 'dullness', label: 'Dullness', blurb: 'Brightening botanicals for a lit-from-within glow.', botanical: 'Calendula', image: images.calendula },
  { id: 'sensitivity', label: 'Sensitivity', blurb: 'Soothing, fragrance-free care for reactive skin.', botanical: 'Oat', image: images.oat },
  { id: 'fine-lines', label: 'Fine lines', blurb: 'A gentle plant alternative to retinol.', botanical: 'Fig', image: images.fig },
] as const

export type CategoryId = (typeof categories)[number]['id']
export type ConcernId = (typeof concerns)[number]['id']
export type SortId = 'featured' | 'bestselling' | 'price-asc' | 'price-desc' | 'rating'

/* ── Interface labels ───────────────────────────────────────────────────── */
export const ui = {
  skipToContent: 'Skip to content',
  home: 'Home',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mainNav: 'Main',
  search: 'Search',
  closeSearch: 'Close search',
  bag: 'Bag',
  openBag: 'Open bag, {count} items',
  closeBag: 'Close bag',
  yourBag: 'Your bag',
  addToBag: 'Add to bag',
  adding: 'Adding',
  added: 'Added',
  quickAdd: 'Quick add',
  addedToast: 'Added to your bag',
  viewBag: 'View bag',
  remove: 'Remove',
  quantity: 'Quantity',
  decrease: 'Decrease quantity',
  increase: 'Increase quantity',
  subtotal: 'Subtotal',
  checkout: 'Checkout',
  continueShopping: 'Continue shopping',
  shippingNote: 'Shipping and discount codes are added at checkout.',
  freeShippingProgress: 'You are {amount} away from free shipping',
  freeShippingUnlocked: 'Complimentary shipping unlocked',
  emptyBag: 'Your bag is empty',
  emptyBagText: 'Start with our most-loved formulas, or let your skin concern guide you.',
  emptyBagCta: 'Shop bestsellers',
  dismiss: 'Dismiss',
  previous: 'Previous',
  next: 'Next',
  reviews: '{count} reviews',
  ratedOutOf: 'Rated {rating} out of 5',
  from: 'From',
  readMore: 'Read the story',
  minRead: '{minutes} min read',
  pairsWellWith: 'Pairs well with',
  add: 'Add',
  qty: 'Qty',
  breadcrumb: 'Breadcrumb',
  ratingBreakdown: 'Rating breakdown',
  was: 'Was',
  submenu: '{label} menu',
}

/* ── Announcement bar & navigation ──────────────────────────────────────── */
export const announcement = {
  messages: [
    'Free shipping on orders over {freeShipping}',
    'Two free samples with every order',
    'New here? Use WELCOME10 for 10% off',
  ],
}

export const nav = {
  /** `menu: true` turns the link into the Shop dropdown (categories, concerns and a featured product). */
  links: [
    { label: 'Shop', href: '/shop', menu: true },
    { label: 'Bestsellers', href: '/shop?sort=bestselling' },
    { label: 'Ingredients', href: '/#ingredients' },
    { label: 'Journal', href: '/journal' },
  ],
  menu: {
    categoriesTitle: 'Shop by category',
    concernsTitle: 'Shop by concern',
    shopAll: 'Shop all products',
    featuredProductId: 'the-evening-ritual',
    featuredLabel: 'The ritual we would gift',
  },
}

export const search = {
  placeholder: 'Search serums, oils, ingredients…',
  label: 'Search the store',
  popularTitle: 'Popular searches',
  popular: ['Serum', 'Calendula', 'Lip balm', 'Sensitive skin'],
  resultsTitle: 'Products',
  noResults: 'Nothing matches “{query}”. Try “oil” or “cream”.',
  viewAll: 'See all results',
}

/* ── Home page ──────────────────────────────────────────────────────────── */
export const home = {
  hero: {
    eyebrow: 'Small-batch botanical skincare',
    /** One string per line; the lines rise in one after another. */
    headline: ['Skin care,', '*slowly* grown.'],
    intro:
      'Cold-pressed olive leaf, calendula, oat and fig, made in small batches and bottled in glass. Gentle formulas for calm, nourished skin.',
    image: images.hero,
    primaryCta: { label: 'Shop the collection', href: '/shop' },
    secondaryCta: { label: 'Find your ritual', href: '/#concerns' },
    featured: { productId: 'fig-leaf-renewal-serum', label: 'Pictured', cta: 'Shop now' },
  },
  promisesLabel: 'Our promises',
  promises: [
    { icon: 'leaf', title: 'Plant-powered actives', text: 'Botanicals at levels that work, never just for the label.' },
    { icon: 'flask', title: 'Small-batch fresh', text: 'Made in runs of 400 and cold-processed to protect every active.' },
    { icon: 'recycle', title: 'Glass, not plastic', text: 'Recyclable glass and brass, with refills for our bestsellers.' },
    { icon: 'shield', title: 'Gentle by design', text: 'Fragrance-free, dermatologist-tested, kind to sensitive skin.' },
  ] satisfies { icon: IconName; title: string; text: string }[],
  bestsellers: {
    eyebrow: 'Most loved',
    heading: 'The *bestsellers*',
    intro: 'The formulas our community reorders most, each one made in small batches.',
    cta: { label: 'Shop all', href: '/shop' },
    productIds: [
      'olive-leaf-barrier-cream',
      'fig-leaf-renewal-serum',
      'calendula-facial-oil',
      'oat-milk-cream-cleanser',
      'rose-petal-toning-mist',
      'fig-butter-lip-balm',
    ],
  },
  concerns: {
    id: 'concerns',
    eyebrow: 'Shop by concern',
    heading: 'What does your skin *need* today?',
    intro: 'Four common concerns, four botanicals we trust for each. Choose one to see the formulas that help.',
    countLabel: '{count} formulas',
  },
  ingredients: {
    id: 'ingredients',
    eyebrow: 'From the field',
    heading: 'Five botanicals. *Nothing* we can’t explain.',
    body: 'Every Fernlace formula is built around a handful of plants we know by name, grown by farms we visit each season. We cold-press and slow-steep them in small batches, so what reaches your skin is as close to the field as glass allows.',
    image: images.botanicals,
    /** x/y place each numbered marker on the photo, in % from the top-left corner. */
    botanicals: [
      { name: 'Olive leaf', benefit: 'Antioxidant-rich and calming, the backbone of our Barrier Cream.', x: 16, y: 40, productId: 'olive-leaf-barrier-cream' },
      { name: 'Kaolin clay', benefit: 'A soft mineral that lifts impurities without stripping.', x: 48, y: 22, productId: 'oat-milk-cream-cleanser' },
      { name: 'Oat', benefit: 'Colloidal oat soothes redness and itch in our cleanser.', x: 74, y: 24, productId: 'oat-milk-cream-cleanser' },
      { name: 'Calendula', benefit: 'Steeped for six weeks to make our golden Facial Oil.', x: 43, y: 69, productId: 'calendula-facial-oil' },
      { name: 'Fig', benefit: 'Fig leaf and fruit smooth and soften in our serum and balm.', x: 76, y: 61, productId: 'fig-leaf-renewal-serum' },
    ],
    usedIn: 'Found in',
    cta: { label: 'Read the field guide', href: '/journal/a-field-guide-to-our-botanicals' },
  },
  reviews: {
    eyebrow: 'Reviews',
    heading: 'Loved by *calm* complexions',
    rating: 4.8,
    count: 2140,
    summary: '{rating} out of 5 from {count} verified reviews',
    /** Review ids from src/data/products.ts. */
    featured: ['r-cream-1', 'r-serum-2', 'r-balm-1'],
    on: 'On',
  },
  journal: {
    id: 'journal',
    eyebrow: 'The journal',
    heading: 'Notes from the *field*',
    cta: { label: 'All stories', href: '/journal' },
  },
  newsletter: {
    eyebrow: 'Letters from Fernlace',
    heading: 'Slow beauty, *in your inbox*.',
    text: 'Seasonal rituals, new botanicals and early access to small batches, about twice a month. Plus 10% off your first order.',
    label: 'Email address',
    placeholder: 'Your email address',
    button: 'Subscribe',
    success: 'Thank you. Your welcome note is on its way. (Demo: nothing is sent.)',
    legal: 'Unsubscribe anytime. We never share your email.',
  },
}

/* ── Shop page ──────────────────────────────────────────────────────────── */
export const shop = {
  eyebrow: 'The collection',
  title: 'Shop all',
  intro: 'Eight small-batch formulas and sets, each built around botanicals we can name.',
  categories,
  concerns,
  sortOptions: [
    { id: 'featured', label: 'Featured' },
    { id: 'bestselling', label: 'Bestselling' },
    { id: 'rating', label: 'Top rated' },
    { id: 'price-asc', label: 'Price: low to high' },
    { id: 'price-desc', label: 'Price: high to low' },
  ] satisfies { id: SortId; label: string }[],
  labels: {
    filters: 'Filters',
    closeFilters: 'Close filters',
    category: 'Category',
    concern: 'Skin concern',
    all: 'All products',
    sort: 'Sort by',
    clear: 'Clear all',
    results: '{count} products',
    oneResult: '1 product',
    showResults: 'Show {count} products',
    searchResults: 'Results for “{query}”',
    clearSearch: 'Clear search',
    noResults: 'No products match these filters.',
    noResultsCta: 'Clear filters',
  },
}

/* ── Product page ───────────────────────────────────────────────────────── */
export const productPage = {
  size: 'Size',
  inside: 'What’s inside',
  perks: [
    { icon: 'truck', text: 'Free shipping on orders over {freeShipping}' },
    { icon: 'gift', text: 'Two complimentary samples with every order' },
    { icon: 'returns', text: '30-day returns, even if opened' },
  ] satisfies { icon: IconName; text: string }[],
  sections: {
    ingredients: 'Key ingredients',
    howTo: 'How to use',
    inci: 'Full ingredient list',
    shipping: 'Shipping & returns',
  },
  shippingText:
    'Orders ship from Larkhaven, California within 1–2 business days. Standard shipping is free over {freeShipping}; express arrives in 1–2 business days. Not quite right? Return it within 30 days, even opened, for a full refund.',
  gallery: 'Product images',
  showImage: 'Show image {index}',
  reviewsHeading: 'Reviews',
  basedOn: 'Based on {count} reviews',
  verified: 'Verified buyer',
  skinType: 'Skin type',
  writeReview: 'Write a review',
  writeReviewToast: 'Reviews open after your first order (demo).',
  showMoreReviews: 'Show more reviews',
  pairsHeading: 'Complete the *ritual*',
  stickyAdd: 'Add',
  notFound: {
    heading: 'This product has wandered off',
    text: 'It may have sold out or moved. The rest of the collection is right this way.',
    cta: 'Back to the shop',
  },
}

/* ── Checkout & order confirmation (demo: nothing is charged or sent) ───── */
export const checkout = {
  title: 'Checkout',
  secure: 'Secure demo checkout',
  backToBag: 'Back to bag',
  demoNote:
    'Demo checkout: no payment is taken and nothing ships. Use any details you like, or fill in the sample details.',
  fillDemo: 'Fill in sample details',
  sections: { contact: 'Contact', shipping: 'Shipping address', delivery: 'Delivery', payment: 'Payment' },
  fields: {
    email: 'Email',
    phone: 'Phone (optional)',
    newsletter: 'Email me new rituals and early access',
    country: 'Country',
    firstName: 'First name',
    lastName: 'Last name',
    address: 'Address',
    apartment: 'Apartment, suite, etc. (optional)',
    city: 'City',
    state: 'State / Province',
    zip: 'ZIP / Postal code',
    cardNumber: 'Card number',
    expiry: 'Expiry (MM / YY)',
    cvc: 'Security code',
    nameOnCard: 'Name on card',
  },
  errors: {
    required: 'Please fill in this field.',
    email: 'Enter an email like name@example.com.',
    card: 'Enter the 16-digit card number.',
    expiry: 'Use the format MM / YY.',
    cvc: 'Enter 3 or 4 digits.',
  },
  paymentNote: 'Demo only: no payment is taken and card details never leave your browser.',
  placeOrder: 'Place order · {total}',
  placing: 'Placing order',
  summary: 'Order summary',
  showSummary: 'Show order summary',
  hideSummary: 'Hide order summary',
  discount: 'Discount code',
  discountRow: 'Discount',
  discountPlaceholder: 'Discount code',
  apply: 'Apply',
  invalidCode: 'That code isn’t valid. Try WELCOME10.',
  appliedCode: '{code} applied',
  removeCode: 'Remove code',
  shipping: 'Shipping',
  free: 'Free',
  tax: 'Estimated tax',
  total: 'Total',
  empty: { heading: 'Your bag is empty', text: 'Add a formula or two, then come back to check out.', cta: 'Go to the shop' },
  /** Used by “Fill in sample details”. */
  sample: {
    email: 'ava.morgan@mail.example',
    phone: '(805) 555-0199',
    firstName: 'Ava',
    lastName: 'Morgan',
    address: '27 Juniper Lane',
    apartment: 'Apt 4',
    city: 'Larkhaven',
    state: 'CA',
    zip: '93099',
    cardNumber: '1234 5678 9012 3456',
    expiry: '12 / 29',
    cvc: '123',
    nameOnCard: 'Ava Morgan',
  },
}

export const confirmation = {
  eyebrow: 'Order {id}',
  heading: 'Thank you, *{name}*.',
  text: 'Your order is confirmed. A receipt would be emailed to {email}. This is a demo store, so no payment was taken and nothing will ship.',
  arriving: 'Arriving',
  shipTo: 'Shipping to',
  delivery: 'Delivery',
  payment: 'Payment',
  paymentValue: 'Card ending {last4} · demo, not charged',
  items: 'In your order',
  cta: { label: 'Continue shopping', href: '/shop' },
  secondary: { label: 'Read: the five-minute evening ritual', href: '/journal/the-five-minute-evening-ritual' },
  notFound: {
    heading: 'We couldn’t find that order',
    text: 'Demo orders are saved in this browser only. Place a new one any time.',
    cta: 'Go to the shop',
  },
}

/* ── Journal ────────────────────────────────────────────────────────────── */
export const journal = {
  eyebrow: 'The journal',
  title: 'Notes from the *field*',
  intro: 'Rituals, ingredients and the farms behind them, written by the people who make Fernlace.',
  shopTheStory: 'Shop the *story*',
  moreStories: 'More stories',
  back: 'All stories',
  posts: [
    {
      slug: 'the-five-minute-evening-ritual',
      title: 'The five-minute evening ritual',
      category: 'Rituals',
      date: '2026-09-18',
      minutes: 4,
      author: 'Maren Ashby, founder',
      image: images.hero,
      excerpt: 'Four steps, one sink and no complicated layering: how our founder winds down skin and mind at the end of the day.',
      body: [
        'Most nights I have five minutes, not fifty. The ritual I keep coming back to is short on purpose: it is built to be repeated, and repetition is where skin care actually works.',
        'Start by cleansing with something that leaves your skin comfortable rather than squeaky. Massage the Oat Milk Cream Cleanser in slow circles for thirty seconds, then rinse with lukewarm water. Your skin should feel soft, never tight.',
        'While your face is still damp, mist with rose water and press it in with your palms. Damp skin drinks in what comes next, so you need less of it.',
        'Then the serum. Four drops of Fig Leaf Renewal Serum, warmed between the fingertips and pressed, not rubbed, over face and neck. Bakuchiol does its quiet work overnight.',
        'Seal it all in with a pearl of Olive Leaf Barrier Cream. That is the whole ritual. Turn the light down, and let the plants do the rest.',
      ],
      productIds: ['oat-milk-cream-cleanser', 'fig-leaf-renewal-serum', 'olive-leaf-barrier-cream'],
    },
    {
      slug: 'why-we-steep-calendula-for-six-weeks',
      title: 'Why we steep calendula for six weeks',
      category: 'Ingredients',
      date: '2026-08-27',
      minutes: 3,
      author: 'Ines Halvorsen, formulator',
      image: images.oil,
      excerpt: 'The slowest step in our studio is also the one we would never rush. A short note on patience, petals and golden oil.',
      body: [
        'Calendula is one of the oldest botanicals in skin care, and one of the most forgiving. Its petals are rich in soothing compounds that dissolve beautifully into oil, if you give them time.',
        'Every batch of our Facial Oil begins with hand-picked petals from a single farm. We steep them in cold-pressed jojoba for six weeks, away from heat and light, swirling the jars by hand twice a week.',
        'Heat would be faster. It would also dull the color, the scent and much of what makes calendula calming. Slow steeping keeps the oil a deep sun-gold and the petals’ benefits intact.',
        'After six weeks we strain, blend with rosehip and sea buckthorn, and bottle in small runs of 400. It is not efficient. It is, we think, the only way to do it properly.',
      ],
      productIds: ['calendula-facial-oil', 'the-discovery-set'],
    },
    {
      slug: 'a-field-guide-to-our-botanicals',
      title: 'A field guide to our five botanicals',
      category: 'Field notes',
      date: '2026-07-30',
      minutes: 5,
      author: 'Maren Ashby, founder',
      image: images.botanicals,
      excerpt: 'Olive leaf, kaolin clay, oat, calendula and fig: what each one does, where it grows and which formulas it lives in.',
      body: [
        'Olive leaf. Grown in our neighbors’ groves and pressed within a day of pruning. Rich in antioxidants that calm redness, it anchors the Olive Leaf Barrier Cream.',
        'Kaolin clay. The softest of the clays, it lifts away oil and impurities without leaving skin taut. A touch of it gives our cleanser its gentle slip.',
        'Oat. Finely milled colloidal oat has soothed itchy, reactive skin for centuries. We use it in the Oat Milk Cream Cleanser for comfort with every wash.',
        'Calendula. Steeped for six weeks in cold-pressed oils, its sun-gold petals restore softness and glow in our Calendula Facial Oil.',
        'Fig. Fig leaf extract helps even tone in the Renewal Serum, while fig fruit lends its softness to our Lip Balm. Five plants, nothing we can’t explain.',
      ],
      productIds: ['olive-leaf-barrier-cream', 'oat-milk-cream-cleanser', 'calendula-facial-oil', 'fig-leaf-renewal-serum'],
    },
  ],
}

/* ── Info pages (/pages/<slug>), linked from the footer ─────────────────── */
export const pages = [
  {
    slug: 'shipping-returns',
    title: 'Shipping & returns',
    intro: 'Everything you need to know about getting your order, and sending it back if it is not right.',
    sections: [
      {
        heading: 'Shipping',
        body: [
          'Orders ship from our studio within 1–2 business days. Standard shipping (3–5 business days) is free on orders over {freeShipping} and $6 below that. Express shipping (1–2 business days) is $18.',
          'Every order is packed in recycled paper with two complimentary samples chosen for your skin.',
        ],
      },
      {
        heading: 'Returns',
        body: [
          'Not quite right? Return any product within 30 days, even if opened, for a full refund. Email us with your order number and we will send a prepaid label.',
        ],
      },
    ],
  },
  {
    slug: 'faq',
    title: 'Frequently asked questions',
    intro: 'Answers to what we are asked most. Can’t find yours? Write to us any time.',
    faqs: [
      { q: 'Are your products suitable for sensitive skin?', a: 'Yes. Every formula is free of added fragrance and dermatologist-tested on sensitive skin. If you are unsure where to begin, start with the Discovery Set.' },
      { q: 'Is Fernlace vegan and cruelty-free?', a: 'All of our formulas are vegan, and we never test on animals at any stage, nor do our suppliers.' },
      { q: 'Can I use the serum during pregnancy?', a: 'Bakuchiol is generally considered a gentle alternative to retinol, but every pregnancy is different. Please check with your doctor before adding a new product.' },
      { q: 'How long do the products last once opened?', a: 'Twelve months for creams, serums and oils; eighteen months for the lip balm. Small batches mean every product reaches you fresh.' },
      { q: 'Do you offer refills?', a: 'Refill pouches for the Barrier Cream and Toning Mist are coming soon. Join our letters to hear first.' },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact us',
    intro: 'A real person answers every message, usually within one business day.',
    contact: true,
  },
]

/* ── Footer ─────────────────────────────────────────────────────────────── */
export const footer = {
  blurb: 'Botanical skincare, made in small batches in Larkhaven, California and bottled in glass.',
  columns: [
    {
      title: 'Shop',
      links: [
        { label: 'All products', href: '/shop' },
        { label: 'Bestsellers', href: '/shop?sort=bestselling' },
        { label: 'Sets & gifts', href: '/shop?category=sets' },
        { label: 'Discovery Set', href: '/products/the-discovery-set' },
      ],
    },
    {
      title: 'Help',
      links: [
        { label: 'Shipping & returns', href: '/pages/shipping-returns' },
        { label: 'FAQ', href: '/pages/faq' },
        { label: 'Contact', href: '/pages/contact' },
      ],
    },
    {
      title: 'Fernlace',
      links: [
        { label: 'Our ingredients', href: '/#ingredients' },
        { label: 'Journal', href: '/journal' },
        { label: 'The evening ritual', href: '/journal/the-five-minute-evening-ritual' },
      ],
    },
  ] satisfies { title: string; links: Link[] }[],
  socialTitle: 'Follow',
  contactTitle: 'Say hello',
  legal: '© {year} Fernlace. A fictional brand for a GenVibe store template.',
  demoNote: 'Demo store: no payments are taken and no orders ship.',
}

/** Shown if a page fails to render. */
export const errorPage = {
  eyebrow: 'Error',
  heading: 'Something went wrong on this page.',
  text: 'Please try again, or head back to the shop.',
}

export const notFound = {
  eyebrow: '404',
  heading: 'This page has *wandered off*.',
  text: 'The link may be old, or the page may have moved. Let’s get you back to the good stuff.',
  primary: { label: 'Shop the collection', href: '/shop' },
  secondary: { label: 'Back home', href: '/' },
}

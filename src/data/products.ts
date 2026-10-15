/* =============================================================================
 *  FERNLACE · PRODUCT CATALOG
 *  Every product, price, size, ingredient list and review. Images come from
 *  `images` in src/content.ts; categories and concerns are the ids defined in
 *  content.ts → shop.categories / shop.concerns.
 *
 *  • id         The URL slug: /products/<id>. Lowercase words and dashes only.
 *  • sizes      The first size is the default unless `defaultSize` says otherwise.
 *               `compareAt` shows a struck-through original price.
 *  • rating / reviewCount  The headline numbers. `reviews` are the ones shown.
 *  • Order      The order here is the "Featured" sort on the shop page.
 * ========================================================================== */

import { images, type CategoryId, type ConcernId, type Img } from '../content'

export type Size = { id: string; label: string; price: number; compareAt?: number }
export type Review = {
  id: string
  author: string
  avatar: Img
  location: string
  skinType: string
  rating: number
  /** ISO date, e.g. "2026-09-10". */
  date: string
  title: string
  body: string
}
export type Product = {
  id: string
  name: string
  tagline: string
  category: CategoryId
  concerns: ConcernId[]
  badge?: string
  sizes: Size[]
  defaultSize?: string
  rating: number
  reviewCount: number
  description: string
  highlights: string[]
  /** The first image is the card and thumbnail image. */
  images: Img[]
  keyIngredients: { name: string; benefit: string }[]
  howTo: string[]
  inci: string
  /** For sets: the ids of the products inside. */
  includes?: string[]
  /** "Complete the ritual" suggestions on the product page. */
  pairsWith: string[]
  reviews: Review[]
}

const [amara, daniel, lucia, graham, yasmin, rohan, niamh, marcus] = images.avatars

export const products: Product[] = [
  {
    id: 'fig-leaf-renewal-serum',
    name: 'Fig Leaf Renewal Serum',
    tagline: 'Overnight serum with bakuchiol',
    category: 'treat',
    concerns: ['fine-lines', 'dullness'],
    badge: 'Bestseller',
    sizes: [
      { id: '15ml', label: '15 ml', price: 42 },
      { id: '30ml', label: '30 ml', price: 68 },
    ],
    defaultSize: '30ml',
    rating: 4.8,
    reviewCount: 412,
    description:
      'A silky night serum that works while you sleep. Plant-derived bakuchiol and fig leaf extract smooth fine lines and refine texture without the sting of retinol, while olive squalane keeps skin calm and supple. Wake to a softer, more even glow.',
    highlights: ['Retinol alternative', 'Fragrance-free', 'Vegan'],
    images: [images.serum, images.hero, images.fig],
    keyIngredients: [
      { name: 'Bakuchiol 1%', benefit: 'A plant alternative to retinol that smooths fine lines without irritation.' },
      { name: 'Fig leaf extract', benefit: 'Antioxidants that brighten and even out tone.' },
      { name: 'Olive squalane', benefit: 'Weightless moisture that keeps skin supple.' },
    ],
    howTo: [
      'Use in the evening on clean, dry skin.',
      'Warm 3–4 drops between your fingertips and press into face and neck.',
      'Follow with Olive Leaf Barrier Cream. Wear SPF by day.',
    ],
    inci:
      'Aqua (Water), Squalane, Glycerin, Ficus Carica (Fig) Leaf Extract, Bakuchiol, Niacinamide, Sodium Hyaluronate, Calendula Officinalis Flower Extract, Tocopherol, Xanthan Gum, Sodium Levulinate, Glyceryl Caprylate, Citric Acid.',
    pairsWith: ['olive-leaf-barrier-cream', 'rose-petal-toning-mist', 'oat-milk-cream-cleanser'],
    reviews: [
      {
        id: 'r-serum-1',
        author: 'Lucía M.',
        avatar: lucia,
        location: 'Austin, TX',
        skinType: 'Mature, combination',
        rating: 5,
        date: '2026-09-02',
        title: 'Retinol results without the redness',
        body: 'I gave up on retinol after years of flaking. Six weeks into this serum the lines around my eyes are softer and my skin has never been calmer. Silky, and it sinks right in.',
      },
      {
        id: 'r-serum-2',
        author: 'Graham P.',
        avatar: graham,
        location: 'Portland, OR',
        skinType: 'Normal',
        rating: 5,
        date: '2026-08-14',
        title: 'My wife’s serum is now my serum',
        body: 'Bought it as a gift and kept borrowing it. Four drops at night, no smell, no sting, and my forehead looks noticeably smoother. I have ordered my own bottle.',
      },
      {
        id: 'r-serum-3',
        author: 'Yasmin H.',
        avatar: yasmin,
        location: 'Chicago, IL',
        skinType: 'Dry, sensitive',
        rating: 4,
        date: '2026-07-21',
        title: 'Gentle and glowy',
        body: 'A lovely glow in the mornings and zero irritation, which is rare for me. One star off only because I wish the 30 ml lasted longer.',
      },
    ],
  },
  {
    id: 'olive-leaf-barrier-cream',
    name: 'Olive Leaf Barrier Cream',
    tagline: 'Rich repair cream with ceramides',
    category: 'moisturize',
    concerns: ['dryness', 'sensitivity', 'fine-lines'],
    badge: 'Bestseller',
    sizes: [
      { id: '30ml', label: '30 ml', price: 38 },
      { id: '50ml', label: '50 ml', price: 58 },
    ],
    defaultSize: '50ml',
    rating: 4.9,
    reviewCount: 586,
    description:
      'Our most-loved moisturizer: a cushiony cream that rebuilds a stressed skin barrier overnight. Cold-pressed olive leaf extract calms redness while three ceramides and shea butter seal in moisture for the whole day.',
    highlights: ['Barrier repair', 'Fragrance-free', 'Vegan'],
    images: [images.cream, images.oliveLeaf],
    keyIngredients: [
      { name: 'Olive leaf extract', benefit: 'Calms redness and defends against daily stress.' },
      { name: 'Ceramide complex', benefit: 'Three skin-identical ceramides that restore the barrier.' },
      { name: 'Shea butter', benefit: 'Deep, lasting nourishment without a greasy finish.' },
    ],
    howTo: [
      'Use morning and night as the last step before SPF.',
      'Warm a pearl-sized amount between your palms.',
      'Press gently over face and neck until absorbed.',
    ],
    inci:
      'Aqua (Water), Olea Europaea (Olive) Fruit Oil, Butyrospermum Parkii (Shea) Butter, Glycerin, Cetearyl Alcohol, Olea Europaea (Olive) Leaf Extract, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Squalane, Avena Sativa (Oat) Kernel Extract, Tocopherol, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum, Sodium Benzoate, Potassium Sorbate.',
    pairsWith: ['fig-leaf-renewal-serum', 'calendula-facial-oil', 'oat-milk-cream-cleanser'],
    reviews: [
      {
        id: 'r-cream-1',
        author: 'Amara O.',
        avatar: amara,
        location: 'Brooklyn, NY',
        skinType: 'Dry, sensitive',
        rating: 5,
        date: '2026-09-10',
        title: 'Finally, a cream that fixed my barrier',
        body: 'Winter used to leave my cheeks raw and patchy. Two weeks of this morning and night and the tightness is gone. Rich but never greasy, and a jar lasts me two months.',
      },
      {
        id: 'r-cream-2',
        author: 'Rohan S.',
        avatar: rohan,
        location: 'Seattle, WA',
        skinType: 'Combination',
        rating: 5,
        date: '2026-08-03',
        title: 'Rich without the shine',
        body: 'I worried it would be too heavy for my T-zone, but it absorbs in a minute. Calm, comfortable skin all day, and the glass jar is beautiful.',
      },
      {
        id: 'r-cream-3',
        author: 'Niamh C.',
        avatar: niamh,
        location: 'Boston, MA',
        skinType: 'Sensitive, redness-prone',
        rating: 5,
        date: '2026-06-28',
        title: 'My redness has calmed right down',
        body: 'I react to almost everything. This is the first moisturizer in years that does not sting, and my cheeks are visibly less flushed.',
      },
    ],
  },
  {
    id: 'calendula-facial-oil',
    name: 'Calendula Facial Oil',
    tagline: 'Cold-steeped golden glow oil',
    category: 'treat',
    concerns: ['dryness', 'dullness', 'fine-lines'],
    badge: 'New',
    sizes: [{ id: '30ml', label: '30 ml', price: 54 }],
    rating: 4.8,
    reviewCount: 164,
    description:
      'Sun-gold calendula petals steeped for six weeks in cold-pressed jojoba, then blended with rosehip and sea buckthorn. Light and fast-absorbing, it restores softness and a lit-from-within glow, especially to dry winter skin.',
    highlights: ['Cold-steeped', 'Non-comedogenic', '100% natural origin'],
    images: [images.oil, images.calendula],
    keyIngredients: [
      { name: 'Calendula infusion', benefit: 'Soothes and restores softness to dry, tired skin.' },
      { name: 'Rosehip seed oil', benefit: 'Essential fatty acids and vitamin A for glow.' },
      { name: 'Sea buckthorn', benefit: 'A vivid antioxidant that brightens dull skin.' },
    ],
    howTo: [
      'Use 2–3 drops after serum, morning or night.',
      'Press into skin with flat palms.',
      'Or add a drop to your moisturizer for extra comfort.',
    ],
    inci:
      'Simmondsia Chinensis (Jojoba) Seed Oil, Rosa Canina (Rosehip) Seed Oil, Calendula Officinalis Flower Extract, Squalane, Prunus Armeniaca (Apricot) Kernel Oil, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil, Tocopherol.',
    pairsWith: ['olive-leaf-barrier-cream', 'fig-leaf-renewal-serum', 'rose-petal-toning-mist'],
    reviews: [
      {
        id: 'r-oil-1',
        author: 'Yasmin H.',
        avatar: yasmin,
        location: 'Chicago, IL',
        skinType: 'Dry',
        rating: 5,
        date: '2026-09-14',
        title: 'Liquid gold, honestly',
        body: 'Two drops over my moisturizer and I wake up glowing. It absorbs fast and has never broken me out. The color alone makes me happy.',
      },
      {
        id: 'r-oil-2',
        author: 'Rohan S.',
        avatar: rohan,
        location: 'Seattle, WA',
        skinType: 'Normal to dry',
        rating: 5,
        date: '2026-08-22',
        title: 'My winter essential',
        body: 'My skin gets dull and flaky in the colder months. This brought back the softness within a week, and a little goes a long way.',
      },
      {
        id: 'r-oil-3',
        author: 'Lucía M.',
        avatar: lucia,
        location: 'Austin, TX',
        skinType: 'Mature',
        rating: 4,
        date: '2026-07-09',
        title: 'Beautiful glow',
        body: 'A lovely oil with a soft natural scent from the calendula. I use it at night only; it is a touch too rich under my makeup.',
      },
    ],
  },
  {
    id: 'the-evening-ritual',
    name: 'The Evening Ritual',
    tagline: 'Cleanser, serum and cream in a linen pouch',
    category: 'sets',
    concerns: ['fine-lines', 'dryness', 'dullness'],
    badge: 'Save $26',
    sizes: [{ id: 'set', label: 'Set of 3, full size', price: 128, compareAt: 154 }],
    rating: 4.9,
    reviewCount: 128,
    description:
      'Our founder’s five-minute wind-down in one set: Oat Milk Cream Cleanser, Fig Leaf Renewal Serum and Olive Leaf Barrier Cream, all full size and wrapped in a reusable linen pouch. The easiest way to start a ritual, or to give one.',
    highlights: ['Full sizes', 'Reusable linen pouch', 'Gift-ready'],
    images: [images.hero, images.cleanser, images.serum, images.cream],
    keyIngredients: [
      { name: 'Colloidal oat', benefit: 'Cleanses gently and soothes as you wash.' },
      { name: 'Bakuchiol', benefit: 'Smooths fine lines overnight, without irritation.' },
      { name: 'Olive leaf & ceramides', benefit: 'Seal in moisture and calm the skin barrier.' },
    ],
    howTo: [
      'Massage the cleanser onto damp skin, then rinse.',
      'Press four drops of serum into face and neck.',
      'Seal with a pearl of cream. Wear SPF by day.',
    ],
    inci: 'See each product’s page for its full ingredient list.',
    includes: ['oat-milk-cream-cleanser', 'fig-leaf-renewal-serum', 'olive-leaf-barrier-cream'],
    pairsWith: ['calendula-facial-oil', 'rose-petal-toning-mist', 'fig-butter-lip-balm'],
    reviews: [
      {
        id: 'r-ritual-1',
        author: 'Graham P.',
        avatar: graham,
        location: 'Portland, OR',
        skinType: 'Normal',
        rating: 5,
        date: '2026-09-12',
        title: 'Took the guesswork out',
        body: 'I had no routine at all. This set gave me three steps that take five minutes, and my skin has honestly never looked better. Great value too.',
      },
      {
        id: 'r-ritual-2',
        author: 'Yasmin H.',
        avatar: yasmin,
        location: 'Chicago, IL',
        skinType: 'Dry, sensitive',
        rating: 5,
        date: '2026-08-25',
        title: 'The perfect gift',
        body: 'Bought it for my sister’s birthday. The linen pouch is lovely and she has already reordered the serum.',
      },
    ],
  },
  {
    id: 'oat-milk-cream-cleanser',
    name: 'Oat Milk Cream Cleanser',
    tagline: 'Gentle, low-foam daily cleanser',
    category: 'cleanse',
    concerns: ['sensitivity', 'dryness'],
    sizes: [
      { id: '100ml', label: '100 ml', price: 28 },
      { id: '200ml', label: '200 ml', price: 42 },
    ],
    rating: 4.7,
    reviewCount: 298,
    description:
      'A soft, milky cleanser that lifts away sunscreen, makeup and the day without stripping. Colloidal oat, kaolin and calendula soothe as you cleanse, leaving skin comfortable and never tight.',
    highlights: ['pH 5.5', 'Soap-free', 'Fragrance-free'],
    images: [images.cleanser, images.oat],
    keyIngredients: [
      { name: 'Colloidal oat', benefit: 'Soothes itch and redness with every wash.' },
      { name: 'Kaolin clay', benefit: 'Lifts excess oil and impurities without stripping.' },
      { name: 'Calendula', benefit: 'Calms and comforts reactive skin.' },
    ],
    howTo: [
      'Massage a coin-sized amount onto damp skin, morning and night.',
      'Work in gentle circles for thirty seconds.',
      'Rinse with lukewarm water and pat dry.',
    ],
    inci:
      'Aqua (Water), Glycerin, Coco-Glucoside, Avena Sativa (Oat) Kernel Flour, Kaolin, Cetearyl Alcohol, Calendula Officinalis Flower Extract, Helianthus Annuus (Sunflower) Seed Oil, Sodium Cocoyl Glutamate, Panthenol, Allantoin, Xanthan Gum, Citric Acid, Sodium Benzoate.',
    pairsWith: ['rose-petal-toning-mist', 'fig-leaf-renewal-serum', 'olive-leaf-barrier-cream'],
    reviews: [
      {
        id: 'r-cleanser-1',
        author: 'Daniel K.',
        avatar: daniel,
        location: 'San Diego, CA',
        skinType: 'Oily',
        rating: 5,
        date: '2026-09-06',
        title: 'Clean but never tight',
        body: 'I assumed a cream cleanser would leave my oily skin greasy. It doesn’t. Sunscreen comes off easily and my skin feels balanced, not stripped.',
      },
      {
        id: 'r-cleanser-2',
        author: 'Marcus T.',
        avatar: marcus,
        location: 'Atlanta, GA',
        skinType: 'Dry',
        rating: 4,
        date: '2026-08-19',
        title: 'Soft, simple, works',
        body: 'Does exactly what it should and is gentle enough for twice a day. I would love a pump bottle, but the tube is great for travel.',
      },
      {
        id: 'r-cleanser-3',
        author: 'Niamh C.',
        avatar: niamh,
        location: 'Boston, MA',
        skinType: 'Sensitive',
        rating: 5,
        date: '2026-07-12',
        title: 'The calmest wash I have used',
        body: 'No fragrance, no foam, no drama. My skin feels comfortable straight after rinsing. A forever product.',
      },
    ],
  },
  {
    id: 'rose-petal-toning-mist',
    name: 'Rose Petal Toning Mist',
    tagline: 'Hydrating mist with rose water',
    category: 'tone',
    concerns: ['dullness', 'sensitivity'],
    sizes: [
      { id: '100ml', label: '100 ml', price: 32 },
      { id: '200ml', label: '200 ml', price: 48 },
    ],
    rating: 4.7,
    reviewCount: 231,
    description:
      'A fine, cooling veil of steam-distilled damask rose water, hyaluronic acid and a touch of niacinamide. Mist after cleansing to rebalance, prep and plump, or any time your skin needs a moment.',
    highlights: ['Alcohol-free', 'No added fragrance', 'Vegan'],
    images: [images.toner, images.botanicals],
    keyIngredients: [
      { name: 'Damask rose water', benefit: 'Tones and soothes with a whisper of natural scent.' },
      { name: 'Hyaluronic acid', benefit: 'Draws moisture into the skin for a plump finish.' },
      { name: 'Niacinamide 2%', benefit: 'Refines the look of pores and evens tone.' },
    ],
    howTo: [
      'Hold 20 cm from your face, eyes closed.',
      'Mist 3–4 times after cleansing.',
      'Press in, then apply serum while skin is still damp.',
    ],
    inci:
      'Rosa Damascena Flower Water, Glycerin, Niacinamide, Sodium Hyaluronate, Aloe Barbadensis Leaf Juice, Panthenol, Betaine, Allantoin, Sodium Levulinate, Sodium Anisate, Citric Acid.',
    pairsWith: ['oat-milk-cream-cleanser', 'fig-leaf-renewal-serum', 'calendula-facial-oil'],
    reviews: [
      {
        id: 'r-mist-1',
        author: 'Niamh C.',
        avatar: niamh,
        location: 'Boston, MA',
        skinType: 'Combination',
        rating: 5,
        date: '2026-09-01',
        title: 'A pause button in a bottle',
        body: 'I keep one on my desk and mist through the afternoon. My skin looks fresher and makeup sits better. The spray is beautifully fine.',
      },
      {
        id: 'r-mist-2',
        author: 'Daniel K.',
        avatar: daniel,
        location: 'San Diego, CA',
        skinType: 'Oily',
        rating: 4,
        date: '2026-08-11',
        title: 'Light and refreshing',
        body: 'Great after the gym and never sticky. I wish the rose scent were a little stronger, but I know it is all natural.',
      },
      {
        id: 'r-mist-3',
        author: 'Amara O.',
        avatar: amara,
        location: 'Brooklyn, NY',
        skinType: 'Dry',
        rating: 5,
        date: '2026-06-30',
        title: 'Plumps right up',
        body: 'Misting before my serum made a bigger difference than I expected. My skin looks bouncy and hydrated all day.',
      },
    ],
  },
  {
    id: 'fig-butter-lip-balm',
    name: 'Fig Butter Lip Balm',
    tagline: 'Nourishing balm in a refillable brass tin',
    category: 'lips',
    concerns: ['dryness'],
    sizes: [
      { id: 'single', label: 'Single', price: 18 },
      { id: 'duo', label: 'Duo', price: 32, compareAt: 36 },
    ],
    rating: 4.9,
    reviewCount: 377,
    description:
      'A buttery balm of fig, shea and candelilla wax that melts on contact and stays put for hours. Lightly flavored with fig and nothing else. Use it on lips, cuticles and any dry patch that needs it.',
    highlights: ['Refillable tin', 'Vegan', 'Multi-use'],
    images: [images.balm, images.fig],
    keyIngredients: [
      { name: 'Fig fruit extract', benefit: 'Antioxidant-rich softness for dry lips.' },
      { name: 'Shea & cocoa butter', benefit: 'Deep, melting nourishment that lasts.' },
      { name: 'Candelilla wax', benefit: 'A plant wax that protects against wind and cold.' },
    ],
    howTo: [
      'Warm the balm with a fingertip.',
      'Smooth over lips as often as you like.',
      'At night, apply a thicker layer as a lip mask.',
    ],
    inci:
      'Butyrospermum Parkii (Shea) Butter, Ricinus Communis (Castor) Seed Oil, Euphorbia Cerifera (Candelilla) Wax, Olea Europaea (Olive) Fruit Oil, Theobroma Cacao (Cocoa) Seed Butter, Ficus Carica (Fig) Fruit Extract, Tocopherol, Aroma (Natural Flavor).',
    pairsWith: ['olive-leaf-barrier-cream', 'calendula-facial-oil', 'the-discovery-set'],
    reviews: [
      {
        id: 'r-balm-1',
        author: 'Marcus T.',
        avatar: marcus,
        location: 'Atlanta, GA',
        skinType: 'Dry lips',
        rating: 5,
        date: '2026-09-08',
        title: 'The only balm I never lose',
        body: 'The brass tin is so nice I actually keep track of it. It melts on contact, lasts for hours and the fig is subtle. I bought the duo to share.',
      },
      {
        id: 'r-balm-2',
        author: 'Daniel K.',
        avatar: daniel,
        location: 'San Diego, CA',
        skinType: 'Normal',
        rating: 5,
        date: '2026-08-02',
        title: 'Overnight lip mask',
        body: 'A thick layer before bed and my lips are soft by morning. Also brilliant on cuticles.',
      },
      {
        id: 'r-balm-3',
        author: 'Amara O.',
        avatar: amara,
        location: 'Brooklyn, NY',
        skinType: 'Dry',
        rating: 5,
        date: '2026-07-18',
        title: 'Gift-worthy',
        body: 'I gave these to my whole team for the holidays. Everyone asked where they were from.',
      },
    ],
  },
  {
    id: 'the-discovery-set',
    name: 'The Discovery Set',
    tagline: 'Six travel minis to find your ritual',
    category: 'sets',
    concerns: ['sensitivity', 'dryness'],
    badge: 'Gift',
    sizes: [{ id: 'minis', label: '6 minis, 10 ml each', price: 46 }],
    rating: 4.8,
    reviewCount: 96,
    description:
      'All six essentials in 10 ml travel sizes, enough for two weeks of exploring: cleanser, mist, serum, oil, cream and a mini balm. Each set includes a $15 credit toward your first full-size order.',
    highlights: ['Travel-friendly', 'Two-week trial', '$15 credit inside'],
    images: [images.botanicals, images.toner, images.balm, images.oil],
    keyIngredients: [
      { name: 'Five botanicals', benefit: 'Olive leaf, kaolin, oat, calendula and fig, in one set.' },
      { name: 'Two-week trial', benefit: 'Enough of each formula to see how your skin responds.' },
      { name: '$15 credit', benefit: 'Put toward any full size once you find your favorites.' },
    ],
    howTo: [
      'Cleanse and mist, morning and night.',
      'Add serum at night and oil whenever skin feels dry.',
      'Finish with cream, and keep the balm in your pocket.',
    ],
    inci: 'See each product’s page for its full ingredient list.',
    includes: [
      'oat-milk-cream-cleanser',
      'rose-petal-toning-mist',
      'fig-leaf-renewal-serum',
      'calendula-facial-oil',
      'olive-leaf-barrier-cream',
      'fig-butter-lip-balm',
    ],
    pairsWith: ['the-evening-ritual', 'fig-butter-lip-balm', 'olive-leaf-barrier-cream'],
    reviews: [
      {
        id: 'r-discovery-1',
        author: 'Rohan S.',
        avatar: rohan,
        location: 'Seattle, WA',
        skinType: 'Combination',
        rating: 5,
        date: '2026-09-05',
        title: 'The best way to start',
        body: 'Tried everything for two weeks and found my favorites, the cream and the oil. The credit made the full sizes an easy decision.',
      },
      {
        id: 'r-discovery-2',
        author: 'Niamh C.',
        avatar: niamh,
        location: 'Boston, MA',
        skinType: 'Sensitive',
        rating: 4,
        date: '2026-07-27',
        title: 'Lovely minis',
        body: 'Perfect for travel. The serum mini ran out first, which tells you everything.',
      },
    ],
  },
]

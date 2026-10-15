import { Bestsellers } from '../components/home/Bestsellers'
import { Concerns } from '../components/home/Concerns'
import { Hero } from '../components/home/Hero'
import { IngredientStory } from '../components/home/IngredientStory'
import { JournalTeaser } from '../components/home/JournalTeaser'
import { Newsletter } from '../components/home/Newsletter'
import { Promises } from '../components/home/Promises'
import { ReviewsSection } from '../components/home/ReviewsSection'
import { usePageMeta } from '../lib/site'

/** Home page: section order. Each section reads its copy from src/content.ts → home. */
export function HomePage() {
  usePageMeta({})
  return (
    <>
      <Hero />
      <Promises />
      <Bestsellers />
      <Concerns />
      <IngredientStory />
      <ReviewsSection />
      <JournalTeaser />
      <Newsletter />
    </>
  )
}

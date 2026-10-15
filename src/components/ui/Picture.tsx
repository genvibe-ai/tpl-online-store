import { motion } from 'motion/react'
import type { Img } from '../../content'
import { cn } from '../../lib/format'
import { EASE } from './Reveal'

type PictureProps = {
  image: Img
  className?: string
  /** Fade and settle (scale 1.08 → 1) the first time it scrolls into view. */
  reveal?: boolean
  /** Slow zoom on hover of the closest `group` parent. */
  hoverZoom?: boolean
  /** Above-the-fold images: load eagerly with high priority. */
  priority?: boolean
  /** Override the alt text (use "" for decorative copies). */
  alt?: string
  sizes?: string
}

/**
 * An image that fills its box (give the box an aspect ratio), honoring the image's
 * `focus` (object-position) and `zoom` from content.ts.
 */
export function Picture({ image, className, reveal = true, hoverZoom = false, priority = false, alt, sizes }: PictureProps) {
  const zoom = image.zoom ?? 1
  const img = (
    <img
      src={image.src}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      draggable={false}
      className="size-full object-cover"
      style={{
        objectPosition: image.focus,
        transform: zoom !== 1 ? `scale(${zoom})` : undefined,
        transformOrigin: image.focus,
      }}
    />
  )
  const zoomed = hoverZoom ? (
    <div className="size-full transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.045]">{img}</div>
  ) : (
    img
  )

  return (
    <div className={cn('overflow-hidden bg-surface', className)}>
      {reveal ? (
        <motion.div
          className="size-full"
          initial={{ opacity: 0, scale: 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -4% 0px' }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: 1.5, ease: EASE } }}
        >
          {zoomed}
        </motion.div>
      ) : (
        zoomed
      )}
    </div>
  )
}

import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { useParams } from 'react-router'
import { AccordionItem } from '../components/ui/Accordion'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Reveal } from '../components/ui/Reveal'
import { contact, pages } from '../content'
import { fill } from '../lib/format'
import { usePageMeta } from '../lib/site'
import { NotFoundPage } from './NotFound'

/** /pages/:slug — simple content pages (shipping & returns, FAQ, contact) from content.ts → pages. */
export function InfoPage() {
  const { slug } = useParams()
  const page = pages.find((p) => p.slug === slug)
  usePageMeta({ title: page?.title, description: page?.intro })
  if (!page) return <NotFoundPage />

  return (
    <div className="container-page max-w-3xl pb-24 pt-8 md:pb-32 md:pt-12">
      <Breadcrumbs items={[{ label: page.title }]} />
      <Reveal className="mt-8 md:mt-10">
        <h1 className="display-lg">{page.title}</h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{page.intro}</p>
      </Reveal>

      {'sections' in page &&
        page.sections?.map((section) => (
          <Reveal key={section.heading} className="mt-12 border-t border-foreground/10 pt-10">
            <h2 className="font-display text-[1.75rem] leading-tight">{section.heading}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-foreground/85">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{fill(paragraph)}</p>
              ))}
            </div>
          </Reveal>
        ))}

      {'faqs' in page && page.faqs && (
        <Reveal className="mt-12 border-t border-foreground/12">
          {page.faqs.map((faq, i) => (
            <AccordionItem key={faq.q} title={faq.q} defaultOpen={i === 0}>
              <p>{faq.a}</p>
            </AccordionItem>
          ))}
        </Reveal>
      )}

      {'contact' in page && page.contact && (
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2">
          {[
            { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
            { icon: Phone, label: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
            { icon: MapPin, label: contact.address },
            { icon: Clock, label: contact.hours },
          ].map(({ icon: IconComponent, label, href }) => (
            <div key={label} className="flex items-center gap-4 rounded-md bg-surface p-5">
              <IconComponent aria-hidden="true" className="size-5 shrink-0 text-secondary" strokeWidth={1.5} />
              {href ? (
                <a href={href} className="link-draw break-all">
                  {label}
                </a>
              ) : (
                <span>{label}</span>
              )}
            </div>
          ))}
        </Reveal>
      )}
    </div>
  )
}

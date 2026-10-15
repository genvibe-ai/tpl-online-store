import { Accent } from '../components/ui/Accent'
import { ButtonLink } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { notFound } from '../content'
import { plain } from '../lib/format'
import { usePageMeta } from '../lib/site'

export function NotFoundPage() {
  usePageMeta({ title: plain(notFound.heading) })
  return (
    <section className="container-page py-28 text-center md:py-44">
      <Reveal>
        <p className="eyebrow text-secondary">{notFound.eyebrow}</p>
        <h1 className="display-lg mx-auto mt-5 max-w-2xl">
          <Accent text={notFound.heading} />
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">{notFound.text}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink to={notFound.primary.href} arrow>
            {notFound.primary.label}
          </ButtonLink>
          <ButtonLink to={notFound.secondary.href} variant="outline">
            {notFound.secondary.label}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}

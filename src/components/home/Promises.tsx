import { home } from '../../content'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/** Four brand promises under the hero. */
export function Promises() {
  return (
    <section aria-label={home.promisesLabel} className="border-b border-foreground/10">
      <ul className="container-page grid grid-cols-2 gap-x-5 gap-y-9 py-11 md:py-14 lg:grid-cols-4 lg:gap-x-10">
        {home.promises.map((promise, i) => (
          <li key={promise.title}>
            <Reveal delay={i * 0.07} className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-secondary">
                <Icon name={promise.icon} className="size-5" />
              </span>
              <span>
                <span className="block font-display text-[1.12rem] leading-snug">{promise.title}</span>
                <span className="mt-1.5 block text-[0.88rem] leading-relaxed text-muted">{promise.text}</span>
              </span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}

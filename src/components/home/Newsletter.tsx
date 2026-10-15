import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { home } from '../../content'
import { DrawCheck } from '../product/AddStateLabel'
import { Accent } from '../ui/Accent'
import { Button } from '../ui/Button'
import { EASE, Reveal } from '../ui/Reveal'

/** Email sign-up on terracotta. Front-end only: shows a thank-you (connect a mailing tool later). */
export function Newsletter() {
  const n = home.newsletter
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setDone(true)
  }

  return (
    <section aria-labelledby="newsletter-title" className="on-accent bg-accent text-accent-foreground">
      <div className="container-page grid items-center gap-10 py-20 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow">{n.eyebrow}</p>
          <h2 id="newsletter-title" className="display-lg mt-4">
            <Accent text={n.heading} />
          </h2>
          <p className="mt-5 max-w-md leading-relaxed">{n.text}</p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.p
                key="done"
                role="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex items-start gap-3 font-display text-[1.35rem] leading-snug"
              >
                <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-background text-accent">
                  <DrawCheck />
                </span>
                {n.success}
              </motion.p>
            ) : (
              <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  {n.label}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={n.placeholder}
                  className="h-14 w-full min-w-0 rounded-full bg-background px-6 sm:w-auto sm:flex-1 text-foreground placeholder:text-foreground/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
                />
                <Button type="submit" variant="dark" size="lg" className="focus-visible:outline-background">
                  {n.button}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
          <p className="mt-4 text-sm">{n.legal}</p>
        </Reveal>
      </div>
    </section>
  )
}

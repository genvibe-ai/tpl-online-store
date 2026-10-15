import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { errorPage, notFound } from '../content'
import { buttonClasses } from '../components/ui/Button'

/** Shown if a page crashes while rendering (keeps the visitor on-brand instead of a blank screen). */
export function RouteError() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)
  const status = isRouteErrorResponse(error) ? error.status : undefined
  return (
    <main className="grid min-h-svh place-items-center bg-background px-6 text-center text-foreground">
      <div>
        <p className="eyebrow text-secondary">{status ?? errorPage.eyebrow}</p>
        <h1 className="display-md mt-4">{errorPage.heading}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">{errorPage.text}</p>
        <Link to={notFound.primary.href} className={buttonClasses('primary', 'md', 'mt-8')}>
          {notFound.primary.label}
        </Link>
      </div>
    </main>
  )
}

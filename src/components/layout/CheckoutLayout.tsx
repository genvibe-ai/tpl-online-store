import { ArrowLeft, Lock } from 'lucide-react'
import { Link, Outlet, ScrollRestoration } from 'react-router'
import { checkout, footer, site, ui } from '../../content'
import { fill } from '../../lib/format'
import { Wordmark } from '../ui/Wordmark'
import { Toaster } from './Toaster'

/** Checkout and confirmation: a quiet header with no navigation, so nothing distracts from paying. */
export function CheckoutLayout() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <header className="border-b border-foreground/10 bg-background">
        <div className="container-page grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-3">
          <Link to="/shop" className="group inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">{ui.continueShopping}</span>
          </Link>
          <Link to="/" aria-label={`${site.name}, ${ui.home}`} className="px-2 py-2 transition-opacity hover:opacity-75">
            <Wordmark className="text-[1.15rem] sm:text-[1.35rem]" />
          </Link>
          <p className="flex items-center justify-end gap-2 text-sm text-muted">
            <Lock aria-hidden="true" className="size-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">{checkout.secure}</span>
          </p>
        </div>
      </header>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-foreground/10">
        <div className="container-page flex flex-col gap-1 py-6 text-[0.8rem] text-muted md:flex-row md:justify-between">
          <p>{fill(footer.legal)}</p>
          <p>{footer.demoNote}</p>
        </div>
      </footer>
      <Toaster />
      <ScrollRestoration />
    </div>
  )
}

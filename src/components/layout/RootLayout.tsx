import { motion } from 'motion/react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { ui } from '../../content'
import { AnnouncementBar } from './AnnouncementBar'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { Toaster } from './Toaster'

/** Store pages: announcement bar, sticky header, page, footer, plus the bag drawer and toasts. */
export function RootLayout() {
  const location = useLocation()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:text-background"
      >
        {ui.skipToContent}
      </a>
      <div className="flex min-h-svh flex-col overflow-x-clip">
        <AnnouncementBar />
        <Header />
        <motion.main
          id="main"
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
      <CartDrawer />
      <Toaster />
      <ScrollRestoration />
    </>
  )
}

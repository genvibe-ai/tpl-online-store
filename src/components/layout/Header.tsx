import { ChevronDown, Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { nav, site, ui } from '../../content'
import { cn, fill } from '../../lib/format'
import { useScrolledPast } from '../../lib/hooks'
import { IconButton } from '../ui/IconButton'
import { Wordmark } from '../ui/Wordmark'
import { BagButton } from './BagButton'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'
import { ShopMenu } from './ShopMenu'

const linkClass = 'relative py-2 text-[0.78rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300'

/** Sticky header: nav (left), wordmark (center), search + bag (right). */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const scrolled = useScrolledPast(4)
  const location = useLocation()

  // Close every menu after navigating.
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setShopOpen(false)
  }, [location.pathname, location.search, location.hash])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl transition-[border-color,box-shadow] duration-500',
          scrolled || shopOpen ? 'border-foreground/10' : 'border-transparent',
        )}
        onMouseLeave={() => setShopOpen(false)}
      >
        <div className="container-page grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-0.5">
            <IconButton label={ui.openMenu} className="-ml-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-haspopup="dialog">
              <Menu aria-hidden="true" className="size-5" strokeWidth={1.5} />
            </IconButton>
            <IconButton label={ui.search} className="lg:hidden" onClick={() => setSearchOpen(true)} aria-haspopup="dialog">
              <Search aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.5} />
            </IconButton>

            <nav aria-label={ui.mainNav} className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {nav.links.map((link) =>
                  link.menu ? (
                    <li key={link.href} className="flex items-center gap-1" onMouseEnter={() => setShopOpen(true)}>
                      <NavLink
                        to={link.href}
                        end
                        className={({ isActive }) => cn(linkClass, 'nav-underline', isActive || shopOpen ? 'text-foreground is-active' : 'text-foreground/70 hover:text-foreground')}
                      >
                        {link.label}
                      </NavLink>
                      <button
                        type="button"
                        aria-expanded={shopOpen}
                        aria-controls="shop-menu"
                        aria-label={fill(ui.submenu, { label: link.label })}
                        onClick={() => setShopOpen((open) => !open)}
                        className="grid size-6 place-items-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                      >
                        <ChevronDown aria-hidden="true" className={cn('size-3.5 transition-transform duration-300', shopOpen && 'rotate-180')} />
                      </button>
                    </li>
                  ) : (
                    <li key={link.href} onMouseEnter={() => setShopOpen(false)}>
                      <NavLink
                        to={link.href}
                        className={({ isActive }) =>
                          cn(linkClass, 'nav-underline', isActive && !link.href.includes('#') && !link.href.includes('?') ? 'text-foreground is-active' : 'text-foreground/70 hover:text-foreground')
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </div>

          <Link to="/" aria-label={`${site.name}, ${ui.home}`} className="justify-self-center px-2 py-2 transition-opacity hover:opacity-75">
            <Wordmark className="text-[1.15rem] sm:text-[1.3rem] lg:text-[1.45rem]" />
          </Link>

          <div className="flex items-center justify-end gap-1">
            <IconButton label={ui.search} className="hidden lg:grid" onClick={() => setSearchOpen(true)} aria-haspopup="dialog">
              <Search aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.5} />
            </IconButton>
            <BagButton />
          </div>
        </div>

        <ShopMenu open={shopOpen} id="shop-menu" />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

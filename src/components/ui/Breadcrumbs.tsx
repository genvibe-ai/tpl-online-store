import { Link } from 'react-router'
import { ui } from '../../content'
import { cn } from '../../lib/format'

/** Home / Shop / Treat / Product. The last item is the current page. */
export function Breadcrumbs({ items, className }: { items: Array<{ label: string; href?: string }>; className?: string }) {
  const all = [{ label: ui.home, href: '/' }, ...items]
  return (
    <nav aria-label={ui.breadcrumb} className={cn('text-[0.8rem] text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-foreground/25">/</span>}
            {item.href && i < all.length - 1 ? (
              <Link to={item.href} className="link-draw transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? 'page' : undefined} className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

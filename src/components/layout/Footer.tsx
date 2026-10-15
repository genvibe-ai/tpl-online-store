import { Link } from 'react-router'
import { contact, footer, site } from '../../content'
import { fill } from '../../lib/format'
import { Wordmark } from '../ui/Wordmark'

const linkClass = 'link-draw text-background/75 transition-colors duration-300 hover:text-background'

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-foreground text-background">
      <div className="container-page grid gap-14 pb-12 pt-20 md:pt-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Link to="/" aria-label={site.name} className="inline-block transition-opacity hover:opacity-80">
            <Wordmark className="text-[1.6rem]" />
          </Link>
          <p className="mt-6 max-w-xs leading-relaxed text-background/70">{footer.blurb}</p>
          <div className="mt-8 space-y-1.5 text-[0.95rem]">
            <p className="eyebrow mb-3 text-background/55">{footer.contactTitle}</p>
            <a href={`mailto:${contact.email}`} className={`${linkClass} block w-fit`}>
              {contact.email}
            </a>
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className={`${linkClass} block w-fit`}>
              {contact.phone}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:col-span-8">
          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="eyebrow text-background/55">{column.title}</p>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="eyebrow text-background/55">{footer.socialTitle}</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {contact.socials.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page" aria-hidden="true">
        <p className="select-none text-center font-display text-[clamp(4.5rem,19vw,17rem)] font-light leading-[0.78] tracking-[-0.03em] text-background/[0.07]">
          {site.name}
        </p>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-background/12 py-6 text-[0.8rem] text-background/60 md:flex-row md:justify-between">
        <p>{fill(footer.legal)}</p>
        <p>{footer.demoNote}</p>
      </div>
    </footer>
  )
}

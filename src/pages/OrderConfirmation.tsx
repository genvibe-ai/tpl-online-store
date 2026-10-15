import { motion } from 'motion/react'
import { useParams } from 'react-router'
import { Accent } from '../components/ui/Accent'
import { ButtonLink } from '../components/ui/Button'
import { Picture } from '../components/ui/Picture'
import { EASE, Reveal } from '../components/ui/Reveal'
import { checkout, confirmation, ui } from '../content'
import { fill, formatMoney } from '../lib/format'
import { usePageMeta } from '../lib/site'
import { useCart } from '../store/cart'

/** /order/:orderId — reads the demo order saved in this browser. */
export function OrderConfirmationPage() {
  const { orderId } = useParams()
  const order = useCart((state) => state.orders.find((o) => o.id === orderId))
  usePageMeta({ title: order ? fill(confirmation.eyebrow, { id: order.id }) : confirmation.notFound.heading })

  if (!order) {
    return (
      <section className="container-page py-28 text-center md:py-40">
        <h1 className="display-md mx-auto max-w-xl">{confirmation.notFound.heading}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">{confirmation.notFound.text}</p>
        <ButtonLink to="/shop" className="mt-8" arrow>
          {confirmation.notFound.cta}
        </ButtonLink>
      </section>
    )
  }

  const { shipTo } = order
  const cards = [
    { title: confirmation.arriving, lines: [order.delivery.window, `${order.delivery.label} · ${order.delivery.detail}`] },
    {
      title: confirmation.shipTo,
      lines: [
        `${shipTo.firstName} ${shipTo.lastName}`,
        [shipTo.address, shipTo.apartment].filter(Boolean).join(', '),
        `${shipTo.city}, ${shipTo.state} ${shipTo.zip}`,
        shipTo.country,
      ],
    },
    { title: confirmation.payment, lines: [fill(confirmation.paymentValue, { last4: order.cardLast4 }), order.email] },
  ]

  return (
    <div className="container-page max-w-5xl pb-24 pt-14 md:pb-32 md:pt-20">
      <div className="text-center">
        <AnimatedSeal />
        <motion.p
          className="eyebrow mt-8 text-secondary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          {fill(confirmation.eyebrow, { id: order.id })}
        </motion.p>
        <motion.h1
          className="display-lg mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
        >
          <Accent text={fill(confirmation.heading, { name: shipTo.firstName })} />
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-xl leading-relaxed text-muted"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
        >
          {fill(confirmation.text, { email: order.email })}
        </motion.p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={0.85 + i * 0.08} className="rounded-md border border-foreground/10 bg-card p-6">
            <p className="eyebrow text-secondary">{card.title}</p>
            <div className="mt-3 space-y-1 text-[0.95rem]">
              {card.lines.filter(Boolean).map((line, j) => (
                <p key={`${line}-${j}`} className={j === 0 ? 'font-display text-[1.15rem] leading-snug' : 'text-muted'}>
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={1.1} className="mt-6 rounded-md bg-surface p-6 md:p-8">
        <h2 className="font-display text-[1.5rem]">{confirmation.items}</h2>
        <ul className="mt-6 divide-y divide-foreground/10">
          {order.lines.map((line) => (
            <li key={`${line.productId}-${line.sizeLabel}`} className="flex items-center gap-4 py-4 first:pt-0">
              <Picture image={line.image} alt="" reveal={false} className="size-16 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[1.05rem] leading-snug">{line.name}</p>
                <p className="text-sm text-muted">
                  {line.sizeLabel} · {ui.qty} {line.qty}
                </p>
              </div>
              <p className="text-sm tabular-nums">{formatMoney(line.price * line.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-foreground/10 pt-5 text-[0.95rem]">
          <SummaryRow label={ui.subtotal} value={formatMoney(order.subtotal)} />
          {order.discount > 0 && <SummaryRow label={`${checkout.discountRow} (${order.discountCode})`} value={`−${formatMoney(order.discount)}`} />}
          <SummaryRow label={checkout.shipping} value={order.shipping === 0 ? checkout.free : formatMoney(order.shipping)} />
          {order.tax > 0 && <SummaryRow label={checkout.tax} value={formatMoney(order.tax)} />}
          <div className="flex items-baseline justify-between border-t border-foreground/10 pt-4">
            <dt className="font-medium">{checkout.total}</dt>
            <dd className="font-display text-[1.75rem] leading-none tabular-nums">{formatMoney(order.total)}</dd>
          </div>
        </dl>
      </Reveal>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <ButtonLink to={confirmation.cta.href} size="lg" arrow>
          {confirmation.cta.label}
        </ButtonLink>
        <ButtonLink to={confirmation.secondary.href} variant="outline" size="lg">
          {confirmation.secondary.label}
        </ButtonLink>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

/** Olive seal: the ring draws itself, then the check. */
function AnimatedSeal() {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="mx-auto size-20 text-secondary"
      aria-hidden="true"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.1" />
      <motion.circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        style={{ rotate: -90, transformOrigin: '50% 50%' }}
      />
      <motion.path
        d="M21 33l7.5 7.5L44 25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
      />
    </motion.svg>
  )
}

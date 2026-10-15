import { ChevronDown, Info, Lock, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ButtonLink, buttonClasses } from '../components/ui/Button'
import { Picture } from '../components/ui/Picture'
import { EASE } from '../components/ui/Reveal'
import { checkout, store, ui } from '../content'
import { cn, deliveryWindow, fill, formatMoney } from '../lib/format'
import { usePageMeta } from '../lib/site'
import { useCart, useCartLines, type Order, type ResolvedLine } from '../store/cart'

type Form = {
  email: string
  phone: string
  newsletter: boolean
  country: string
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  state: string
  zip: string
  cardNumber: string
  expiry: string
  cvc: string
  nameOnCard: string
}
type Field = Exclude<keyof Form, 'newsletter'>
type Errors = Partial<Record<Field, string>>

const emptyForm: Form = {
  email: '',
  phone: '',
  newsletter: true,
  country: store.countries[0] ?? '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  nameOnCard: '',
}

const round = (n: number) => Math.round(n * 100) / 100

/** Keeps card fields tidy while typing: "1234 5678 …", "12 / 29", digits-only CVC. */
function tidy(field: Field, value: string) {
  if (field === 'cardNumber') return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
  if (field === 'expiry') {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
  }
  if (field === 'cvc') return value.replace(/\D/g, '').slice(0, 4)
  return value
}

function validate(form: Form): Errors {
  const errors: Errors = {}
  const required: Field[] = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'cardNumber', 'expiry', 'cvc', 'nameOnCard']
  for (const field of required) if (!form[field].trim()) errors[field] = checkout.errors.required
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = checkout.errors.email
  if (form.cardNumber && form.cardNumber.replace(/\D/g, '').length !== 16) errors.cardNumber = checkout.errors.card
  if (form.expiry && !/^(0[1-9]|1[0-2]) \/ \d{2}$/.test(form.expiry)) errors.expiry = checkout.errors.expiry
  if (form.cvc && !/^\d{3,4}$/.test(form.cvc)) errors.cvc = checkout.errors.cvc
  return errors
}

/** Mock checkout: contact, shipping, delivery and payment. Nothing is charged or sent anywhere. */
export function CheckoutPage() {
  const { lines, subtotal } = useCartLines()
  const saveOrder = useCart((state) => state.saveOrder)
  const clear = useCart((state) => state.clear)
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [deliveryId, setDeliveryId] = useState(store.shippingMethods[0]!.id)
  const [code, setCode] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  usePageMeta({ title: checkout.title })

  const now = new Date()
  const shippingFor = (method: (typeof store.shippingMethods)[number]) =>
    method.freeOverThreshold && subtotal >= store.freeShippingThreshold ? 0 : method.price
  const delivery = store.shippingMethods.find((m) => m.id === deliveryId) ?? store.shippingMethods[0]!
  const discountRule = code ? store.discountCodes.find((d) => d.code === code) : undefined
  const discount = discountRule ? round((subtotal * discountRule.percent) / 100) : 0
  const shipping = shippingFor(delivery)
  const tax = round((subtotal - discount) * store.taxRate)
  const total = round(subtotal - discount + shipping + tax)
  const totals = { subtotal, discount, shipping, tax, total }

  if (lines.length === 0 && !placing) {
    return (
      <section className="container-page py-28 text-center md:py-40">
        <h1 className="display-md">{checkout.empty.heading}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">{checkout.empty.text}</p>
        <ButtonLink to="/shop" className="mt-8" arrow>
          {checkout.empty.cta}
        </ButtonLink>
      </section>
    )
  }

  const change = (field: keyof Form) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target
    const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
    setForm((current) => ({ ...current, [field]: typeof value === 'string' && field !== 'newsletter' ? tidy(field, value) : value }))
    if (field !== 'newsletter' && errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const fillSample = () => {
    setForm((current) => ({ ...current, ...checkout.sample }))
    setErrors({})
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (placing) return
    const found = validate(form)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`checkout-${first}`)?.focus()
      return
    }
    setPlacing(true)
    window.setTimeout(() => {
      const order: Order = {
        id: `${store.orderPrefix}-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        shipTo: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          address: form.address.trim(),
          apartment: form.apartment.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          zip: form.zip.trim(),
          country: form.country,
        },
        delivery: { id: delivery.id, label: delivery.label, detail: delivery.detail, price: shipping, window: deliveryWindow(new Date(), delivery.days) },
        cardLast4: form.cardNumber.replace(/\D/g, '').slice(-4),
        lines: lines.map((line) => ({
          productId: line.productId,
          name: line.product.name,
          sizeLabel: line.size.label,
          price: line.size.price,
          qty: line.qty,
          image: line.product.images[0]!,
        })),
        subtotal,
        discount,
        discountCode: discountRule?.code,
        shipping,
        tax,
        total,
      }
      saveOrder(order)
      navigate(`/order/${order.id}`, { replace: true })
      clear()
    }, 1300)
  }

  const summary = <OrderSummary lines={lines} totals={totals} code={code} onApply={setCode} />

  return (
    <div className="container-page pb-20 pt-8 md:pb-28 md:pt-12">
      {/* Phones and tablets: collapsible summary above the form. */}
      <div className="mb-8 lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((open) => !open)}
          aria-expanded={summaryOpen}
          aria-controls="mobile-summary"
          className="flex w-full items-center justify-between rounded-md bg-surface px-5 py-4 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            {summaryOpen ? checkout.hideSummary : checkout.showSummary}
            <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-300', summaryOpen && 'rotate-180')} />
          </span>
          <span className="font-display text-xl tabular-nums">{formatMoney(total)}</span>
        </button>
        <motion.div
          id="mobile-summary"
          initial={false}
          animate={{ height: summaryOpen ? 'auto' : 0, opacity: summaryOpen ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          inert={!summaryOpen}
          className="overflow-hidden"
        >
          <div className="pt-3">{summary}</div>
        </motion.div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_27rem] xl:gap-24">
        <form noValidate onSubmit={submit} className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="display-md">{checkout.title}</h1>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-md border border-secondary/25 bg-secondary/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex gap-3 text-[0.92rem] leading-relaxed">
              <Info aria-hidden="true" className="mt-0.5 size-[1.1rem] shrink-0 text-secondary" strokeWidth={1.75} />
              {checkout.demoNote}
            </p>
            <button
              type="button"
              onClick={fillSample}
              className="shrink-0 self-start rounded-full border border-foreground/25 px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-foreground hover:bg-foreground hover:text-background sm:self-auto"
            >
              {checkout.fillDemo}
            </button>
          </div>

          <Section index={1} title={checkout.sections.contact}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="email" label={checkout.fields.email} type="email" autoComplete="email" value={form.email} onChange={change('email')} error={errors.email} className="sm:col-span-2" />
              <TextField id="phone" label={checkout.fields.phone} type="tel" autoComplete="tel" value={form.phone} onChange={change('phone')} className="sm:col-span-2" />
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-3 text-[0.95rem]">
              <input type="checkbox" checked={form.newsletter} onChange={change('newsletter')} className="size-[1.1rem] accent-foreground" />
              {checkout.fields.newsletter}
            </label>
          </Section>

          <Section index={2} title={checkout.sections.shipping}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-country" className="mb-1.5 block text-sm font-medium">
                  {checkout.fields.country}
                </label>
                <div className="relative">
                  <select id="checkout-country" value={form.country} onChange={change('country')} autoComplete="country-name" className="field appearance-none pr-10">
                    {store.countries.map((country) => (
                      <option key={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2" />
                </div>
              </div>
              <TextField id="firstName" label={checkout.fields.firstName} autoComplete="given-name" value={form.firstName} onChange={change('firstName')} error={errors.firstName} />
              <TextField id="lastName" label={checkout.fields.lastName} autoComplete="family-name" value={form.lastName} onChange={change('lastName')} error={errors.lastName} />
              <TextField id="address" label={checkout.fields.address} autoComplete="address-line1" value={form.address} onChange={change('address')} error={errors.address} className="sm:col-span-2" />
              <TextField id="apartment" label={checkout.fields.apartment} autoComplete="address-line2" value={form.apartment} onChange={change('apartment')} className="sm:col-span-2" />
              <TextField id="city" label={checkout.fields.city} autoComplete="address-level2" value={form.city} onChange={change('city')} error={errors.city} />
              <div className="grid grid-cols-2 gap-4">
                <TextField id="state" label={checkout.fields.state} autoComplete="address-level1" value={form.state} onChange={change('state')} error={errors.state} />
                <TextField id="zip" label={checkout.fields.zip} autoComplete="postal-code" value={form.zip} onChange={change('zip')} error={errors.zip} />
              </div>
            </div>
          </Section>

          <Section index={3} title={checkout.sections.delivery}>
            <fieldset>
              <legend className="sr-only">{checkout.sections.delivery}</legend>
              <div className="grid gap-3">
                {store.shippingMethods.map((method) => {
                  const checked = method.id === delivery.id
                  const price = shippingFor(method)
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-4 rounded-md border bg-card p-4 transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent sm:p-5',
                        checked ? 'border-foreground' : 'border-foreground/15 hover:border-foreground/45',
                      )}
                    >
                      <input type="radio" name="delivery" value={method.id} checked={checked} onChange={() => setDeliveryId(method.id)} className="sr-only" />
                      <span className={cn('grid size-5 shrink-0 place-items-center rounded-full border transition-colors', checked ? 'border-foreground' : 'border-foreground/30')}>
                        <span className={cn('size-2.5 rounded-full bg-foreground transition-transform duration-300', checked ? 'scale-100' : 'scale-0')} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{method.label}</span>
                        <span className="block text-sm text-muted">
                          {method.detail} · {deliveryWindow(now, method.days)}
                        </span>
                      </span>
                      <span className="text-sm font-medium tabular-nums">{price === 0 ? checkout.free : formatMoney(price)}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </Section>

          <Section index={4} title={checkout.sections.payment}>
            <div className="rounded-md border border-foreground/12 bg-card p-4 sm:p-6">
              <p className="mb-5 flex items-start gap-2.5 text-sm text-muted">
                <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" strokeWidth={1.75} />
                {checkout.paymentNote}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="cardNumber"
                  label={checkout.fields.cardNumber}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={change('cardNumber')}
                  error={errors.cardNumber}
                  className="sm:col-span-2"
                />
                <TextField id="expiry" label={checkout.fields.expiry} inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={form.expiry} onChange={change('expiry')} error={errors.expiry} />
                <TextField id="cvc" label={checkout.fields.cvc} inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={form.cvc} onChange={change('cvc')} error={errors.cvc} />
                <TextField id="nameOnCard" label={checkout.fields.nameOnCard} autoComplete="cc-name" value={form.nameOnCard} onChange={change('nameOnCard')} error={errors.nameOnCard} className="sm:col-span-2" />
              </div>
            </div>
          </Section>

          <button type="submit" disabled={placing} className={buttonClasses('primary', 'lg', 'mt-10 w-full disabled:opacity-100')} aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={placing ? 'placing' : 'idle'}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-center gap-2.5"
              >
                {placing ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    {checkout.placing}
                  </>
                ) : (
                  <>
                    <Lock aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    {fill(checkout.placeOrder, { total: formatMoney(total) })}
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </form>

        <aside aria-label={checkout.summary} className="hidden lg:block">
          <div className="sticky top-8">{summary}</div>
        </aside>
      </div>
    </div>
  )
}

function Section({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-12" aria-labelledby={`checkout-section-${index}`}>
      <h2 id={`checkout-section-${index}`} className="mb-5 flex items-baseline gap-3 font-display text-[1.5rem] leading-tight">
        <span aria-hidden="true" className="font-sans text-xs tracking-widest text-muted">
          {String(index).padStart(2, '0')}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function TextField({ id, label, error, className, ...input }: { id: Field; label: string; error?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = `checkout-${id}`
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className="field"
        {...input}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-accent-deep">
          {error}
        </p>
      )}
    </div>
  )
}

type Totals = { subtotal: number; discount: number; shipping: number; tax: number; total: number }

function OrderSummary({ lines, totals, code, onApply }: { lines: ResolvedLine[]; totals: Totals; code: string | null; onApply: (code: string | null) => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  // The summary renders twice (phone collapsible + desktop sidebar), so ids must be unique per copy.
  const id = useId()

  const apply = (event: FormEvent) => {
    event.preventDefault()
    const match = store.discountCodes.find((d) => d.code.toLowerCase() === input.trim().toLowerCase())
    if (!match) {
      setError(checkout.invalidCode)
      return
    }
    onApply(match.code)
    setInput('')
    setError('')
  }

  return (
    <div className="rounded-md bg-surface p-5 sm:p-7">
      <h2 className="font-display text-[1.6rem] leading-tight">{checkout.summary}</h2>
      <ul className="mt-6 space-y-4">
        {lines.map((line) => (
          <li key={line.key} className="flex items-center gap-4">
            <span className="relative shrink-0">
              <Picture image={line.product.images[0]!} alt="" reveal={false} className="size-16 rounded-sm" />
              <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-foreground text-[0.65rem] font-semibold text-background tabular-nums">
                {line.qty}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[1.02rem] leading-snug">{line.product.name}</span>
              <span className="block text-sm text-muted">{line.size.label}</span>
            </span>
            <span className="text-sm tabular-nums">{formatMoney(line.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-foreground/10 pt-6">
        {code ? (
          <p className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 font-medium">{fill(checkout.appliedCode, { code })}</span>
            <button type="button" onClick={() => onApply(null)} className="inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground">
              <X aria-hidden="true" className="size-3.5" />
              {checkout.removeCode}
            </button>
          </p>
        ) : (
          <form onSubmit={apply} noValidate>
            <label htmlFor={`${id}-code`} className="sr-only">
              {checkout.discount}
            </label>
            <div className="flex gap-2">
              <input
                id={`${id}-code`}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value)
                  setError('')
                }}
                placeholder={checkout.discountPlaceholder}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className="field h-12 uppercase placeholder:normal-case"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-md border border-foreground/25 px-5 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
              >
                {checkout.apply}
              </button>
            </div>
            {error && (
              <p id={`${id}-error`} className="mt-2 text-sm text-accent-deep">
                {error}
              </p>
            )}
          </form>
        )}
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-foreground/10 pt-6 text-[0.95rem]">
        <Row label={ui.subtotal} value={formatMoney(totals.subtotal)} />
        {totals.discount > 0 && <Row label={checkout.discountRow} value={`−${formatMoney(totals.discount)}`} />}
        <Row label={checkout.shipping} value={totals.shipping === 0 ? checkout.free : formatMoney(totals.shipping)} />
        {store.taxRate > 0 && <Row label={checkout.tax} value={formatMoney(totals.tax)} />}
        <div className="flex items-baseline justify-between border-t border-foreground/10 pt-4">
          <dt className="font-medium">{checkout.total}</dt>
          <dd className="font-display text-[1.75rem] leading-none tabular-nums">{formatMoney(totals.total)}</dd>
        </div>
      </dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

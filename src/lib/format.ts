import { site, store } from '../content'

/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

/** Removes the *accent* markers, for plain-text places (alt text, titles, meta tags). */
export const plain = (text: string) => text.replace(/\*/g, '')

const whole = new Intl.NumberFormat(site.locale, { style: 'currency', currency: site.currency, maximumFractionDigits: 0 })
const cents = new Intl.NumberFormat(site.locale, { style: 'currency', currency: site.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Product prices: 68 → "$68", 61.2 → "$61.20". */
export const formatPrice = (amount: number) => (Number.isInteger(amount) ? whole : cents).format(amount)

/** Bag and checkout totals, always with cents: 68 → "$68.00". */
export const formatMoney = (amount: number) => cents.format(amount)

/**
 * Fills {tokens} in copy from content.ts. {freeShipping} is always available.
 * fill('You are {amount} away', { amount: '$7' }) → 'You are $7 away'
 */
export function fill(template: string, values: Record<string, string | number> = {}) {
  const all: Record<string, string | number> = { freeShipping: formatPrice(store.freeShippingThreshold), year: new Date().getFullYear(), ...values }
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in all ? String(all[key]) : match))
}

/** "2026-09-10" → "September 10, 2026". */
export function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(site.locale, options)
}

/** Adds business days (skips Saturday and Sunday) to a date. */
export function addBusinessDays(from: Date, days: number) {
  const date = new Date(from)
  let added = 0
  while (added < days) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return date
}

/** "Oct 20 – Oct 22" for a delivery window of [min, max] business days from `from`. */
export function deliveryWindow(from: Date, [min, max]: readonly number[]) {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
  const start = addBusinessDays(from, min ?? 3).toLocaleDateString(site.locale, options)
  const end = addBusinessDays(from, max ?? min ?? 5).toLocaleDateString(site.locale, options)
  return start === end ? start : `${start} – ${end}`
}

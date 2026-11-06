import type { Lang } from '../data/types'

/** Prezzi segnaposto (il pagamento reale non esiste ancora). Export storici: non rimuovere. */
export const pricing = {
  monthly: 4.99,
  yearly: 39,
  currency: 'EUR',
  trialDays: 14,
} as const

export type Currency = 'EUR' | 'USD'

/** Prezzi per valuta (segnaposto). */
export const prices: Record<Currency, { monthly: number; yearly: number }> = {
  EUR: { monthly: 4.99, yearly: 39 },
  USD: { monthly: 4.99, yearly: 39 },
}

/** en -> USD, it -> EUR. */
export function currencyForLang(lang: Lang): Currency {
  return lang === 'en' ? 'USD' : 'EUR'
}

/** Formatta un importo per la lingua (en-US / it-IT); senza decimali se intero. */
export function formatPrice(amount: number, lang: Lang, currency: Currency = currencyForLang(lang)): string {
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

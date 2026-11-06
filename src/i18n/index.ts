import { useSyncExternalStore } from 'react'
import type { Lang } from '../data/types'
import { it, type Dict } from './it'
import { en } from './en'

const dicts: Record<Lang, Dict> = { it, en }

let current: Lang = typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'it'
const listeners = new Set<() => void>()

/** Cambia la lingua dell'interfaccia (in T6 collegata a useSettings). */
export function setLang(lang: Lang) {
  if (lang === current) return
  current = lang
  if (typeof document !== 'undefined') document.documentElement.lang = lang
  listeners.forEach((l) => l())
}

export function getLang(): Lang {
  return current
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Lingua corrente (reattiva). */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang)
}

/** Dizionario tipizzato della lingua corrente: t.nav.search, t.glass[drink.glass]... */
export function useT(): Dict {
  return dicts[useLang()]
}

/** Testo localizzato di un L10n. */
export function l10n(text: { it: string; en: string }, lang: Lang = current): string {
  return text[lang]
}

export type { Dict }

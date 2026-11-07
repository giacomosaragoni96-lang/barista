import { useSyncExternalStore } from 'react'
import type { Lang } from '../data/types'
import { it, type Dict } from './it'
import { en } from './en'
import { initialLang } from '../lib/storage/repo'

const dicts: Record<Lang, Dict> = { it, en }

/** Stessa regola dello store (initialLang): it solo se il browser e italiano, altrimenti en. */
let current: Lang = initialLang()
const listeners = new Set<() => void>()

/** Allinea <html lang>, titolo e meta description alla lingua. */
function applyDocument(lang: Lang) {
  if (typeof document === 'undefined') return
  const { title, description } = dicts[lang].meta
  document.documentElement.lang = lang
  document.title = title
  for (const sel of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    document.head.querySelector(sel)?.setAttribute('content', description)
  }
  for (const sel of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    document.head.querySelector(sel)?.setAttribute('content', title)
  }
}
applyDocument(current)

/** Cambia la lingua dell'interfaccia (App la collega a useSettings). */
export function setLang(lang: Lang) {
  if (lang === current) return
  current = lang
  applyDocument(lang)
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

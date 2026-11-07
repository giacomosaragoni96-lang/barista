import type { Lang } from '../../data/types'

export type Units = 'ml' | 'cl' | 'oz'

export interface Settings {
  lang: Lang
  units: Units
  /** true se l'utente ha scelto le unita a mano: da quel momento il cambio lingua non le tocca. */
  unitsChosen?: boolean
}

/** Lingua alla prima visita: 'it' se il browser e italiano, altrimenti 'en'. */
export function initialLang(): Lang {
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en'
}

/** Unita predefinite per lingua: en = oz, it = ml. */
export function defaultUnits(lang: Lang): Units {
  return lang === 'en' ? 'oz' : 'ml'
}

/** Impostazioni di partenza (prima visita). */
export function defaultSettings(): Settings {
  const lang = initialLang()
  return { lang, units: defaultUnits(lang), unitsChosen: false }
}

/**
 * Normalizza impostazioni salvate (anche vecchie, senza unitsChosen).
 * Migrazione: con units salvate e unitsChosen assente, la scelta e considerata fatta
 * solo se le units differiscono da quelle predefinite della lingua salvata.
 * Restituisce null se non c'e nulla di valido.
 */
export function normalizeSettings(raw: unknown): Settings | null {
  if (!raw || typeof raw !== 'object') return null
  const v = raw as Record<string, unknown>
  const lang: Lang | null = v.lang === 'it' || v.lang === 'en' ? v.lang : null
  const units: Units | null = v.units === 'ml' || v.units === 'cl' || v.units === 'oz' ? v.units : null
  if (!lang && !units) return null
  const l = lang ?? initialLang()
  const chosen =
    units !== null && (typeof v.unitsChosen === 'boolean' ? v.unitsChosen : units !== defaultUnits(l))
  return { lang: l, units: chosen && units ? units : defaultUnits(l), unitsChosen: chosen }
}

/** Cambia lingua; le unita seguono la lingua solo se non scelte dall'utente. */
export function withLang(s: Settings, lang: Lang): Settings {
  return s.unitsChosen ? { ...s, lang } : { ...s, lang, units: defaultUnits(lang) }
}

/** Imposta le unita come scelta esplicita dell'utente. */
export function withUnits(s: Settings, units: Units): Settings {
  return { ...s, units, unitsChosen: true }
}

/** Strato dati utente. Oggi localStorage, domani Supabase. */
export interface UserDataRepo {
  getPantry(): Promise<string[]>
  setPantry(ids: string[]): Promise<void>
  getFavorites(): Promise<string[]>
  setFavorites(ids: string[]): Promise<void>
  getRecents(): Promise<string[]>
  setRecents(ids: string[]): Promise<void>
  /** null se mai salvate */
  getSettings(): Promise<Settings | null>
  setSettings(s: Settings): Promise<void>
  clearAll(): Promise<void>
}

export const MAX_RECENTS = 12

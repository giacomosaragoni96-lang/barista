import type { Lang } from '../../data/types'
import type { Plan } from '../plan'

export interface Settings {
  lang: Lang
  units: 'ml' | 'cl' | 'oz'
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
  getPlan(): Promise<Plan>
  setPlan(p: Plan): Promise<void>
  clearAll(): Promise<void>
}

export const MAX_RECENTS = 12

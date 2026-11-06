import type { Plan } from '../plan'
import { MAX_RECENTS, type Settings, type UserDataRepo } from './repo'

const K = {
  pantry: 'barista:v1:pantry',
  favorites: 'barista:v1:favorites',
  recents: 'barista:v1:recents',
  settings: 'barista:v1:settings',
  plan: 'barista:v1:plan',
}

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota piena o storage bloccato: ignora */
  }
}

const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

export const localRepo: UserDataRepo = {
  async getPantry() {
    return strings(read(K.pantry))
  },
  async setPantry(ids) {
    write(K.pantry, ids)
  },
  async getFavorites() {
    return strings(read(K.favorites))
  },
  async setFavorites(ids) {
    write(K.favorites, ids)
  },
  async getRecents() {
    return strings(read(K.recents)).slice(0, MAX_RECENTS)
  },
  async setRecents(ids) {
    write(K.recents, ids.slice(0, MAX_RECENTS))
  },
  async getSettings() {
    const v = read(K.settings) as Partial<Settings> | undefined
    if (!v || typeof v !== 'object') return null
    const lang = v.lang === 'it' || v.lang === 'en' ? v.lang : null
    const units = v.units === 'ml' || v.units === 'cl' || v.units === 'oz' ? v.units : null
    if (!lang && !units) return null
    return { lang: lang ?? 'it', units: units ?? 'ml' }
  },
  async setSettings(s) {
    write(K.settings, s)
  },
  async getPlan(): Promise<Plan> {
    const v = read(K.plan) as Partial<Plan> | undefined
    if (v && (v.status === 'trial' || v.status === 'pro' || v.status === 'free')) {
      return { status: v.status, until: typeof v.until === 'string' ? v.until : undefined }
    }
    return { status: 'free' }
  },
  async setPlan(p) {
    write(K.plan, p)
  },
  async clearAll() {
    try {
      Object.values(K).forEach((k) => localStorage.removeItem(k))
    } catch {
      /* ignora */
    }
  },
}

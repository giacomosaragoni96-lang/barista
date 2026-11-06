import { useMemo, useSyncExternalStore } from 'react'
import type { Lang } from '../data/types'
import { repo, type Settings } from '../lib/storage'
import { MAX_RECENTS } from '../lib/storage/repo'
import { isPro, startTrial as makeTrial, type Plan } from '../lib/plan'

interface State {
  hydrated: boolean
  pantry: Set<string>
  favorites: string[]
  recents: string[]
  settings: Settings
  plan: Plan
}

const initialLang = (): Lang =>
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en'

let state: State = {
  hydrated: false,
  pantry: new Set(),
  favorites: [],
  recents: [],
  settings: { lang: initialLang(), units: 'ml' },
  plan: { status: 'free' },
}

const listeners = new Set<() => void>()
function set(patch: Partial<State>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

let hydrating: Promise<void> | null = null
/** Carica i dati salvati. Idempotente; parte da sola alla prima sottoscrizione, ma si puo chiamare in main. */
export function hydrate(): Promise<void> {
  hydrating ??= (async () => {
    try {
      const [pantry, favorites, recents, settings, plan] = await Promise.all([
        repo.getPantry(),
        repo.getFavorites(),
        repo.getRecents(),
        repo.getSettings(),
        repo.getPlan(),
      ])
      set({
        hydrated: true,
        pantry: new Set(pantry),
        favorites,
        recents,
        settings: settings ?? state.settings,
        plan,
      })
    } catch {
      set({ hydrated: true })
    }
  })()
  return hydrating
}

function subscribe(l: () => void) {
  listeners.add(l)
  void hydrate()
  return () => {
    listeners.delete(l)
  }
}
const getState = () => state

const useStore = () => useSyncExternalStore(subscribe, getState, getState)

// ---- azioni (funzioni stabili) ----
const savePantry = (p: Set<string>) => {
  set({ pantry: p })
  void repo.setPantry([...p])
}
const pantryActions = {
  toggle(id: string) {
    const p = new Set(state.pantry)
    if (!p.delete(id)) p.add(id)
    savePantry(p)
  },
  addMany(ids: string[]) {
    savePantry(new Set([...state.pantry, ...ids]))
  },
  remove(id: string) {
    const p = new Set(state.pantry)
    p.delete(id)
    savePantry(p)
  },
  clear() {
    savePantry(new Set())
  },
}

const favActions = {
  toggle(id: string) {
    const f = state.favorites.includes(id) ? state.favorites.filter((x) => x !== id) : [...state.favorites, id]
    set({ favorites: f })
    void repo.setFavorites(f)
  },
}

const recentActions = {
  push(id: string) {
    const r = [id, ...state.recents.filter((x) => x !== id)].slice(0, MAX_RECENTS)
    set({ recents: r })
    void repo.setRecents(r)
  },
}

const saveSettings = (patch: Partial<Settings>) => {
  const s = { ...state.settings, ...patch }
  set({ settings: s })
  void repo.setSettings(s)
}
const settingsActions = {
  setLang: (lang: Lang) => saveSettings({ lang }),
  setUnits: (units: Settings['units']) => saveSettings({ units }),
}

const planActions = {
  startTrial() {
    const p = makeTrial()
    set({ plan: p })
    void repo.setPlan(p)
  },
}

// ---- hook ----
export function usePantry() {
  const { pantry } = useStore()
  return useMemo(() => ({ pantry, has: (id: string) => pantry.has(id), ...pantryActions }), [pantry])
}

export function useFavorites() {
  const { favorites } = useStore()
  return useMemo(
    () => ({ ids: favorites, isFav: (id: string) => favorites.includes(id), ...favActions }),
    [favorites],
  )
}

export function useRecents() {
  const { recents } = useStore()
  return useMemo(() => ({ ids: recents, ...recentActions }), [recents])
}

export function useSettings() {
  const { settings } = useStore()
  return useMemo(() => ({ lang: settings.lang, units: settings.units, ...settingsActions }), [settings])
}

export function usePlan() {
  const { plan } = useStore()
  return useMemo(() => ({ plan, isPro: isPro(plan), ...planActions }), [plan])
}

export function useHydrated(): boolean {
  return useStore().hydrated
}

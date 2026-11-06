import { useSyncExternalStore } from 'react'

export type RouteName = 'search' | 'drink' | 'favorites' | 'pantry' | 'can-make' | 'settings' | 'demo' | 'not-found'
export interface Route {
  name: RouteName
  params: Record<string, string>
}

function normalize(hash: string): string {
  const p = hash.replace(/^#/, '')
  return p.startsWith('/') ? p : '/' + p
}

const ROUTES: Record<string, RouteName> = {
  favorites: 'favorites', pantry: 'pantry', 'can-make': 'can-make', settings: 'settings', demo: 'demo',
}
/** Vecchi percorsi italiani: restano validi e vengono riscritti a quelli nuovi. */
const LEGACY: Record<string, string> = {
  preferiti: 'favorites', dispensa: 'pantry', 'posso-fare': 'can-make', impostazioni: 'settings',
}

export function parseRoute(hash: string): Route {
  const path = normalize(hash).split('?')[0].replace(/\/+$/, '') || '/'
  const seg = path.split('/').filter(Boolean)
  if (seg.length === 0) return { name: 'search', params: {} }
  if (seg[0] === 'drink' && seg[1]) return { name: 'drink', params: { id: decodeURIComponent(seg[1]) } }
  if (seg.length === 1) {
    const name = ROUTES[seg[0]] ?? ROUTES[LEGACY[seg[0]]]
    if (name) return { name, params: {} }
  }
  return { name: 'not-found', params: {} }
}

/** Percorsi pronti: paths.drink('negroni') */
export const paths = {
  search: '/',
  drink: (id: string) => `/drink/${encodeURIComponent(id)}`,
  favorites: '/favorites',
  pantry: '/pantry',
  canMake: '/can-make',
  settings: '/settings',
  demo: '/demo',
}

/** Se l'hash e un vecchio percorso italiano lo riscrive (senza nuova voce nella cronologia). */
function canonicalize() {
  if (typeof location === 'undefined') return
  const m = location.hash.match(/^#\/?([^/?]+)\/?(\?.*)?$/)
  const next = m && LEGACY[m[1]]
  if (next) history.replaceState(history.state, '', '#/' + next + (m[2] ?? ''))
}
canonicalize()
if (typeof window !== 'undefined') window.addEventListener('hashchange', canonicalize)

let depth = 0 // pagine app aperte nella sessione, per sapere se back() ha senso

export function navigate(path: string) {
  const target = '#' + (path.startsWith('/') ? path : '/' + path)
  if (location.hash === target) return
  depth++
  location.hash = target
}

export function back(fallback = '/') {
  if (depth > 0) {
    depth--
    history.back()
  } else {
    location.hash = '#' + fallback
  }
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

// Snapshot stabile: stessa stringa -> stesso oggetto
let lastHash = ''
let lastRoute: Route = parseRoute('')
function snapshot(): Route {
  if (location.hash !== lastHash) {
    lastHash = location.hash
    lastRoute = parseRoute(lastHash)
  }
  return lastRoute
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

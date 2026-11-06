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

export function parseRoute(hash: string): Route {
  const path = normalize(hash).split('?')[0].replace(/\/+$/, '') || '/'
  const seg = path.split('/').filter(Boolean)
  if (seg.length === 0) return { name: 'search', params: {} }
  if (seg[0] === 'drink' && seg[1]) return { name: 'drink', params: { id: decodeURIComponent(seg[1]) } }
  if (seg.length === 1) {
    const map: Record<string, RouteName> = {
      preferiti: 'favorites', dispensa: 'pantry', 'posso-fare': 'can-make', impostazioni: 'settings', demo: 'demo',
    }
    if (map[seg[0]]) return { name: map[seg[0]], params: {} }
  }
  return { name: 'not-found', params: {} }
}

/** Percorsi pronti: paths.drink('negroni') */
export const paths = {
  search: '/',
  drink: (id: string) => `/drink/${encodeURIComponent(id)}`,
  favorites: '/preferiti',
  pantry: '/dispensa',
  canMake: '/posso-fare',
  settings: '/impostazioni',
  demo: '/demo',
}

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

import type { ReactNode } from 'react'
import { useT } from '../i18n'
import { navigate, paths, useRoute, type RouteName } from '../router'
import { ProBadge } from './ProBadge'

type Tab = { key: 'search' | 'favorites' | 'pantry' | 'settings'; path: string; match: RouteName[]; icon: ReactNode; pro?: boolean }

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const TABS: Tab[] = [
  { key: 'search', path: paths.search, match: ['search', 'drink'], icon: svg(<><path d="M5 5h14l-6 7v6l3 1.5" /><path d="M8 5l4 7" /></>) },
  { key: 'favorites', path: paths.favorites, match: ['favorites'], icon: svg(<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />) },
  { key: 'pantry', path: paths.pantry, match: ['pantry', 'can-make'], pro: true, icon: svg(<><path d="M10 3h4v4.2c0 1 1.5 2 1.5 4V19a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-7.8c0-2 1.5-3 1.5-4z" /><path d="M8.5 14h7" /></>) },
  { key: 'settings', path: paths.settings, match: ['settings'], icon: svg(<><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>) },
]

export function BottomNav() {
  const t = useT()
  const route = useRoute()
  return (
    <nav
      aria-label={t.appName}
      className="shrink-0 border-t border-line bg-bg/95 backdrop-blur"
      style={{ paddingBottom: 'var(--sab)' }}
    >
      <ul className="m-0 flex list-none p-0" style={{ height: 'var(--nav-h)' }}>
        {TABS.map((tab) => {
          const active = tab.match.includes(route.name)
          return (
            <li key={tab.key} className="flex-1">
              <a
                href={'#' + tab.path}
                aria-current={active ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); navigate(tab.path) }}
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 no-underline transition-colors duration-150 ${active ? 'text-amber' : 'text-muted'}`}
              >
                <span className={`absolute top-0 h-[3px] w-8 rounded-b-full bg-amber transition-opacity duration-150 ${active ? 'opacity-100' : 'opacity-0'}`} />
                <span className="relative">
                  {tab.icon}
                  {tab.pro && <ProBadge className="absolute -right-7 -top-1.5 scale-[0.8]" />}
                </span>
                <span className="text-[12.5px] font-semibold">{t.nav[tab.key]}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

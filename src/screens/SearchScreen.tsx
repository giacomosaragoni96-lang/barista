import { useMemo, useState } from 'react'
import type { Base, Drink } from '../data/types'
import { DrinkCard } from '../components/DrinkCard'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { SearchBar } from '../components/SearchBar'
import { Chip } from '../components/Chip'
import { useLang, useT } from '../i18n'
import { allDrinks, getDrink, ingName } from '../lib/catalog'
import { popularDrinks, searchDrinks } from '../lib/search'
import { navigate, paths } from '../router'
import { useFavorites, useRecents } from '../state/store'

type Filter = 'gin' | 'rum' | 'vodka' | 'tequila' | 'whisky' | 'spritz' | 'none'
const FILTERS: Filter[] = ['gin', 'rum', 'vodka', 'tequila', 'whisky', 'spritz', 'none']
const WHISKY: Base[] = ['whisky', 'bourbon', 'rye', 'scotch', 'irish']

function applyFilter(f: Filter): Drink[] {
  switch (f) {
    case 'whisky': return allDrinks.filter((d) => d.base.some((b) => WHISKY.includes(b)))
    case 'spritz': return allDrinks.filter((d) => d.family === 'spritz')
    case 'none': return allDrinks.filter((d) => d.family === 'mocktail' || d.base.includes('none'))
    default: return allDrinks.filter((d) => d.base.includes(f))
  }
}

function Section({ title, drinks }: { title: string; drinks: Drink[] }) {
  if (!drinks.length) return null
  return (
    <section className="mt-6">
      <h2 className="m-0 mb-3 px-1 text-[15px] font-semibold text-muted">{title}</h2>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {drinks.map((d) => <li key={d.id}><DrinkCard drink={d} /></li>)}
      </ul>
    </section>
  )
}

export default function SearchScreen() {
  const t = useT()
  const lang = useLang()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter | null>(null)
  const recents = useRecents()
  const favs = useFavorites()

  const results = useMemo(() => (q.trim() ? searchDrinks(q, lang, 30) : []), [q, lang])
  const filtered = useMemo(() => (filter ? applyFilter(filter) : []), [filter])
  const recentDrinks = useMemo(() => recents.ids.map(getDrink).filter((d): d is Drink => !!d).slice(0, 6), [recents.ids])
  const favDrinks = useMemo(() => favs.ids.map(getDrink).filter((d): d is Drink => !!d).slice(0, 6), [favs.ids])
  const popular = useMemo(() => popularDrinks(12), [])

  const label = (f: Filter) => (f === 'spritz' ? t.search.aperitivi : f === 'none' ? t.family.mocktail : t.base[f])
  const searching = q.trim().length > 0

  return (
    <div>
      <div className="sticky top-0 z-10 bg-bg px-4 pb-3 pt-4">
        <SearchBar
          autoFocus
          value={q}
          onChange={setQ}
          placeholder={t.search.placeholder}
          onSubmit={() => { if (results[0]) navigate(paths.drink(results[0].drink.id)) }}
        />
        {!searching && (
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 scroll-area" role="group" aria-label={t.search.all}>
            {FILTERS.map((f) => (
              <Chip key={f} selected={filter === f} onToggle={() => setFilter(filter === f ? null : f)}>{label(f)}</Chip>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-8">
        {searching ? (
          results.length ? (
            <ul className="m-0 mt-2 flex list-none flex-col gap-2.5 p-0" aria-label={t.search.results}>
              {results.map((r) => (
                <li key={r.drink.id}>
                  <DrinkCard
                    drink={r.drink}
                    extra={r.matched?.startsWith('ingredient:') ? (
                      <span className="text-amber">{t.search.viaIngredient} {ingName(r.matched.replace(/^ingredient:\s*/, ''), lang) || r.matched.replace(/^ingredient:\s*/, '')}</span>
                    ) : undefined}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={<Icon name="search" size={28} />} title={t.search.empty} hint={t.search.emptyHint} />
          )
        ) : filter ? (
          filtered.length ? <Section title={label(filter)} drinks={filtered} /> : <EmptyState icon={<Icon name="search" size={28} />} title={t.search.empty} hint={t.search.emptyHint} />
        ) : (
          <>
            <Section title={t.search.recents} drinks={recentDrinks} />
            <Section title={t.search.favorites} drinks={favDrinks} />
            <Section title={t.search.popular} drinks={popular} />
            {!recentDrinks.length && !favDrinks.length && !popular.length && (
              <EmptyState icon={<Icon name="search" size={28} />} title={t.search.empty} hint={t.search.emptyHint} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

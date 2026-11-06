import type { Drink } from '../data/types'
import { Button } from '../components/Button'
import { DrinkCard } from '../components/DrinkCard'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { useT } from '../i18n'
import { getDrink } from '../lib/catalog'
import { navigate, paths } from '../router'
import { useFavorites } from '../state/store'

export default function FavoritesScreen() {
  const t = useT()
  const { ids } = useFavorites()
  const drinks = ids.map(getDrink).filter((d): d is Drink => !!d)
  return (
    <div className="px-4 pb-8 pt-6">
      <h1 className="font-display m-0 px-1 text-[32px]">{t.favorites.title}</h1>
      {drinks.length === 0 ? (
        <EmptyState
          icon={<Icon name="star" size={28} />}
          title={t.favorites.empty}
          hint={t.favorites.emptyHint}
          action={<Button variant="primary" size="lg" onClick={() => navigate(paths.search)}>{t.favorites.goSearch}</Button>}
        />
      ) : (
        <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
          {drinks.map((d) => <li key={d.id}><DrinkCard drink={d} /></li>)}
        </ul>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'
import type { Drink } from '../data/types'
import { useT } from '../i18n'
import { navigate, paths } from '../router'
import { useFavorites } from '../state/store'
import { GlassIcon } from './GlassIcon'
import { Icon } from './Icon'

interface Props {
  drink: Drink
  /** riga extra sotto (es. "Manca lime") */
  extra?: ReactNode
}

export function DrinkCard({ drink, extra }: Props) {
  const t = useT()
  const fav = useFavorites()
  const isFav = fav.isFav(drink.id)
  return (
    <div className="card press relative flex items-center">
      <a
        href={'#' + paths.drink(drink.id)}
        onClick={(e) => { e.preventDefault(); navigate(paths.drink(drink.id)) }}
        className="flex min-h-[84px] min-w-0 flex-1 items-center gap-3 py-2 pl-3 pr-1 text-inherit no-underline"
      >
        <span className="flex w-[52px] shrink-0 justify-center"><GlassIcon glass={drink.glass} color={drink.color} size={44} /></span>
        <span className="min-w-0 flex-1">
          <span className="font-display block line-clamp-2 break-words text-[21px] leading-tight">{drink.name}</span>
          <span className="mt-0.5 block text-[14.5px] text-muted">
            {t.family[drink.family]} · {t.technique[drink.technique[0]]} · {drink.abv}%
          </span>
          {extra && <span className="mt-0.5 block text-[14.5px]">{extra}</span>}
        </span>
      </a>
      <button
        type="button"
        aria-pressed={isFav}
        aria-label={isFav ? t.drink.favoriteRemove : t.drink.favoriteAdd}
        onClick={() => fav.toggle(drink.id)}
        className={`mr-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-0 bg-transparent transition-colors duration-150 ${isFav ? 'text-amber' : 'text-muted'}`}
      >
        <Icon name={isFav ? 'star-filled' : 'star'} />
      </button>
    </div>
  )
}

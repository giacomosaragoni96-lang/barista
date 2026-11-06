import { useMemo } from 'react'
import type { Drink } from '../data/types'
import { l10n, useLang, useT } from '../i18n'
import { getSimilarDrinks, getSubstitutes } from '../lib/alternatives'
import { ingName } from '../lib/catalog'
import { tap } from '../hooks/haptic'
import { navigate, paths } from '../router'
import { usePantry, usePlan } from '../state/store'
import { Button } from './Button'
import { GlassIcon } from './GlassIcon'
import { Sheet } from './Sheet'

interface Props {
  open: boolean
  onClose: () => void
  ingredientId: string | null
  drink: Drink
  /** tutti i mancanti accumulati nella sessione */
  missing: string[]
  onUse: (substituteId: string) => void
}

const QUALITY_COLOR = { great: 'var(--color-have)', good: 'var(--color-amber)', emergency: 'var(--color-miss)' }

export function MissingSheet({ open, onClose, ingredientId, drink, missing, onUse }: Props) {
  const t = useT()
  const lang = useLang()
  const { pantry, has, remove } = usePantry()
  const { isPro } = usePlan()
  const pantryOn = isPro && pantry.size > 0

  const subs = useMemo(() => (ingredientId ? getSubstitutes(ingredientId, pantryOn ? pantry : undefined) : []), [ingredientId, pantryOn, pantry])
  const similar = useMemo(() => getSimilarDrinks(drink.id, missing, pantryOn ? pantry : undefined, 4), [drink.id, missing, pantryOn, pantry])

  const reason = (d: Drink, fallback: string) => {
    const parts: string[] = []
    if (d.family === drink.family) parts.push(`${t.missing.sameFamily}: ${t.family[d.family]}`)
    const b = d.base.find((x) => x !== 'none' && drink.base.includes(x))
    if (b) parts.push(`${t.missing.sameBase}: ${t.base[b]}`)
    return parts.length ? parts.join(', ') : fallback
  }

  return (
    <Sheet open={open && !!ingredientId} onClose={onClose} title={ingredientId ? t.missing.title(ingName(ingredientId, lang)) : undefined}>
      {ingredientId && (
        <div className="flex flex-col gap-6 pt-1">
          <section>
            <h3 className="m-0 mb-3 text-[15px] font-semibold text-muted">{t.missing.useInstead}</h3>
            {subs.length === 0 ? (
              <p className="m-0 text-muted">{t.missing.noSubstitutes}</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {subs.map((s) => (
                  <li key={s.ingredient.id} className="card p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[19px] font-semibold">{s.ingredient.name[lang]}</span>
                      <span className="rounded-md px-1.5 text-[12.5px] font-bold leading-[20px]" style={{ color: QUALITY_COLOR[s.quality], border: `1px solid ${QUALITY_COLOR[s.quality]}` }}>
                        {t.missing.quality[s.quality]}
                      </span>
                      {s.inPantry && <span className="text-[13px] text-have">{t.missing.inPantry}</span>}
                    </div>
                    <p className="mb-3 mt-1 text-[15.5px] text-muted">{l10n(s.note, lang)}</p>
                    <Button variant="primary" block onClick={() => { tap(); onUse(s.ingredient.id); onClose() }}>{t.missing.useThis}</Button>
                  </li>
                ))}
              </ul>
            )}
            {pantryOn && has(ingredientId) && (
              <Button variant="ghost" block className="mt-3" onClick={() => { remove(ingredientId); onClose() }}>{t.missing.markOut}</Button>
            )}
          </section>

          <section>
            <h3 className="m-0 mb-3 text-[15px] font-semibold text-muted">{t.missing.orTry}</h3>
            {similar.length === 0 ? (
              <p className="m-0 text-muted">{t.missing.noSimilar}</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {similar.map((s) => (
                  <li key={s.drink.id}>
                    <button
                      type="button"
                      onClick={() => { onClose(); navigate(paths.drink(s.drink.id)) }}
                      className="card flex min-h-[72px] w-full items-center gap-3 px-3 py-2 text-left text-cream active:bg-surface-2"
                    >
                      <span className="flex w-[44px] shrink-0 justify-center"><GlassIcon glass={s.drink.glass} color={s.drink.color} size={36} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display block truncate text-[19px]">{s.drink.name}</span>
                        <span className="block text-[14px] text-muted">{reason(s.drink, l10n(s.reason, lang))}</span>
                      </span>
                      {s.feasible && <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-have" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </Sheet>
  )
}

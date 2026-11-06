import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { DrinkCard } from '../components/DrinkCard'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { Paywall } from '../components/Paywall'
import { useLang, useT } from '../i18n'
import { ingName } from '../lib/catalog'
import { checkDrink, drinksICanMake } from '../lib/pantry'
import { back, navigate, paths } from '../router'
import { usePantry, usePlan } from '../state/store'

type Tab = 'ready' | 'withSubs' | 'missingOne'

export default function CanMakeScreen() {
  const t = useT()
  const lang = useLang()
  const { isPro } = usePlan()
  const { pantry } = usePantry()
  const [tab, setTab] = useState<Tab>('ready')
  const res = useMemo(() => drinksICanMake(pantry), [pantry])

  const header = (
    <div className="flex items-center gap-1 px-2 pt-3">
      <button type="button" aria-label={t.state.back} onClick={() => back(paths.pantry)} className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-transparent text-cream"><Icon name="chevron-left" /></button>
      <h1 className="font-display m-0 text-[30px]">{t.canMake.title}</h1>
    </div>
  )
  if (!isPro) return <div>{header}<Paywall /></div>

  const tabs: { key: Tab; label: string; n: number }[] = [
    { key: 'ready', label: t.pantry.ready, n: res.ready.length },
    { key: 'withSubs', label: t.pantry.withSubs, n: res.withSubs.length },
    { key: 'missingOne', label: t.pantry.missingOne, n: res.missingOne.length },
  ]

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 bg-bg pb-3">
        {header}
        <div role="tablist" className="mx-4 mt-3 flex rounded-2xl border border-line bg-surface p-1">
          {tabs.map((x) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={tab === x.key}
              onClick={() => setTab(x.key)}
              className={`min-h-[48px] flex-1 rounded-xl border-0 px-1 text-[14.5px] font-semibold leading-tight transition-colors duration-150 ${tab === x.key ? 'bg-amber text-[#1A1005]' : 'bg-transparent text-muted'}`}
            >
              {x.label} <span style={{ fontVariantNumeric: 'tabular-nums' }}>{x.n}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4">
        {pantry.size === 0 ? (
          <EmptyState
            icon={<Icon name="bottle" size={28} />}
            title={t.canMake.title}
            hint={t.pantry.emptyCanMake}
            action={<Button variant="primary" size="lg" onClick={() => navigate(paths.pantry)}>{t.canMake.goPantry}</Button>}
          />
        ) : tab === 'missingOne' ? (
          res.missingOne.length ? (
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {res.missingOne.map(({ drink, missing }) => (
                <li key={drink.id}><DrinkCard drink={drink} extra={<span className="text-miss">{t.canMake.missingName(ingName(missing, lang))}</span>} /></li>
              ))}
            </ul>
          ) : <EmptyState title={t.canMake.nothing} />
        ) : (
          (tab === 'ready' ? res.ready : res.withSubs).length ? (
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {(tab === 'ready' ? res.ready : res.withSubs).map((d) => {
                const subs = tab === 'withSubs' ? checkDrink(d, pantry).subs : []
                return (
                  <li key={d.id}>
                    <DrinkCard drink={d} extra={subs.length ? <span className="text-amber">{subs.map((s) => t.canMake.withSub(ingName(s.from, lang), ingName(s.to, lang))).join(' · ')}</span> : undefined} />
                  </li>
                )
              })}
            </ul>
          ) : <EmptyState title={t.canMake.nothing} />
        )}
      </div>
    </div>
  )
}

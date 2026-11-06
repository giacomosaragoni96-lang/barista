import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { GlassIcon } from '../components/GlassIcon'
import { Icon } from '../components/Icon'
import { IngredientRow } from '../components/IngredientRow'
import { MissingSheet } from '../components/MissingSheet'
import { PaywallSheet } from '../components/Paywall'
import { ScaleStepper } from '../components/ScaleStepper'
import { StepList } from '../components/StepList'
import { UnitToggle } from '../components/UnitToggle'
import { useWakeLock } from '../hooks/useWakeLock'
import { l10n, useLang, useT } from '../i18n'
import { getSubstitutes } from '../lib/alternatives'
import { getDrink, ingName } from '../lib/catalog'
import { formatAmount } from '../lib/units'
import { back, navigate, paths, useRoute } from '../router'
import { useFavorites, usePantry, usePlan, useRecents, useSettings } from '../state/store'

function Badge({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <span title={title} className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[14.5px] text-cream">
      {children}
    </span>
  )
}

export default function DrinkScreen() {
  const t = useT()
  const lang = useLang()
  const { params } = useRoute()
  const drink = getDrink(params.id)
  const fav = useFavorites()
  const recents = useRecents()
  const settings = useSettings()
  const { isPro } = usePlan()
  const { pantry, has } = usePantry()

  const [scale, setScale] = useState(1)
  const [subs, setSubs] = useState<Record<string, string>>({})
  const [missing, setMissing] = useState<string[]>([])
  const [sheetFor, setSheetFor] = useState<string | null>(null)
  const [paywall, setPaywall] = useState(false)

  useWakeLock(true)
  const pushRecent = recents.push
  useEffect(() => { if (drink) pushRecent(drink.id) }, [drink, pushRecent])
  // nuova ricetta = sessione nuova
  useEffect(() => { setScale(1); setSubs({}); setMissing([]); setSheetFor(null) }, [params.id])

  const pantryOn = isPro && pantry.size > 0
  const steps = useMemo(() => {
    if (!drink) return []
    return drink.steps.map((s) => {
      let text = l10n(s, lang)
      for (const [from, to] of Object.entries(subs)) {
        const a = ingName(from, lang)
        const i = text.toLowerCase().indexOf(a.toLowerCase())
        if (a && i >= 0) text = text.slice(0, i) + ingName(to, lang) + text.slice(i + a.length)
      }
      return text
    })
  }, [drink, lang, subs])

  if (!drink) {
    return (
      <div>
        <TopBar />
        <EmptyState icon={<Icon name="search" size={28} />} title={t.drink.notFound}
          action={<Button variant="primary" size="lg" onClick={() => navigate(paths.search)}>{t.drink.backToSearch}</Button>} />
      </div>
    )
  }

  const subNote = (orig: string, subId: string) => {
    const n = getSubstitutes(orig).find((x) => x.ingredient.id === subId)?.note
    return n ? l10n(n, lang) : undefined
  }
  const isFav = fav.isFav(drink.id)
  const flames = Array.from({ length: 3 }, (_, i) => (
    <Icon key={i} name="flame" size={16} className={i < drink.difficulty ? 'text-amber' : 'text-line'} />
  ))

  const markMissing = (id: string) => { setMissing((m) => (m.includes(id) ? m : [...m, id])); setSheetFor(id) }
  const undo = (id: string) => {
    setMissing((m) => m.filter((x) => x !== id))
    setSubs((s) => { const n = { ...s }; delete n[id]; return n })
  }

  return (
    <div className="page-in pb-10">
      <TopBar
        right={
          <button
            type="button"
            aria-pressed={isFav}
            aria-label={isFav ? t.drink.favoriteRemove : t.drink.favoriteAdd}
            onClick={() => fav.toggle(drink.id)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-0 bg-transparent transition-colors duration-150 ${isFav ? 'text-amber' : 'text-cream'}`}
          >
            <Icon name={isFav ? 'star-filled' : 'star'} size={26} />
          </button>
        }
      />

      <header className="-mt-12 px-5 pt-12 text-center"
        style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, color-mix(in srgb, ${drink.color} 22%, transparent), transparent 75%)` }}>
        <div className="mx-auto mt-2 flex justify-center">
          <GlassIcon glass={drink.glass} color={drink.color} size={128} />
        </div>
        <h1 className="font-display mb-0 mt-3 text-[34px] leading-[1.08]">{drink.name}</h1>
        <p className="mx-auto mb-0 mt-2 max-w-[34ch] text-[17px] leading-snug text-muted">{l10n(drink.description, lang)}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Badge>{t.glass[drink.glass]}</Badge>
          <Badge>{drink.technique.map((x) => t.technique[x]).join(' + ')}</Badge>
          <Badge>{t.ice[drink.ice]}</Badge>
          <Badge><Icon name="clock" size={16} className="text-muted" />{drink.timeMin} {t.drink.min}</Badge>
          <Badge title={t.difficulty[drink.difficulty]}><span className="flex">{flames}</span><span className="sr-only">{t.difficulty[drink.difficulty]}</span></Badge>
          <Badge>{drink.abv}%</Badge>
        </div>
      </header>

      <div className="mt-7 flex items-center justify-between gap-3 px-4">
        <UnitToggle value={settings.units} onChange={settings.setUnits} />
        <ScaleStepper value={scale} onChange={setScale} locked={!isPro} onLockedTap={() => setPaywall(true)} />
      </div>

      <section className="mt-6 px-4" aria-labelledby="ing-h">
        <h2 id="ing-h" className="font-display m-0 mb-1 px-1 text-[24px]">{t.drink.ingredients}</h2>
        <ul className="card m-0 list-none px-3 py-1">
          {drink.ingredients.map((di, idx) => {
            const sub = subs[di.id]
            const shownId = sub ?? di.id
            const state = sub ? 'substituted' : missing.includes(di.id) ? 'missing' : 'normal'
            const amount = di.unit === 'top' ? t.drink.top : formatAmount(di.amount, di.unit, settings.units, scale, lang) || t.drink.toTaste
            return (
              <IngredientRow
                key={di.id + idx}
                amount={amount}
                name={ingName(shownId, lang)}
                note={di.note ? l10n(di.note, lang) : undefined}
                optional={di.optional}
                state={state}
                replacedName={sub ? ingName(di.id, lang) : undefined}
                substituteNote={sub ? subNote(di.id, sub) : undefined}
                pantryDot={pantryOn ? has(shownId) : undefined}
                onMissing={() => markMissing(di.id)}
                onUndo={() => undo(di.id)}
              />
            )
          })}
        </ul>
      </section>

      <section className="mt-7 px-4">
        <h2 className="font-display m-0 mb-2 px-1 text-[24px]">{t.drink.garnish}</h2>
        <p className="m-0 px-1 text-[18px]">{l10n(drink.garnish, lang)}</p>
      </section>

      <section className="mt-7 px-4" aria-labelledby="steps-h">
        <h2 id="steps-h" className="font-display m-0 mb-3 px-1 text-[24px]">{t.drink.steps}</h2>
        <StepList key={drink.id + lang} steps={steps} />
      </section>

      {drink.tip && (
        <aside className="mx-4 mt-7 rounded-[18px] border p-4"
          style={{ background: 'color-mix(in srgb, var(--color-amber) 9%, transparent)', borderColor: 'color-mix(in srgb, var(--color-amber) 35%, transparent)' }}>
          <div className="mb-1 flex items-center gap-2 font-semibold text-amber"><Icon name="sparkles" size={20} />{t.drink.tipTitle}</div>
          <p className="m-0 text-[17.5px] leading-snug">{l10n(drink.tip, lang)}</p>
        </aside>
      )}

      <p className="mx-6 mt-8 text-center text-[13.5px] text-muted">{t.settings.responsibly}</p>

      <MissingSheet
        open={sheetFor !== null}
        onClose={() => setSheetFor(null)}
        ingredientId={sheetFor}
        drink={drink}
        missing={missing}
        onUse={(subId) => sheetFor && setSubs((s) => ({ ...s, [sheetFor]: subId }))}
      />
      <PaywallSheet open={paywall} onClose={() => setPaywall(false)} />
    </div>
  )
}

function TopBar({ right }: { right?: React.ReactNode }) {
  const t = useT()
  return (
    <div className="relative z-10 flex items-center justify-between px-2 pt-3">
      <button type="button" aria-label={t.state.back} onClick={() => back(paths.search)}
        className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-transparent text-cream">
        <Icon name="chevron-left" size={26} />
      </button>
      {right}
    </div>
  )
}

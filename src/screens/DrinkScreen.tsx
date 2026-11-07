import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { GestureIcon } from '../components/GestureIcon'
import { GlassIcon } from '../components/GlassIcon'
import { Icon } from '../components/Icon'
import { IngredientRow } from '../components/IngredientRow'
import { MissingSheet } from '../components/MissingSheet'
import { ScaleStepper } from '../components/ScaleStepper'
import { StepList } from '../components/StepList'
import { UnitToggle } from '../components/UnitToggle'
import { useWakeLock } from '../hooks/useWakeLock'
import { l10n, useLang, useT } from '../i18n'
import { getSubstitutes } from '../lib/alternatives'
import { getDrink, ingName } from '../lib/catalog'
import { formatAmount } from '../lib/units'
import { back, navigate, paths, useRoute } from '../router'
import { useFavorites, usePantry, useRecents, useSettings } from '../state/store'

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
  const { pantry, has } = usePantry()

  const [scale, setScale] = useState(1)
  const [subs, setSubs] = useState<Record<string, string>>({})
  const [missing, setMissing] = useState<string[]>([])
  const [sheetFor, setSheetFor] = useState<string | null>(null)

  useWakeLock(true)
  const pushRecent = recents.push
  useEffect(() => { if (drink) pushRecent(drink.id) }, [drink, pushRecent])
  // nuova ricetta = sessione nuova
  useEffect(() => { setScale(1); setSubs({}); setMissing([]); setSheetFor(null) }, [params.id])

  const pantryOn = pantry.size > 0
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

  const ingredientNames = useMemo(
    () => (drink ? drink.ingredients.map((di) => ingName(subs[di.id] ?? di.id, lang)) : []),
    [drink, lang, subs],
  )

  // barra appiccicata: titolo visibile dopo l'header, sezione corrente evidenziata
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ingRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLElement>(null)
  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState<'ing' | 'steps' | null>(null)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const titleEl = titleRef.current
    const ingEl = ingRef.current
    const stepsEl = stepsRef.current
    const seen = { ing: false, steps: false }
    const pick = () => setActive(seen.steps ? 'steps' : seen.ing ? 'ing' : null)
    const o1 = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: '-90px 0px 0px 0px' })
    const o2 = new IntersectionObserver((es) => {
      for (const e of es) seen[e.target === stepsEl ? 'steps' : 'ing'] = e.isIntersecting
      pick()
    }, { rootMargin: '-110px 0px -55% 0px' })
    if (titleEl) o1.observe(titleEl)
    if (ingEl) o2.observe(ingEl)
    if (stepsEl) o2.observe(stepsEl)
    return () => { o1.disconnect(); o2.disconnect() }
  }, [drink?.id])
  const jump = (el: HTMLElement | null) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

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
      <nav className="recipe-bar" data-stuck={stuck} aria-label={t.drink.sectionNav}>
        <div className="flex items-center gap-2">
          <button type="button" aria-label={t.state.back} onClick={() => back(paths.search)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-cream">
            <Icon name="chevron-left" size={26} />
          </button>
          <button type="button" className="jump" aria-current={stuck && active === 'ing' ? 'true' : undefined} onClick={() => jump(ingRef.current)}>
            {t.drink.ingredients}
          </button>
          <button type="button" className="jump" aria-current={stuck && active === 'steps' ? 'true' : undefined} onClick={() => jump(stepsRef.current)}>
            {t.drink.steps}
          </button>
          <button
            type="button"
            aria-pressed={isFav}
            aria-label={isFav ? t.drink.favoriteRemove : t.drink.favoriteAdd}
            onClick={() => fav.toggle(drink.id)}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-0 bg-transparent transition-colors duration-150 ${isFav ? 'text-amber' : 'text-cream'}`}
          >
            <Icon name={isFav ? 'star-filled' : 'star'} size={26} />
          </button>
        </div>
        <div aria-hidden="true" className={`font-display h-5 truncate px-12 text-center text-[14.5px] leading-5 text-muted transition-opacity duration-150 ${stuck ? 'opacity-100' : 'opacity-0'}`}>
          {drink.name}
        </div>
      </nav>

      <header className="px-5 pt-1 text-center"
        style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, color-mix(in srgb, ${drink.color} 22%, transparent), transparent 75%)` }}>
        <div className="mx-auto flex justify-center">
          <GlassIcon glass={drink.glass} color={drink.color} size={128} />
        </div>
        <h1 ref={titleRef} className="t-recipe mb-0 mt-3">{drink.name}</h1>
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
        <ScaleStepper value={scale} onChange={setScale} />
      </div>

      <section ref={ingRef} className="recipe-section mt-8 px-4" aria-labelledby="ing-h">
        <SectionHead id="ing-h" icon={<Icon name="bottle" size={22} />} eyebrow={t.drink.eyebrowIngredients} title={t.drink.ingredients} />
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

      <section className="recipe-section mt-8 px-4" aria-labelledby="garn-h">
        <SectionHead id="garn-h" icon={<GestureIcon gesture="garnish" size={24} />} eyebrow={t.drink.eyebrowGarnish} title={t.drink.garnish} />
        <p className="t-body m-0 px-1">{l10n(drink.garnish, lang)}</p>
      </section>

      <section ref={stepsRef} className="recipe-section mt-8 px-4" aria-labelledby="steps-h">
        <SectionHead id="steps-h" icon={<GestureIcon gesture="stir" size={24} />} eyebrow={t.drink.eyebrowSteps} title={t.drink.steps} />
        <StepList key={drink.id + lang} steps={steps} ingredientNames={ingredientNames} />
      </section>

      {drink.tip && (
        <aside className="recipe-section mx-4 mt-8 rounded-[20px] border p-4" aria-labelledby="tip-h"
          style={{ background: 'color-mix(in srgb, var(--color-amber) 9%, transparent)', borderColor: 'color-mix(in srgb, var(--color-amber) 35%, transparent)' }}>
          <SectionHead id="tip-h" icon={<Icon name="sparkles" size={22} />} eyebrow={t.drink.eyebrowTip} title={t.drink.tip} />
          <p className="t-body m-0 px-1">{l10n(drink.tip, lang)}</p>
        </aside>
      )}

      <p className="t-note mx-6 mt-10 text-center !text-[13.5px]">{t.settings.responsibly}</p>

      <MissingSheet
        open={sheetFor !== null}
        onClose={() => setSheetFor(null)}
        ingredientId={sheetFor}
        drink={drink}
        missing={missing}
        onUse={(subId) => sheetFor && setSubs((s) => ({ ...s, [sheetFor]: subId }))}
      />
    </div>
  )
}

function SectionHead({ id, icon, eyebrow, title }: { id: string; icon: React.ReactNode; eyebrow: string; title: string }) {
  return (
    <div className="section-head">
      <span className="section-icon" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <p className="t-eyebrow m-0 mb-0.5">{eyebrow}</p>
        <h2 id={id} className="t-section">{title}</h2>
      </div>
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

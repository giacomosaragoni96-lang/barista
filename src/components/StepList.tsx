import { useMemo, useRef, useState } from 'react'
import { tap } from '../hooks/haptic'
import { useLang, useT } from '../i18n'
import { parseStep } from '../lib/steps'
import { GestureIcon } from './GestureIcon'
import { Icon } from './Icon'

export function StepList({ steps, ingredientNames }: { steps: string[]; ingredientNames: string[] }) {
  const t = useT()
  const lang = useLang()
  const [done, setDone] = useState<Set<number>>(new Set())
  const items = useMemo(() => steps.map((s) => parseStep(s, lang, ingredientNames)), [steps, lang, ingredientNames])
  const refs = useRef<(HTMLLIElement | null)[]>([])

  const total = steps.length
  const current = steps.findIndex((_, i) => !done.has(i))
  const allDone = total > 0 && current === -1
  const pct = total ? Math.round((done.size / total) * 100) : 0

  const toggle = (i: number) => {
    tap()
    const n = new Set(done)
    const marking = !n.delete(i)
    if (marking) n.add(i)
    setDone(n)
    if (marking) {
      // porta in vista il prossimo passo da fare
      const next = steps.findIndex((_, k) => !n.has(k))
      if (next >= 0) {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        requestAnimationFrame(() => refs.current[next]?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }))
      }
    }
  }

  return (
    <div>
      <div className="mb-3 px-1">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className={`text-[17px] font-bold ${allDone ? 'text-have' : 'text-cream'}`} aria-live="polite">
            {allDone ? t.drink.stepsAllDone : t.drink.stepOf(current + 1, total)}
          </span>
          {done.size > 0 && (
            <button type="button" className="btn btn-ghost !min-h-[48px] shrink-0 !px-4 !text-[15px]" onClick={() => setDone(new Set())}>
              {t.drink.restart}
            </button>
          )}
        </div>
        <div
          role="progressbar"
          aria-label={t.drink.stepsProgress}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done.size}
          className="h-2 overflow-hidden rounded-full bg-surface-2"
        >
          <div className={`step-bar h-full rounded-full ${allDone ? 'bg-have' : 'bg-amber'}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((it, i) => {
          const d = done.has(i)
          const cur = i === current
          return (
            <li key={i} ref={(el) => { refs.current[i] = el }} className="step-item">
              <button
                type="button"
                aria-pressed={d}
                aria-current={cur ? 'step' : undefined}
                onClick={() => toggle(i)}
                className={`step-card flex min-h-[72px] w-full items-start gap-3.5 rounded-[20px] border-[1.5px] px-3 py-3 text-left ${
                  d ? 'step-done border-line bg-transparent' : cur ? 'step-current border-amber bg-surface' : 'border-line bg-surface'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    d ? 'bg-have/15 text-have' : 'bg-surface-2 text-amber'
                  }`}
                >
                  {d ? <Icon name="check" size={28} strokeWidth={2.4} /> : <GestureIcon gesture={it.gesture} size={32} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="step-eyebrow truncate">{t.gesture[it.gesture]}</span>
                      {cur && <span className="step-now">{t.drink.stepNow}</span>}
                      {d && <span className="sr-only">{t.drink.stepDone}</span>}
                    </span>
                    <span className="font-display shrink-0 text-[15px] tabular-nums text-muted">{i + 1}<span className="sr-only"> / {total}</span></span>
                  </span>
                  <span className="step-text block">
                    {it.parts.map((p, k) => (p.bold ? <strong key={k} className={p.text.length <= 24 && /\d/.test(p.text) ? 'has-num' : undefined}>{p.text}</strong> : <span key={k}>{p.text}</span>))}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      {!allDone && done.size === 0 && <p className="m-0 mt-3 px-1 text-[14.5px] text-muted">{t.drink.stepsHint}</p>}
    </div>
  )
}

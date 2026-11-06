import { useState } from 'react'
import { useT } from '../i18n'
import { Icon } from './Icon'

export function StepList({ steps }: { steps: string[] }) {
  const t = useT()
  const [done, setDone] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setDone((d) => {
      const n = new Set(d)
      if (!n.delete(i)) n.add(i)
      return n
    })
  return (
    <div>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {steps.map((s, i) => {
          const d = done.has(i)
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={d}
                onClick={() => toggle(i)}
                className={`flex min-h-[64px] w-full items-start gap-3 rounded-2xl border border-line px-3 py-3 text-left transition-colors duration-150 ${d ? 'bg-transparent opacity-50' : 'bg-surface'}`}
              >
                <span className={`font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[20px] ${d ? 'bg-have text-[#0E1A0F]' : 'bg-surface-2 text-amber'}`}>
                  {d ? <Icon name="check" size={22} /> : i + 1}
                </span>
                <span className={`pt-1.5 text-[18.5px] leading-snug ${d ? 'line-through' : ''}`}>{s}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[14.5px] text-muted">{t.drink.stepsHint}</span>
        {done.size > 0 && (
          <button type="button" className="btn btn-ghost !min-h-[44px] shrink-0 !px-4" onClick={() => setDone(new Set())}>
            {t.drink.restart}
          </button>
        )}
      </div>
    </div>
  )
}

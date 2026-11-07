import { useT } from '../i18n'
import { Icon } from './Icon'

interface Props {
  value: number
  onChange: (n: number) => void
}

export function ScaleStepper({ value, onChange }: Props) {
  const t = useT()
  const step = (d: number) => onChange(Math.min(10, Math.max(1, value + d)))
  const btn = 'flex h-11 w-11 items-center justify-center rounded-xl border-0 bg-transparent text-cream disabled:opacity-30'
  return (
    <div role="group" aria-label={t.drink.multiplier} className="inline-flex items-center rounded-2xl border border-line bg-surface p-1">
      <button type="button" className={btn} aria-label={t.drink.less} disabled={value <= 1} onClick={() => step(-1)}>
        <Icon name="minus" size={20} />
      </button>
      <span
        className="flex min-w-[52px] items-center justify-center text-[18px] font-bold text-amber"
        style={{ fontVariantNumeric: 'tabular-nums' }}
        aria-live="polite"
      >
        ×{value}
      </span>
      <button type="button" className={btn} aria-label={t.drink.more} disabled={value >= 10} onClick={() => step(1)}>
        <Icon name="plus" size={20} />
      </button>
    </div>
  )
}

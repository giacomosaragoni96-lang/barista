import { useT } from '../i18n'
import { Icon } from './Icon'

interface Props {
  value: number
  onChange: (n: number) => void
  locked: boolean
  onLockedTap: () => void
}

export function ScaleStepper({ value, onChange, locked, onLockedTap }: Props) {
  const t = useT()
  const step = (d: number) => {
    if (locked) return onLockedTap()
    onChange(Math.min(10, Math.max(1, value + d)))
  }
  const btn = 'flex h-11 w-11 items-center justify-center rounded-xl border-0 bg-transparent text-cream disabled:opacity-30'
  return (
    <div role="group" aria-label={t.drink.multiplier} className="inline-flex items-center rounded-2xl border border-line bg-surface p-1">
      <button type="button" className={btn} aria-label={t.drink.less} disabled={!locked && value <= 1} onClick={() => step(-1)}>
        <Icon name="minus" size={20} />
      </button>
      <button
        type="button"
        onClick={() => locked && onLockedTap()}
        className="flex min-w-[52px] items-center justify-center gap-1.5 border-0 bg-transparent text-[18px] font-bold text-amber"
        style={{ fontVariantNumeric: 'tabular-nums' }}
        aria-live="polite"
      >
        {locked && <Icon name="lock" size={16} className="text-gold" />}×{value}
      </button>
      <button type="button" className={btn} aria-label={t.drink.more} disabled={!locked && value >= 10} onClick={() => step(1)}>
        <Icon name="plus" size={20} />
      </button>
    </div>
  )
}

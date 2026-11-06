import { useT } from '../i18n'

export interface SegmentedProps<T extends string> {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}

/** Controllo segmentato accessibile (radiogroup). */
export function Segmented<T extends string>({ value, options, onChange, label }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-2xl border border-line bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`min-h-[44px] min-w-[56px] rounded-xl border-0 px-3 text-[16px] font-semibold transition-colors duration-150 ${value === o.value ? 'bg-amber text-[#1A1005]' : 'bg-transparent text-muted'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

type U = 'ml' | 'cl' | 'oz'
export function UnitToggle({ value, onChange }: { value: U; onChange: (u: U) => void }) {
  const t = useT()
  return (
    <Segmented<U>
      label={t.settings.units}
      value={value}
      onChange={onChange}
      options={(['ml', 'cl', 'oz'] as const).map((u) => ({ value: u, label: t.units[u] }))}
    />
  )
}

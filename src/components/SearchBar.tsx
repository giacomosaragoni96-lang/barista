import { useEffect, useRef } from 'react'
import { useT } from '../i18n'
import { Icon } from './Icon'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
  placeholder: string
  autoFocus?: boolean
}

export function SearchBar({ value, onChange, onSubmit, placeholder, autoFocus }: Props) {
  const t = useT()
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (autoFocus) ref.current?.focus() }, [autoFocus])
  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => { e.preventDefault(); onSubmit?.() }}
    >
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" /></span>
      <input
        ref={ref}
        className="input !min-h-[56px] pr-12 text-[18px]"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label={t.search.clear}
          onClick={() => { onChange(''); ref.current?.focus() }}
          className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-muted"
        >
          <Icon name="x" />
        </button>
      )}
    </form>
  )
}

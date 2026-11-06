import type { ButtonHTMLAttributes } from 'react'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selected?: boolean
  onToggle?: () => void
}

/** Chip selezionabile (aria-pressed). */
export function Chip({ selected = false, onToggle, onClick, className = '', children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`chip ${className}`}
      aria-pressed={selected}
      onClick={(e) => { onClick?.(e); onToggle?.() }}
      {...rest}
    >
      {children}
    </button>
  )
}

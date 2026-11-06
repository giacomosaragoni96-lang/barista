import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'default'
  size?: 'md' | 'lg'
  block?: boolean
}

export function Button({ variant = 'default', size = 'md', block = false, className = '', type = 'button', ...rest }: Props) {
  const v = variant === 'default' ? '' : `btn-${variant}`
  return (
    <button
      type={type}
      className={`btn ${v} ${size === 'lg' ? 'btn-lg' : ''} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  )
}

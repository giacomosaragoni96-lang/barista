import { PRO_ENABLED } from '../config/features'
import { useT } from '../i18n'

export function ProBadge({ className = '' }: { className?: string }) {
  if (!PRO_ENABLED) return null
  const t = useT()
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 text-[11px] font-extrabold leading-[18px] tracking-wider ${className}`}
      style={{ background: '#2A2210', color: 'var(--color-gold)', border: '1px solid color-mix(in srgb, var(--color-gold) 55%, transparent)' }}
    >
      {t.pro.badge}
    </span>
  )
}

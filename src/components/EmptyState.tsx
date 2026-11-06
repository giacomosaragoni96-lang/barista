import type { ReactNode } from 'react'

interface Props {
  icon?: ReactNode
  title: string
  hint?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, hint, action }: Props) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <div className="relative mb-4 flex h-24 w-32 items-center justify-center">
        <svg viewBox="0 0 128 96" className="absolute inset-0 h-full w-full text-amber" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" opacity="0.55">
          <path d="M24 30v-8h8v8c4 3 6 6 6 10v40a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V40c0-4 2-7 6-10z" />
          <path d="M18 54h20" />
          <path d="M70 26h44l-22 26z M92 52v26 M82 80h20" />
          <path d="M76 31h32l-16 19z" fill="currentColor" fillOpacity="0.25" stroke="none" />
        </svg>
        {icon && <span className="relative mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg text-amber" style={{ left: -4 }}>{icon}</span>}
      </div>
      <h2 className="font-display m-0 text-[24px]">{title}</h2>
      {hint && <p className="mb-0 mt-2 max-w-[30ch] text-muted">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

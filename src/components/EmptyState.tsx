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
      {icon && <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface text-amber">{icon}</div>}
      <h2 className="font-display m-0 text-[24px]">{title}</h2>
      {hint && <p className="mb-0 mt-2 max-w-[30ch] text-muted">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

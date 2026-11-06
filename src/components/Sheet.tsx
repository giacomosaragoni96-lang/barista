import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '../i18n'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/** Pannello dal basso: overlay, Esc, tocco fuori, trascinamento maniglia, scroll body bloccato. */
export function Sheet({ open, onClose, title, children }: Props) {
  const t = useT()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)
  const [dy, setDy] = useState(0)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      prevFocus?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const down = (e: PointerEvent) => { startY.current = e.clientY; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }
  const move = (e: PointerEvent) => { if (startY.current !== null) setDy(Math.max(0, e.clientY - startY.current)) }
  const up = () => {
    if (startY.current === null) return
    startY.current = null
    if (dy > 90) onClose()
    setDy(0)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ animation: 'fade-in 180ms ease-out' }}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : t.state.close}
        tabIndex={-1}
        className="relative flex max-h-[88dvh] w-full max-w-[480px] flex-col border border-b-0 border-line bg-surface outline-none"
        style={{
          borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0',
          transform: dy ? `translateY(${dy}px)` : undefined,
          transition: startY.current === null ? 'transform 180ms ease-out' : 'none',
          animation: 'sheet-in 220ms cubic-bezier(.2,.8,.2,1)',
          paddingBottom: 'var(--sab)',
        }}
      >
        <div
          className="flex shrink-0 cursor-grab touch-none justify-center pb-2 pt-3"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        >
          <span className="h-1.5 w-12 rounded-full bg-line" />
        </div>
        {title && <h2 id={titleId} className="font-display m-0 px-5 pb-2 text-[24px]">{title}</h2>}
        <div className="scroll-area min-h-0 flex-1 px-5 pb-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

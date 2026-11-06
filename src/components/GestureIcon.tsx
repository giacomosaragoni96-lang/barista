import type { ReactNode } from 'react'
import type { Gesture } from '../lib/steps'

/** Riempimento parziale: dà corpo al disegno senza appesantire il tratto. */
const F = { fill: 'currentColor', fillOpacity: 0.24 } as const
const F2 = { fill: 'currentColor', fillOpacity: 0.45 } as const
const dot = (cx: number, cy: number, r = 1) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />

/** Shaker (cobbler) in verticale, centrato su (16,16); chi lo usa lo ruota. */
const shakerBody = (filled: boolean) => (
  <>
    <path d="M12.5 7.5 V5.5 Q12.5 2.5 16 2.5 Q19.5 2.5 19.5 5.5 V7.5" />
    <path d="M10 7.5 H22 L20.4 27 Q20.3 29 18.5 29 H13.5 Q11.7 29 11.6 27 Z" {...(filled ? F : {})} />
    <path d="M10.7 14.5 H21.3" />
  </>
)
const motionArcs = (
  <>
    <path d="M5 10.5 Q2.8 16 5 21.5" />
    <path d="M27 10.5 Q29.2 16 27 21.5" />
  </>
)

/** Colino Hawthorne visto di lato: disco con fori. */
const strainerDisc = (cy: number, holes: boolean) => (
  <>
    <ellipse cx={14} cy={cy} rx={9} ry={3.2} {...F} />
    {holes && <>{dot(10, cy)}{dot(14, cy)}{dot(18, cy)}</>}
  </>
)

const ICONS: Record<Gesture, ReactNode> = {
  chill: (
    <>
      <path d="M16 3.5 V19.5 M9.1 7.5 L22.9 15.5 M9.1 15.5 L22.9 7.5" />
      <path d="M13.3 5.4 L16 8 L18.7 5.4 M13.3 17.6 L16 15 L18.7 17.6" />
      <path d="M7.5 22.5 H24.5 C24.5 27.5 20.6 29.5 16 29.5 C11.4 29.5 7.5 27.5 7.5 22.5 Z" {...F} />
    </>
  ),
  ice: (
    <>
      <rect x={3.5} y={17} width={12} height={12} rx={3} transform="rotate(-8 9.5 23)" {...F} />
      <rect x={17} y={17.5} width={11.5} height={11.5} rx={3} transform="rotate(9 22.7 23.2)" {...F} />
      <rect x={9.5} y={3.5} width={12} height={12} rx={3} transform="rotate(12 15.5 9.5)" {...F} />
      <path d="M6.5 21 L6.2 24 M20 21.5 L20.6 24.2 M13 7.5 L13.6 10.3" strokeWidth={1.4} />
    </>
  ),
  pour: (
    <>
      <g transform="rotate(38 12 12)">
        <path d="M4.5 7 H13.5 C15.5 7 16.5 9 19.5 10 V14 C16.5 15 15.5 17 13.5 17 H4.5 Q2 17 2 14.5 V9.5 Q2 7 4.5 7 Z" {...F} />
        <path d="M19.5 9.4 V14.6 M6 9.8 V14.2" />
      </g>
      <path d="M19.2 19 V24.5" />
      <path d="M14 23 H27 L25.9 28.6 Q25.7 30 24.3 30 H16.7 Q15.3 30 15.1 28.6 Z" {...F} />
    </>
  ),
  shake: (
    <>
      <g transform="rotate(24 16 16)">{shakerBody(true)}</g>
      {motionArcs}
    </>
  ),
  'dry-shake': (
    <>
      <g transform="rotate(24 16 16)">{shakerBody(false)}</g>
      {motionArcs}
      <path d="M22.5 22.5 L28 28 M28 22.5 L22.5 28" strokeWidth={2.4} />
    </>
  ),
  stir: (
    <>
      <path d="M7 13 H25 L23.4 28 Q23.2 29.7 21.5 29.7 H10.5 Q8.8 29.7 8.6 28 Z" {...F} />
      <path d="M26.5 4 L16 22.5" />
      <ellipse cx={15} cy={24} rx={2.3} ry={3.3} transform="rotate(30 15 24)" fill="currentColor" fillOpacity={0.5} />
      <path d="M4.2 11 Q3.6 5.6 9.2 4.4" />
      <path d="M7 2.2 L9.4 4.4 L7.2 6.8" />
    </>
  ),
  strain: (
    <>
      <path d="M5 18 H27 L16 29.5 Z" {...F} />
      {strainerDisc(12.5, true)}
      <path d="M22.5 10.8 L29.5 6.2" />
      <path d="M14 22 V22.2 M18.5 21.5 V21.7 M16 25.2 V25.4" strokeWidth={2.4} />
      <path d="M11 15.2 V16.4 M17 15.2 V16.4" strokeWidth={1.6} />
    </>
  ),
  'double-strain': (
    <>
      <path d="M5 19 H27 L16 29.5 Z" {...F} />
      {strainerDisc(6, false)}
      <path d="M22.5 4.6 L29.5 2" />
      <ellipse cx={14} cy={13} rx={6.2} ry={2.3} {...F2} />
      <path d="M10.5 13 H17.5 M14 11.3 V14.7" strokeWidth={1.2} />
      <path d="M14 22.6 V22.8 M18.5 22.2 V22.4" strokeWidth={2.4} />
    </>
  ),
  muddle: (
    <>
      <path d="M7.5 13 L9.4 28.4 Q9.6 30 11.2 30 H20.8 Q22.4 30 22.6 28.4 L24.5 13" />
      <rect x={14} y={1.5} width={4} height={15} rx={2} {...F} />
      <path d="M12.8 16.5 H19.2 L19 22 H13 Z" {...F2} />
      <path d="M10.4 27.6 Q10.6 23.8 14 23.8 Q14.2 27.4 10.4 27.6 Z M21.6 27.6 Q21.4 23.8 18 23.8 Q17.8 27.4 21.6 27.6 Z" {...F2} strokeWidth={1.5} />
    </>
  ),
  blend: (
    <>
      <path d="M15 2.5 H17" />
      <path d="M8 5.5 H24 L21.6 21 H10.4 Z" {...F} />
      <path d="M10.8 12 Q13.4 10 16 12 Q18.6 14 21.2 12" strokeWidth={1.6} />
      <path d="M12.6 18 L19.4 16.2 M13 15.6 L19 18.6" strokeWidth={1.6} />
      <path d="M9 21 H23 V28 Q23 29.8 21.2 29.8 H10.8 Q9 29.8 9 28 Z" />
      <circle cx={16} cy={25.4} r={1.7} />
    </>
  ),
  top: (
    <>
      <path d="M7.5 5 L9.4 28.4 Q9.6 30 11.2 30 H20.8 Q22.4 30 22.6 28.4 L24.5 5" />
      <path d="M8.5 13 Q12 10.6 16 13 Q20 15.4 23.5 13 L22.6 28.4 Q22.4 29 20.8 29 H11.2 Q9.6 29 9.4 28.4 Z" fill="currentColor" fillOpacity={0.24} strokeWidth={0} />
      <path d="M8.5 13 Q12 10.6 16 13 Q20 15.4 23.5 13" strokeWidth={1.8} />
      <path d="M16 26 V17.5 M12.6 20.5 L16 17.2 L19.4 20.5" />
      <path d="M27.5 24 V14 M25.2 16.2 L27.5 13.8 L29.8 16.2" strokeWidth={1.7} />
      {dot(12.5, 25, 1.1)}{dot(20.5, 23.5, 1.1)}
    </>
  ),
  layer: (
    <>
      <path d="M9.6 14 H22.4 L22.6 19.4 H9.4 Z" fill="currentColor" fillOpacity={0.55} stroke="none" />
      <path d="M9.4 19.4 H22.6 L22.8 24.4 H9.2 Z" fill="currentColor" fillOpacity={0.3} stroke="none" />
      <path d="M9.2 24.4 H22.8 L22.9 27.8 Q22.9 29.5 21.3 29.5 H10.7 Q9.1 29.5 9.1 27.8 Z" fill="currentColor" fillOpacity={0.14} stroke="none" />
      <path d="M7.8 8 L9.2 27.6 Q9.4 29.5 11 29.5 H21 Q22.6 29.5 22.8 27.6 L24.2 8" />
      <path d="M9.3 19.4 H22.7 M9.2 24.4 H22.8" strokeWidth={1.2} />
      <path d="M30 2.8 L19.8 10.2" />
      <ellipse cx={17.6} cy={12} rx={3.4} ry={1.8} transform="rotate(36 17.6 12)" {...F2} />
    </>
  ),
  garnish: (
    <>
      <path d="M3.5 28.5 L26.5 5.5" />
      <circle cx={28} cy={4} r={1.7} fill="currentColor" />
      <circle cx={15.5} cy={16.5} r={8.5} {...F} />
      <circle cx={15.5} cy={16.5} r={5.9} strokeWidth={1.4} />
      <path d="M15.5 10.6 V22.4 M10.3 13.5 L20.7 19.5 M10.3 19.5 L20.7 13.5" strokeWidth={1.3} />
    </>
  ),
  express: (
    <>
      <path d="M3.5 9 C6.5 2.8 18.5 3.2 25 10.5 C18.8 8.4 9.8 9.6 3.5 9 Z" {...F} />
      <path d="M6 8 C10 6.4 15 6.8 19 8.6" strokeWidth={1.3} />
      <path d="M14.6 12.4 V16.4 M10.4 11.6 L8.4 15.2 M19 12.6 L21.4 15.8" />
      {dot(11.8, 18.4, 1)}{dot(17.4, 19, 1)}
      <path d="M7 22.5 H25 C25 27.4 21 29.8 16 29.8 C11 29.8 7 27.4 7 22.5 Z" {...F} />
    </>
  ),
  rim: (
    <>
      <path d="M4.5 10.5 H27.5 C27.5 18.5 22.5 21.5 16 21.5 C9.5 21.5 4.5 18.5 4.5 10.5 Z" {...F} />
      <path d="M16 21.5 V28.5 M10 29.8 H22" />
      <path d="M4.5 10.5 H27.5" strokeWidth={3.4} />
      {dot(6.8, 6.4)}{dot(10.6, 5)}{dot(14.2, 6.6)}{dot(18, 5)}{dot(21.6, 6.6)}{dot(25.2, 5.2)}
    </>
  ),
  flame: (
    <>
      <path d="M16 2.5 C16.8 8.8 7.5 12.2 7.5 20.3 A8.5 8.5 0 0 0 24.5 20.3 C24.5 17.4 23.4 15.6 22 14 C21.6 17 20 18.3 18.6 18.5 C19.6 13.4 17.4 7 16 2.5 Z" {...F} />
      <path d="M16 29 C13 29 11.8 26.8 12.4 24.6 C13 22.6 14.8 22 15.2 20 C17.4 21.4 19.8 23.2 19.8 25.8 C19.8 27.6 18 29 16 29 Z" fill="currentColor" fillOpacity={0.7} />
    </>
  ),
  heat: (
    <>
      <path d="M5.5 14.5 H22.5 V21 Q22.5 28.5 15.5 28.5 H12.5 Q5.5 28.5 5.5 21 Z" {...F} />
      <path d="M22.5 16.5 H25 Q28.5 16.5 28.5 20 Q28.5 23.5 25 23.5 H21.8" />
      <path d="M9.5 3 Q7.5 5.6 9.5 8 Q11.5 10.4 9.5 12 M14.5 2.5 Q12.5 5.4 14.5 8 Q16.5 10.6 14.5 12.2 M19.5 3 Q17.5 5.6 19.5 8 Q21.5 10.4 19.5 12" strokeWidth={1.7} />
    </>
  ),
  whip: (
    <g transform="rotate(-32 16 16)">
      <rect x={14} y={1.5} width={4} height={10.5} rx={2} {...F2} />
      <path d="M16 12 C5.5 14 5.5 27.5 16 30 C26.5 27.5 26.5 14 16 12 Z" {...F} />
      <path d="M16 12 C10.8 15 10.8 26.8 16 30 C21.2 26.8 21.2 15 16 12 Z M16 12 V30" strokeWidth={1.5} />
    </g>
  ),
  serve: (
    <>
      <path d="M10.5 2.5 H21.5 C21.5 8 19 11 16 11 C13 11 10.5 8 10.5 2.5 Z" {...F} />
      <path d="M16 11 V16.6 M12.4 17 H19.6" />
      <path d="M3.5 20.5 H28.5" strokeWidth={2.4} />
      <path d="M2.5 30 L8.5 26.4 Q10 25.5 11.8 25.5 H19.5 Q22 25.5 22 27.3 Q22 29 19.5 29 H14.5" />
      <path d="M14.5 25.5 L19 23.8 Q21.5 23.2 22.6 24.4" strokeWidth={1.6} />
      {dot(26, 8, 0.9)}{dot(5.5, 9, 0.9)}
    </>
  ),
  other: (
    <>
      <circle cx={26.5} cy={5.5} r={2.2} {...F2} />
      <path d="M25 7 L10.5 21.5" />
      <path d="M21.6 9.4 L24 11.8 M18.6 12.4 L21 14.8 M15.6 15.4 L18 17.8" strokeWidth={1.4} />
      <ellipse cx={8.2} cy={23.8} rx={3.1} ry={4.7} transform="rotate(45 8.2 23.8)" {...F} />
    </>
  ),
}

export function GestureIcon({ gesture, size = 28, className }: { gesture: Gesture; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      {ICONS[gesture] ?? ICONS.other}
    </svg>
  )
}

import { useId, type ReactNode } from 'react'
import type { Glass } from '../data/types'

interface Spec {
  /** sagoma chiusa del vetro (riempita appena + tratto) */
  body: string
  /** linee aperte: stelo, base, manico */
  lines?: string
  /** area chiusa del liquido */
  liquid: string
  /** riflesso (linea aperta chiara) */
  shine?: string
  /** dettagli sopra al liquido */
  extra?: ReactNode
}

const STEM = 'M32 40 V64 M21 66 Q32 62.5 43 66'
const bubbles = (pts: [number, number][]) =>
  pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.1} fill="none" stroke="#F5EBDD" strokeOpacity={0.45} strokeWidth={0.9} />)
const ice = (x: number, y: number, s: number, r = 0) => (
  <rect x={x} y={y} width={s} height={s} rx={2.5} transform={`rotate(${r} ${x + s / 2} ${y + s / 2})`}
    fill="#F5EBDD" fillOpacity={0.14} stroke="#F5EBDD" strokeOpacity={0.5} strokeWidth={1} />
)

const SPECS: Record<Glass, Spec> = {
  coupe: {
    body: 'M10 14 H54 C54 30 44 38 32 38 C20 38 10 30 10 14 Z',
    lines: 'M32 38 V64 M21 66 Q32 62.5 43 66',
    liquid: 'M12.4 18 H51.6 C50.4 29 42 35 32 35 C22 35 13.6 29 12.4 18 Z',
    shine: 'M15.5 21 C17 27 20 30.5 24 32.5',
  },
  martini: {
    body: 'M8 12 H56 L32 42 Z',
    lines: 'M32 42 V64 M21 66 Q32 62.5 43 66',
    liquid: 'M12 17 H52 L33.6 40 H30.4 Z',
    shine: 'M16 20.5 L26 33',
    extra: <g stroke="#6FBF73" strokeWidth={1.4} strokeLinecap="round"><path d="M40 6 L26 30" stroke="#F5EBDD" strokeOpacity={0.7} /><ellipse cx={24.6} cy={28.8} rx={2.6} ry={1.7} transform="rotate(-50 24.6 28.8)" fill="#6FBF73" fillOpacity={0.75} stroke="none" /></g>,
  },
  'nick-nora': {
    body: 'M14 14 H50 C50 32 42 42 32 42 C22 42 14 32 14 14 Z',
    lines: 'M32 42 V64 M21 66 Q32 62.5 43 66',
    liquid: 'M15.4 20 H48.6 C47.5 33 41 39.5 32 39.5 C23 39.5 16.5 33 15.4 20 Z',
    shine: 'M18.5 24 C19.5 30 22.5 34 26 36',
  },
  rocks: {
    body: 'M12 24 H52 L49.4 65.5 Q49.2 68 46.6 68 H17.4 Q14.8 68 14.6 65.5 Z',
    liquid: 'M13 38 H51 L49.2 64.5 H14.8 Z',
    shine: 'M17 42 L16.4 60',
    extra: <>{ice(22, 43, 12, -8)}{ice(34, 49, 11, 10)}</>,
  },
  'double-rocks': {
    body: 'M7 26 H57 L53.6 65 Q53.4 68 50.4 68 H13.6 Q10.6 68 10.4 65 Z',
    liquid: 'M8 36 H56 L53.7 63.5 H10.3 Z',
    shine: 'M13 40 L12 60',
    extra: <>{ice(17, 41, 14, -6)}{ice(32, 46, 14, 8)}</>,
  },
  highball: {
    body: 'M16 8 H48 L46.5 68 Q46.4 70 44.5 70 H19.5 Q17.6 70 17.5 68 Z',
    liquid: 'M16.4 22 H47.6 L46.4 67.5 H17.6 Z',
    shine: 'M20.5 28 L20.1 62',
    extra: bubbles([[27, 56], [35, 47], [30, 38], [38, 32], [26, 28], [37, 60]]),
  },
  collins: {
    body: 'M19 4 H45 L44.1 74 Q44.1 76 42.2 76 H21.8 Q19.9 76 19.9 74 Z',
    liquid: 'M19.2 18 H44.8 L44.1 73 H19.9 Z',
    shine: 'M23 24 L22.6 68',
    extra: bubbles([[28, 62], [36, 52], [30, 42], [37, 34], [27, 28], [34, 66]]),
  },
  flute: {
    body: 'M24 6 H40 L39 30 C39 38 36 42 32 42 C28 42 25 38 25 30 Z',
    lines: 'M32 42 V64 M21 66 Q32 62.5 43 66',
    liquid: 'M24.3 14 H39.7 L39 30 C39 37 36 40 32 40 C28 40 25 37 25 30 Z',
    shine: 'M27 18 L26.6 31',
    extra: bubbles([[31, 34], [34, 27], [30, 22], [35, 18]]),
  },
  wine: {
    body: 'M17 8 H47 C47 26 42 40 32 40 C22 40 17 26 17 8 Z',
    lines: STEM,
    liquid: 'M18.6 24 H45.4 C44.2 33 40 38 32 38 C24 38 19.8 33 18.6 24 Z',
    shine: 'M21 27 C22 31 24 34 27 35.5',
  },
  'copper-mug': {
    body: 'M14 16 H46 L44 64 Q43.9 66 42 66 H18 Q16.1 66 16 64 Z',
    lines: 'M46 24 H52 Q58 24 58 32 V44 Q58 52 52 52 H45 M14.4 24 H45.6',
    liquid: 'M14.4 24 H45.6 L43.9 63.5 H16.1 Z',
    shine: 'M19 30 L18.4 58',
    extra: <path d="M40 8 L32 20" stroke="#6FBF73" strokeWidth={2.2} strokeLinecap="round" />,
  },
  hurricane: {
    body: 'M18 6 H46 C46 18 54 24 54 34 C54 46 38 50 36 56 V64 H28 V56 C26 50 10 46 10 34 C10 24 18 18 18 6 Z',
    lines: 'M21 68 Q32 64.5 43 68',
    liquid: 'M16.2 20 C14 24 10.6 28 10.2 34 C10.2 44 25 47.5 27.8 54 H36.2 C39 47.5 53.8 44 53.8 34 C53.4 28 50 24 47.8 20 Z',
    shine: 'M15 34 C15 39 20 42 24 44',
  },
  tiki: {
    body: 'M16 10 H48 V62 Q48 70 40 70 H24 Q16 70 16 62 Z',
    lines: 'M16 18 H48 M16 62 H48',
    liquid: 'M16 26 H48 V62 Q48 70 40 70 H24 Q16 70 16 62 Z',
    shine: 'M20 31 V56',
    extra: (
      <g fill="none" stroke="#F5EBDD" strokeOpacity={0.75} strokeWidth={1.6} strokeLinecap="round">
        <path d="M22 36 L28 38 M42 36 L36 38" /><circle cx={26} cy={42} r={2.4} /><circle cx={38} cy={42} r={2.4} />
        <path d="M26 52 Q32 57 38 52" />
      </g>
    ),
  },
  shot: {
    body: 'M19 30 H45 L42 65 Q41.8 68 39 68 H25 Q22.2 68 22 65 Z',
    liquid: 'M19.6 38 H44.4 L41.8 64.5 H22.2 Z',
    shine: 'M23 42 L22.6 60',
  },
  julep: {
    body: 'M14 18 H50 L46.4 62 Q46.2 64 44.2 64 H19.8 Q17.8 64 17.6 62 Z',
    lines: 'M32 64 V68 M21 70 Q32 67.5 43 70 M14.5 24 H49.5',
    liquid: 'M14.5 24 H49.5 L46.3 61.5 H17.7 Z',
    shine: 'M19 30 L18 56',
    extra: (
      <g fill="#6FBF73" fillOpacity={0.85}>
        <ellipse cx={26} cy={14} rx={6} ry={3.2} transform="rotate(-25 26 14)" />
        <ellipse cx={36} cy={12} rx={6} ry={3.2} transform="rotate(20 36 12)" />
        <ellipse cx={31} cy={9} rx={4.5} ry={2.6} transform="rotate(-80 31 9)" />
        <circle cx={26} cy={40} r={1.3} fill="#F5EBDD" fillOpacity={0.4} /><circle cx={37} cy={46} r={1.3} fill="#F5EBDD" fillOpacity={0.4} /><circle cx={30} cy={52} r={1.3} fill="#F5EBDD" fillOpacity={0.4} />
      </g>
    ),
  },
  'irish-coffee': {
    body: 'M16 14 H48 C48 34 42 46 32 46 C22 46 16 34 16 14 Z',
    lines: 'M47 20 H52 Q58 20 58 28 Q58 36 49 38 M32 46 V60 M23 62 Q32 59 41 62',
    liquid: 'M17.2 26 H46.8 C45.5 37 40 43.5 32 43.5 C24 43.5 18.5 37 17.2 26 Z',
    shine: 'M20 31 C21 36 23 39 26 41',
    extra: <path d="M16.6 17 Q24 13.5 32 16 Q40 13.5 47.4 17 L47.1 26 H16.9 Z" fill="#F5EBDD" fillOpacity={0.92} />,
  },
  balloon: {
    body: 'M22 10 H42 C42 14 54 22 54 38 C54 50 44 58 32 58 C20 58 10 50 10 38 C10 22 22 14 22 10 Z',
    lines: 'M32 58 V64 M21 66 Q32 62.5 43 66',
    liquid: 'M10.2 40 H53.8 C53 50 44 56.5 32 56.5 C20 56.5 11 50 10.2 40 Z',
    shine: 'M14 44 C16 49 20 52 24 53.5',
    extra: <>{ice(24, 38, 10, -8)}{ice(34, 41, 9, 12)}</>,
  },
  margarita: {
    body: 'M8 12 H56 C55 20 48 25 43 27 C43 33 40 38 32 38 C24 38 21 33 21 27 C16 25 9 20 8 12 Z',
    lines: 'M32 38 V64 M21 66 Q32 62.5 43 66',
    liquid: 'M10 16 H54 C53 20.5 48 24.5 42.5 26.5 C42.5 31.5 39 36 32 36 C25 36 21.5 31.5 21.5 26.5 C16 24.5 11 20.5 10 16 Z',
    shine: 'M14 18.5 C17 21 20 23 22 24',
    extra: <path d="M8.5 11.6 H55.5" stroke="#F5EBDD" strokeWidth={3} strokeDasharray="0.1 3" strokeLinecap="round" />,
  },
  beer: {
    body: 'M12 8 H44 V62 Q44 68 38 68 H18 Q12 68 12 62 Z',
    lines: 'M44 18 H50 Q58 18 58 28 V44 Q58 54 50 54 H44',
    liquid: 'M13 22 H43 V62 Q43 67 38 67 H18 Q13 67 13 62 Z',
    shine: 'M17 28 V60',
    extra: <path d="M13 22 V13 Q15 8.5 20 11 Q24 7 28 10 Q33 7 37 10 Q41 8 43 13 V22 Z" fill="#F5EBDD" fillOpacity={0.92} />,
  },
}

export interface GlassIconProps {
  glass: Glass
  /** colore del liquido (hex) */
  color: string
  size?: number
  className?: string
}

export function GlassIcon({ glass, color, size = 96, className }: GlassIconProps) {
  const s = SPECS[glass]
  const gid = 'lq' + useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 64 80" width={size} height={size * 1.25} className={className} aria-hidden="true" focusable="false"
      strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.1} />
          <stop offset="1" stopColor="#000" stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <path d={s.body} fill="#F5EBDD" fillOpacity={0.05} />
      <path d={s.liquid} fill={color} fillOpacity={0.92} />
      <path d={s.liquid} fill={`url(#${gid})`} />
      {s.extra}
      {s.shine && <path d={s.shine} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={1.6} />}
      <path d={s.body} fill="none" stroke="#F5EBDD" strokeWidth={1.8} />
      {s.lines && <path d={s.lines} fill="none" stroke="#F5EBDD" strokeWidth={1.8} />}
    </svg>
  )
}

export const ALL_GLASSES = Object.keys(SPECS) as Glass[]

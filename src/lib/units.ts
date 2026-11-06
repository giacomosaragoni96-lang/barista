import type { Lang, Unit } from '../data/types'

export type UnitSystem = 'ml' | 'cl' | 'oz'

/** [singolare, plurale] per lingua */
const NAMES: Record<Exclude<Unit, 'ml'>, Record<Lang, [string, string]>> = {
  dash: { it: ['dash', 'dash'], en: ['dash', 'dashes'] },
  drop: { it: ['goccia', 'gocce'], en: ['drop', 'drops'] },
  barspoon: { it: ['bar spoon', 'bar spoon'], en: ['bar spoon', 'bar spoons'] },
  tsp: { it: ['cucchiaino', 'cucchiaini'], en: ['tsp', 'tsp'] },
  g: { it: ['g', 'g'], en: ['g', 'g'] },
  piece: { it: ['pz', 'pz'], en: ['pc', 'pcs'] },
  slice: { it: ['fetta', 'fette'], en: ['slice', 'slices'] },
  wedge: { it: ['spicchio', 'spicchi'], en: ['wedge', 'wedges'] },
  leaf: { it: ['foglia', 'foglie'], en: ['leaf', 'leaves'] },
  sprig: { it: ['rametto', 'rametti'], en: ['sprig', 'sprigs'] },
  pinch: { it: ['pizzico', 'pizzichi'], en: ['pinch', 'pinches'] },
  top: { it: ['colmare', 'colmare'], en: ['top up', 'top up'] },
}

function num(n: number, lang: Lang, step: number): string {
  const r = Math.round(n / step) * step
  const s = String(Math.round(r * 100) / 100)
  return lang === 'it' ? s.replace('.', ',') : s
}

export function formatAmount(
  amount: number | undefined,
  unit: Unit,
  system: UnitSystem,
  scale: number,
  lang: Lang,
): string {
  if (unit === 'top') return NAMES.top[lang][0]
  if (amount === undefined || amount === null) return ''
  const v = amount * scale
  if (unit === 'ml') {
    if (system === 'cl') return `${num(v / 10, lang, 0.05)} cl`
    if (system === 'oz') return `${num(v / 30, lang, 0.25)} oz`
    return `${num(v, lang, 0.5)} ml`
  }
  const [one, many] = NAMES[unit][lang]
  const text = num(v, lang, unit === 'g' ? 1 : 0.25)
  return `${text} ${Math.abs(v - 1) < 1e-9 ? one : many}`
}

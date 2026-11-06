import type { Lang } from '../data/types'

/**
 * Analisi di un passaggio di ricetta (testo libero it/en):
 * - sceglie il gesto da mostrare come icona;
 * - spezza il testo in segmenti, con grassetto solo su parola chiave del gesto,
 *   numeri con unita' o tempi e nomi di ingredienti.
 * Funzione pura, senza dipendenze UI. Non solleva mai eccezioni.
 */

export type Gesture =
  | 'chill'
  | 'ice'
  | 'pour'
  | 'shake'
  | 'dry-shake'
  | 'stir'
  | 'strain'
  | 'double-strain'
  | 'muddle'
  | 'blend'
  | 'top'
  | 'layer'
  | 'garnish'
  | 'express'
  | 'rim'
  | 'flame'
  | 'heat'
  | 'whip'
  | 'serve'
  | 'other'

export const GESTURES: Gesture[] = [
  'chill',
  'ice',
  'pour',
  'shake',
  'dry-shake',
  'stir',
  'strain',
  'double-strain',
  'muddle',
  'blend',
  'top',
  'layer',
  'garnish',
  'express',
  'rim',
  'flame',
  'heat',
  'whip',
  'serve',
  'other',
]

export type StepPart = { text: string; bold: boolean }

// ---------------------------------------------------------------------------
// Normalizzazione che conserva le posizioni
// ---------------------------------------------------------------------------

type Folded = {
  /** testo minuscolo, senza accenti (segni combinanti rimossi) */
  f: string
  /** indice nel testo foldato -> indice nel testo originale (null = identita') */
  map: number[] | null
}

const ASCII_ONLY = /^[\x00-\x7f]*$/
const COMBINING = /[̀-ͯ]/

function fold(text: string): Folded {
  if (ASCII_ONLY.test(text)) return { f: text.toLowerCase(), map: null }
  let f = ''
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const d = c.normalize('NFD')
    let ch = d[0] ?? c
    if (COMBINING.test(ch)) continue // segno combinante isolato: sparisce
    ch = ch.toLowerCase()
    ch = ch[0] ?? c
    f += ch
    map.push(i)
  }
  return { f, map }
}

function isAlnum(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57)
}

/** Converte [s, e) in coordinate foldate nell'intervallo corrispondente nel testo originale. */
function toOrig(fd: Folded, s: number, e: number, origLen: number): [number, number] {
  if (!fd.map) return [s, e]
  const os = s < fd.map.length ? fd.map[s] : origLen
  const oe = e < fd.map.length ? fd.map[e] : origLen
  return [os, oe]
}

// ---------------------------------------------------------------------------
// Regole dei gesti (tutte su testo foldato: minuscolo, senza accenti)
// ---------------------------------------------------------------------------

type Rule = {
  g: Gesture
  re: RegExp
  reject?: (f: string, idx: number) => boolean
}

const mk = (g: Gesture, src: string, reject?: Rule['reject']): Rule => ({
  g,
  re: new RegExp(src, 'g'),
  reject,
})

/** "non mescolare", "do not stir": il gesto e' negato. */
const NEGATED = /(?:^|[^a-z0-9])(?:non|do not|don\W?t|never|mai|senza|without)\s+$/
function negated(f: string, idx: number): boolean {
  return NEGATED.test(f.slice(Math.max(0, idx - 12), idx))
}

/** "a warm mug", "the top": parola usata come aggettivo/nome, non come verbo. */
const ADJ_BEFORE = /(?:^|[^a-z0-9])(?:a|an|the|very|slightly|lightly|into|with|of|in|un|una|il|lo|la|nel|nella|con)\s+$/
function adjBefore(f: string, idx: number): boolean {
  return ADJ_BEFORE.test(f.slice(Math.max(0, idx - 12), idx))
}

const TOP_NOUN = /(?:^|[^a-z0-9])(?:on|at|the|from|in|to|su|sul|sulla|al)\s+$/

// Gesti 'forti': vince quello che compare per primo nella frase.
const STRONG: Rule[] = [
  mk(
    'shake',
    'dry[- ]shak\\w*|shake(?:s|n)?(?![a-z0-9])|shaking|shaker(?:a|ar\\w*|ate|ando)(?![a-z0-9])|agit(?:a|are|ate|ando)(?![a-z0-9])',
  ),
  mk('stir', 'stir(?:s|red|ring)?(?![a-z0-9])|(?:ri)?mescol\\w*'),
  mk(
    'double-strain',
    'double[- ]strain\\w*|(?:fine|tea)[- ](?:mesh[- ])?strain\\w*|fine[- ]mesh|doppi[ao] (?:filtr\\w*|colin\\w*)|coli(?:no|ni)(?![a-z0-9])',
  ),
  mk('strain', 'strain\\w*|filtr\\w*|setacc\\w*'),
  mk(
    'muddle',
    'muddl\\w*|pest(?:a|are|ate|ando|alo|ala|ali|ale|i)(?![a-z0-9])|schiacc\\w*|press(?:ed|ing)?(?![a-z0-9])|crush(?![a-z0-9])',
  ),
  mk('blend', 'frull(?!ator)\\w*|blend(?!er)\\w*'),
  mk(
    'top',
    'top(?:ped|ping)?(?![a-z0-9])|colm\\w*|complet(?:a|are)(?=\\s+con)|rabbocc\\w*|finish(?:ed)?(?=\\s+(?:off\\s+)?with)|finisci(?=\\s+con)|allung\\w*|lengthen\\w*|copri(?=\\s+con\\s+(?!il\\s+palmo))',
    (f, i) => f.startsWith('top', i) && TOP_NOUN.test(f.slice(Math.max(0, i - 8), i)),
  ),
  mk(
    'layer',
    'stratific\\w*|layer(?:ed|ing)?(?![a-z0-9])|galleggi\\w*|vers(?:a|are)(?=[^.;]{0,50}(?:a filo|affond))|dorso|back(?= of (?:the |a )?(?:bar ?)?spoon)|float\\w*|adagia\\w*|fai scendere|lascia scendere|(?:let|allow)(?=\\s[\\w\\s]{0,25}\\bsink)|lungo(?= (?:il |la |lo )?(?:bar ?spoon|cucchiaio|parete))|(?:down|along)(?=\\s+(?:the\\s+|a\\s+)?(?:side|back|bar ?spoon|spoon))|drizzl\\w*|appoggia(?=\\s+(?:il\\s+|un\\s+)?(?:bar ?spoon|cucchiaio))|rest(?=\\s+(?:an?\\s+|the\\s+)?(?:upturned\\s+)?(?:bar ?)?spoon)|(?:sul|sopra il|sopra al)(?= (?:bar ?spoon|cucchiaio))|over(?= (?:the back of )?(?:a |the )?(?:bar ?)?spoon)',
  ),
  mk(
    'garnish',
    'guarn\\w*|garnish\\w*|decor\\w*|grattugi\\w*|grate(?:d)?(?![a-z0-9])|spolver\\w*|sprinkl\\w*|infilz\\w*|skewer\\w*|appendi\\w*|hang(?![a-z0-9])',
  ),
  mk(
    'express',
    'express\\w*|twist\\w*|spremi\\w*|squeez\\w*|profum\\w*|schiaffegg\\w*|slap(?:ped)?(?![a-z0-9])|oli[oi] essenzial\\w*|essential oils?',
  ),
  mk(
    'rim',
    'bord[oi](?![a-z0-9])|rim(?:s|med|ming)?(?![a-z0-9])|brina(?![a-z0-9])',
    (f, i) => f.startsWith('bord', i) && /fino a(?:l|d)?\s+$/.test(f.slice(Math.max(0, i - 10), i)),
  ),
  mk(
    'flame',
    'flamb\\w*|flame\\w*|flaming|accend\\w*|fiamm\\w*|ignit\\w*|bruci\\w*|set\\s+(?:it\\s+)?(?:on\\s+fire|alight|ablaze)|torch\\w*',
  ),
  mk(
    'heat',
    'scald\\w*|riscald\\w*|(?:pre-?)?heat(?:ed|ing)?(?![a-z0-9])|warm(?:ed|ing)?(?![a-z0-9])|steam\\w*',
    (f, i) => !/^(?:scald|riscald|steam)/.test(f.slice(i, i + 7)) && adjBefore(f, i),
  ),
  mk(
    'whip',
    'mont(?:a|are|ate|ando)(?![a-z0-9])|frust\\w*|whisk(?:s|ed|ing)?(?![a-z0-9])|whip(?:s|ping)?(?![a-z0-9])',
  ),
]

// Gesti 'deboli': contano solo se non c'e' nessun gesto forte.
const WEAK: Rule[] = [
  // "Metti menta, lime e zucchero nell'highball": preparazione per pestare
  mk(
    'muddle',
    '(?:metti|aggiungi|put|add)(?=\\s+(?:(?:il|la|le|lo|i|gli|the|some|a)\\s+)?(?:menta|mint|foglie|leaves|basilico|basil|zucchero di canna|brown sugar|zolletta|sugar cube)(?![a-z0-9]))',
  ),
  mk('chill', 'mett(?:i|ere)(?=\\s+in\\s+freddo)|mett(?:i|ila|ilo|ere)(?=[^.;:!?]{0,25}\\sfreezer)|raffredd(?:a|are|ate|i)(?![a-z0-9])|chill(?:s|ing)?(?![a-z0-9])|sciacqu\\w*|rinse\\w*|ghiaccia(?:re)?(?![a-z0-9])'),
  mk(
    'ice',
    '(?:riempi\\w*)(?=[^.;:!?]{0,40}(?:ghiaccio|cubett))|fill\\w*(?=[^.;:!?]{0,40}\\b(?:ice|cubes))|(?:aggiungi|aggiungere|metti|mettere|add|put|place)(?=\\s+(?:altro |ancora |more |some |extra |crushed |fresh |a |un |del |dello )?(?:ghiaccio|cubetti|ice|cubes)(?![a-z0-9]))',
  ),
  mk(
    'pour',
    'vers(?:a|are|ate|ando|alo|ala|ali|ale|ane)(?![a-z0-9])|pour\\w*|aggiung\\w*|add(?:ing|ed)?(?![a-z0-9])|mett(?:i|ila|ilo|ili|ile|ere|iamo|endo)(?![a-z0-9])|put(?![a-z0-9])|place(?![a-z0-9])|build(?:s)?(?![a-z0-9])|costruisci|inserisc\\w*|riempi\\w*|fill(?:ed|ing)?(?![a-z0-9])|combin\\w*|drop(?![a-z0-9])|lascia cadere|prepara(?![a-z0-9])',
  ),
  mk('serve', 'serv(?:i|e|ire|ing)(?![a-z0-9])|bevi(?![a-z0-9])|drink(?![a-z0-9])|sorseggi\\w*'),
]

const DRY_HINT =
  /dry[- ]?shak|a secco|senza (?:il )?ghiaccio|without (?:the )?ice|no ice|ice[- ]free/

type Hit = { start: number; end: number }

function firstHit(rule: Rule, f: string, checkNeg: boolean): Hit | null {
  const re = rule.re
  re.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(f)) !== null) {
    const idx = m.index
    if (m[0].length === 0) {
      re.lastIndex = idx + 1
      continue
    }
    if (idx > 0 && isAlnum(f.charCodeAt(idx - 1))) {
      re.lastIndex = idx + 1
      continue
    }
    if ((checkNeg && negated(f, idx)) || (rule.reject && rule.reject(f, idx))) {
      re.lastIndex = idx + 1
      continue
    }
    let end = idx + m[0].length
    while (end < f.length && isAlnum(f.charCodeAt(end))) end++
    return { start: idx, end }
  }
  return null
}

function detectGesture(f: string): { gesture: Gesture; hit: Hit | null } {
  let best: { g: Gesture; hit: Hit } | null = null
  let dbl: Hit | null = null
  let str: Hit | null = null
  let topHit: Hit | null = null

  for (const rule of STRONG) {
    const hit = firstHit(rule, f, true)
    if (!hit) continue
    if (rule.g === 'double-strain') {
      dbl = hit
      continue
    }
    if (rule.g === 'strain') {
      str = hit
      continue
    }
    if (rule.g === 'top') topHit = hit
    if (!best || hit.start < best.hit.start) best = { g: rule.g, hit }
  }
  // "mescola ... e fai un top di soda": il top e' il gesto che chiude, vince su stir
  if (best && best.g === 'stir' && topHit) best = { g: 'top', hit: topHit }
  // filtro: se c'e' un indizio di doppio filtro, e' double-strain
  if (dbl || str) {
    const cand: Hit = dbl && str ? (str.start <= dbl.start ? str : dbl) : ((dbl ?? str) as Hit)
    if (!best || cand.start < best.hit.start) best = { g: dbl ? 'double-strain' : 'strain', hit: cand }
  }

  if (best) {
    let g = best.g
    if (g === 'shake' && DRY_HINT.test(f)) g = 'dry-shake'
    return { gesture: g, hit: best.hit }
  }

  let weak: { g: Gesture; hit: Hit } | null = null
  for (const rule of WEAK) {
    const hit = firstHit(rule, f, false)
    if (hit && (!weak || hit.start < weak.hit.start)) weak = { g: rule.g, hit }
  }
  if (weak) return { gesture: weak.g, hit: weak.hit }
  return { gesture: 'other', hit: null }
}

// ---------------------------------------------------------------------------
// Numeri con unita' e tempi
// ---------------------------------------------------------------------------

const NUM = '(?:\\d+ \\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:[.,]\\d+)?[\\u00bd\\u00bc\\u00be\\u2153\\u2154\\u215b]?|[\\u00bd\\u00bc\\u00be\\u2153\\u2154\\u215b])'
const UNIT =
  '(?:ml|cl|dl|oz|l|lt|litr[io]|liters?|litres?|g|gr|gram(?:mi|s)?|kg|dash(?:es)?|drops?|gocc(?:e|ia|ie)|goccio|splash(?:es)?|spruzz\\w*|sec(?:ondi|ondo|onds?)?|s|min(?:uti|uto|utes?)?|or[ae]|h|hours?|bar ?spoons?|cucchiain\\w*|cucchiai|tsp|tbsp|pinch(?:es)?|pizzic\\w*|gradi|degrees?|giorni|days?|%|\\u00b0 ?[cf]?)'
const NUMBER_RE = new RegExp(
  `${NUM}(?:\\s?[-\\u2013\\u2014]\\s?${NUM})?\\s?${UNIT}(?![a-z0-9])`,
  'g',
)

// ---------------------------------------------------------------------------
// Ingredienti
// ---------------------------------------------------------------------------

const INGR_CACHE = new Map<string, RegExp | null>()

/** parole "di servizio" nei nomi: il nome senza di loro e' una variante valida ("succo di lime" -> "lime"). */
const GENERIC = new Set(
  'juice succo di d al alla all del della de of syrup sciroppo liqueur liquore fresh fresco fresca puree purea'.split(' '),
)
/** parole troppo comuni per essere usate da sole come variante ("peel", "water"...). */
const HEAD_STOP = new Set(
  'peel zest scorza buccia leaf leaves wedge slice cube sprig water acqua beer birra juice syrup simple semplice triple sec dry soda ice ghiaccio cream crema panna'.split(
    ' ',
  ),
)

/** ultima parola con singolare/plurale semplice (s, es, i, e finali). */
function flex(t: string): string {
  if (t.length < 3) return t
  const base = t.length >= 4 && /[sie]$/.test(t) ? t.slice(0, -1) : t
  return `${base}(?:s|es|i|e)?`
}

function ingredientRegex(names: string[], lang: Lang): RegExp | null {
  const variants = new Map<string, string[]>() // testo normalizzato -> token
  const add = (toks: string[]) => {
    const joined = toks.join(' ')
    if (joined.length < 2 || variants.has(joined)) return
    variants.set(joined, toks)
  }
  for (const n of names) {
    if (typeof n !== 'string') continue
    const toks = fold(n).f.split(/[^a-z0-9]+/).filter(Boolean)
    if (toks.length === 0) continue
    add(toks)
    const core = toks.filter((t) => !GENERIC.has(t))
    if (core.length > 0 && core.length < toks.length && (core.length > 1 || !HEAD_STOP.has(core[0]))) add(core)
    if (core.length >= 2) {
      const head = lang === 'it' ? core[0] : core[core.length - 1]
      if (head.length >= 3 && !HEAD_STOP.has(head)) add([head])
    }
  }
  if (variants.size === 0) return null
  // piu' lungo prima (conta il testo normalizzato)
  const order = [...variants.entries()]
    .sort((x, y) => y[0].length - x[0].length)
    .map(([, toks]) => toks.map((t, i) => (i === toks.length - 1 ? flex(t) : t)).join('[^a-z0-9]+'))
  const key = order.join('|')
  const cached = INGR_CACHE.get(key)
  if (cached !== undefined) return cached
  const re = new RegExp(`(^|[^a-z0-9])(${key})(?![a-z0-9])`, 'g')
  if (INGR_CACHE.size > 200) INGR_CACHE.clear()
  INGR_CACHE.set(key, re)
  return re
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export function parseStep(
  text: string,
  lang: Lang,
  ingredientNames?: string[],
): { gesture: Gesture; parts: StepPart[] } {
  // le parole chiave valgono per entrambe le lingue; lang serve solo per le varianti dei nomi
  if (typeof text !== 'string') return { gesture: 'other', parts: [] }
  if (text.length === 0) return { gesture: 'other', parts: [] }
  try {
    const fd = fold(text)
    const f = fd.f
    const n = text.length
    const bold = new Uint8Array(n)
    // bit: 1 gesto, 2 numeri/tempi, 4 ingredienti
    const mark = (s: number, e: number, bit = 1) => {
      const [os, oe] = toOrig(fd, s, e, n)
      for (let i = os; i < oe && i < n; i++) bold[i] |= bit
    }

    const { gesture, hit } = detectGesture(f)
    if (hit) mark(hit.start, hit.end)

    // numeri con unita' / tempi
    NUMBER_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = NUMBER_RE.exec(f)) !== null) {
      const idx = m.index
      if (m[0].length === 0) {
        NUMBER_RE.lastIndex = idx + 1
        continue
      }
      if (idx > 0 && isAlnum(f.charCodeAt(idx - 1))) {
        NUMBER_RE.lastIndex = idx + 1
        continue
      }
      mark(idx, idx + m[0].length, 2)
    }

    // ingredienti
    if (ingredientNames && ingredientNames.length > 0) {
      const re = ingredientRegex(ingredientNames, lang)
      if (re) {
        re.lastIndex = 0
        while ((m = re.exec(f)) !== null) {
          const start = m.index + m[1].length
          const end = start + m[2].length
          mark(start, end, 4)
          re.lastIndex = end
        }
      }
    }

    // troppo grassetto: nei passi lunghi toglie prima gli ingredienti, poi anche i numeri
    if (n > 40) {
      const share = () => {
        let c = 0
        for (let i = 0; i < n; i++) if (bold[i] !== 0) c++
        return c / n
      }
      if (share() > 0.6) {
        for (let i = 0; i < n; i++) bold[i] &= 3
        if (share() > 0.6) for (let i = 0; i < n; i++) bold[i] &= 1
      }
    }

    // ripiego: nessun grassetto trovato -> prima parola (il verbo)
    if (!bold.some((b) => b !== 0)) {
      const w = /[a-z0-9]+/.exec(f)
      if (w) mark(w.index, w.index + w[0].length)
      else {
        const nw = /\S+/.exec(text)
        if (nw) bold.fill(1, nw.index, nw.index + nw[0].length)
      }
    }

    // segmenti: uniti quando il grassetto e' uguale, mai vuoti
    const parts: StepPart[] = []
    let from = 0
    for (let i = 1; i <= n; i++) {
      if (i === n || (bold[i] !== 0) !== (bold[from] !== 0)) {
        parts.push({ text: text.slice(from, i), bold: bold[from] !== 0 })
        from = i
      }
    }
    return { gesture, parts }
  } catch {
    return { gesture: 'other', parts: [{ text, bold: false }] }
  }
}

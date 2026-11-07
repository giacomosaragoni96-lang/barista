/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { allDrinks, allIngredients, getDrink, getIngredient } from '../catalog'
import { searchDrinks } from '../search'
import { parseStep, type Gesture } from '../steps'
import { normalize } from '../normalize'
import { en } from '../../i18n/en'
import { it as itDict } from '../../i18n/it'

// ---------------------------------------------------------------------------
// Raccolta dei testi
// ---------------------------------------------------------------------------
interface Txt {
  where: string
  en: string
  it?: string
}

const texts: Txt[] = []
for (const d of allDrinks) {
  texts.push({ where: `${d.id}.description`, en: d.description.en, it: d.description.it })
  d.steps.forEach((s, i) => texts.push({ where: `${d.id}.steps[${i}]`, en: s.en, it: s.it }))
  texts.push({ where: `${d.id}.garnish`, en: d.garnish.en, it: d.garnish.it })
  if (d.tip) texts.push({ where: `${d.id}.tip`, en: d.tip.en, it: d.tip.it })
  d.ingredients.forEach((i) => {
    if (i.note) texts.push({ where: `${d.id}.ingredient(${i.id}).note`, en: i.note.en, it: i.note.it })
  })
}
for (const ing of allIngredients) {
  texts.push({ where: `ingredient ${ing.id}.name`, en: ing.name.en, it: ing.name.it })
  ing.substitutes.forEach((s) => texts.push({ where: `ingredient ${ing.id}.substitute(${s.id}).note`, en: s.note.en, it: s.note.it }))
}

/** Appiattisce un dizionario i18n; le funzioni vengono chiamate con argomenti di prova. */
function flatten(obj: unknown, path = ''): { path: string; value: string }[] {
  if (typeof obj === 'string') return [{ path, value: obj }]
  if (typeof obj === 'function') {
    const fn = obj as (...a: unknown[]) => unknown
    const out: { path: string; value: string }[] = []
    for (const args of [[1, 2], [2, 3], ['Lime', 'Gin']]) {
      try {
        const r = fn(...args)
        if (typeof r === 'string') out.push({ path: `${path}(${args.join(',')})`, value: r })
      } catch {
        /* argomenti non adatti: ignora */
      }
    }
    return out
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => flatten(v, path ? `${path}.${k}` : k))
  }
  return []
}
const enFlat = flatten(en)
const itFlat = flatten(itDict)

// ---------------------------------------------------------------------------
// (1) Parole italiane vietate nei testi inglesi
// ---------------------------------------------------------------------------
/** Parole intere, minuscole e senza accenti. Solo parole che in inglese non hanno senso. */
const ITALIAN_WORDS = [
  'ghiaccio', 'ghiaccia', 'succo', 'succhi', 'bicchiere', 'bicchieri', 'bicchierino', 'mescola', 'mescolare', 'mescolando',
  'shakera', 'shakerare', 'guarnisci', 'guarnire', 'guarnizione', 'zucchero', 'scorza', 'scorze', 'fetta', 'fette', 'versa',
  'versare', 'aggiungi', 'aggiungere', 'colma', 'colmare', 'riempi', 'riempire', 'metti', 'mettere', 'filtra', 'filtrare',
  'servi', 'servire', 'decora', 'decorare', 'agita', 'spremi', 'strofina', 'sciroppo', 'limone', 'arancia', 'arancio',
  'coppa', 'coppetta', 'freddo', 'fredda', 'caldo', 'calda', 'acqua', 'foglia', 'foglie', 'cubetti', 'frutto', 'poi', 'anche',
  'sopra', 'sotto', 'tutto', 'tutti', 'tutta', 'dolce', 'dolci', 'cucchiaio', 'cucchiaino', 'cucchiaini', 'goccia', 'gocce',
  'secondi', 'minuti', 'fino', 'quindi', 'dopo', 'prima', 'senza', 'molto', 'ancora', 'uovo', 'uova', 'ramoscello',
  'della', 'delle', 'dello', 'degli', 'dei', 'del', 'nel', 'nello', 'nella', 'nelle', 'sul', 'sulla', 'sullo', 'sui',
  'alla', 'allo', 'agli', 'dal', 'dalla', 'con', 'col', 'di', 'il', 'lo', 'gli', 'una', 'uno', 'che', 'piu', 'oppure', 'ogni',
]
const ITALIAN_SET = new Set(ITALIAN_WORDS)

/**
 * Allowlist: parole italiane ammesse perche parte di un nome proprio, di un marchio o di un termine italiano
 * usato come tale in inglese. Chiave = parola, valore = perche.
 */
const ALLOW_WORDS: Record<string, string> = {
  fino: 'Fino sherry: tipo di sherry, anche in inglese',
}

/** Frasi o nomi propri interi in cui le parole italiane sono ammesse (confronto sul testo normalizzato, sottostringa). */
const ALLOW_PHRASES: string[] = [
  'amaro del capo', 'aperitivo',
]

function italianHits(text: string): string[] {
  const words = normalize(text).split(' ').filter(Boolean)
  const norm = normalize(text)
  if (ALLOW_PHRASES.some((p) => norm.includes(p))) return []
  return words.filter((w) => ITALIAN_SET.has(w) && !(w in ALLOW_WORDS))
}

describe('inglese: nessuna parola italiana nei testi en', () => {
  it('drink: descrizione, passi, guarnizione, consiglio, note degli ingredienti', () => {
    const bad = texts
      .filter((t) => !t.where.startsWith('ingredient '))
      .map((t) => ({ t, h: italianHits(t.en) }))
      .filter((x) => x.h.length)
      .map((x) => `${x.t.where}: [${x.h.join(', ')}] "${x.t.en}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })

  it('ingredienti: name.en e note dei sostituti', () => {
    const bad = texts
      .filter((t) => t.where.startsWith('ingredient '))
      .map((t) => ({ t, h: italianHits(t.en) }))
      .filter((x) => x.h.length)
      .map((x) => `${x.t.where}: [${x.h.join(', ')}] "${x.t.en}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })

  it('src/i18n/en.ts', () => {
    const bad = enFlat
      .map((x) => ({ x, h: italianHits(x.value) }))
      .filter((y) => y.h.length)
      .map((y) => `${y.x.path}: [${y.h.join(', ')}] "${y.x.value}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })

  it('alias: nessuna istruzione italiana (gli alias possono conservare i vecchi nomi italiani, per la ricerca)', () => {
    const instr = new Set(['mescola', 'shakera', 'versa', 'guarnisci', 'aggiungi', 'colma', 'riempi', 'metti', 'filtra', 'servi', 'decora'])
    const bad: string[] = []
    for (const d of allDrinks) for (const a of d.aliases) if (normalize(a).split(' ').some((w) => instr.has(w))) bad.push(`${d.id}: alias "${a}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })

  it('il rilevatore funziona (autotest)', () => {
    expect(italianHits('Mescola con ghiaccio e versa nel bicchiere')).toEqual(['mescola', 'con', 'ghiaccio', 'versa', 'nel', 'bicchiere'])
    expect(italianHits('Stir with ice and pour into the glass')).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// (2) en diverso da it per i testi lunghi
// ---------------------------------------------------------------------------
/** Testi identici in it ed en ammessi (elenchi di nomi propri / marchi). Chiave = testo normalizzato. */
const SAME_TEXT_OK = new Set<string>([])

describe('inglese: en diverso da it (testi oltre 15 caratteri)', () => {
  it('drink e ingredienti', () => {
    const bad = texts
      // i nomi degli ingredienti sono spesso nomi propri / marchi (Amaro Montenegro, Cocchi Americano): esentati
      .filter((t) => !t.where.endsWith('.name') && t.it !== undefined && t.en.length > 15 && t.en.trim() === t.it.trim() && !SAME_TEXT_OK.has(normalize(t.en)))
      .map((t) => `${t.where}: "${t.en}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })

  it('src/i18n', () => {
    const itMap = new Map(itFlat.map((x) => [x.path, x.value]))
    const bad = enFlat
      .filter((x) => x.value.length > 15 && itMap.get(x.path) === x.value && !SAME_TEXT_OK.has(normalize(x.value)))
      .map((x) => `${x.path}: "${x.value}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// (3) stessi numeri nei passi it ed en
// ---------------------------------------------------------------------------
const UNIT_CANON: Record<string, string> = {
  ml: 'ml', cl: 'cl', oz: 'oz', s: 'sec', sec: 'sec', secs: 'sec', second: 'sec', seconds: 'sec', secondo: 'sec', secondi: 'sec',
  dash: 'dash', dashes: 'dash', goccia: 'drop', gocce: 'drop', drop: 'drop', drops: 'drop', min: 'min', minute: 'min',
  minutes: 'min', minuto: 'min', minuti: 'min',
}
function quantities(text: string): string[] {
  const out: string[] = []
  const re = /(\d+(?:[.,]\d+)?(?:\s*[-–]\s*\d+(?:[.,]\d+)?)?)\s*(ml|cl|oz|secondi|secondo|seconds|second|secs|sec|s|dashes|dash|gocce|goccia|drops|drop|minuti|minuto|minutes|minute|min)\b/gi
  for (const m of text.matchAll(re)) {
    const num = m[1].replace(/\s+/g, '').replace(/,/g, '.').replace('–', '-')
    out.push(`${num} ${UNIT_CANON[m[2].toLowerCase()]}`)
  }
  return out.sort()
}

describe('passi: stessi numeri in italiano e in inglese', () => {
  it('ml/cl/oz/secondi/dash/gocce/minuti coincidono per ogni passo', () => {
    const bad: string[] = []
    for (const d of allDrinks)
      d.steps.forEach((s, i) => {
        const a = quantities(s.it)
        const b = quantities(s.en)
        if (JSON.stringify(a) !== JSON.stringify(b)) bad.push(`${d.id} passo ${i + 1}: it [${a.join('; ')}] / en [${b.join('; ')}]`)
      })
    expect(bad, bad.join('\n')).toEqual([])
  })

  it("l'estrattore funziona (autotest)", () => {
    expect(quantities('Shake 10-12 seconds, add 15 ml and 2 dashes')).toEqual(['10-12 sec', '15 ml', '2 dash'])
    expect(quantities('Shakera 10-12 secondi, aggiungi 15 ml e 2 dash')).toEqual(['10-12 sec', '15 ml', '2 dash'])
  })
})

// ---------------------------------------------------------------------------
// (4) chiavi i18n identiche
// ---------------------------------------------------------------------------
function keyPaths(obj: unknown, path = ''): string[] {
  if (obj && typeof obj === 'object' && !Array.isArray(obj))
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => keyPaths(v, path ? `${path}.${k}` : k))
  return [`${path}:${typeof obj}`]
}

describe('i18n: it ed en hanno le stesse chiavi', () => {
  it('stesse chiavi e stessi tipi (stringa/funzione)', () => {
    const a = new Set(keyPaths(itDict))
    const b = new Set(keyPaths(en))
    const onlyIt = [...a].filter((k) => !b.has(k))
    const onlyEn = [...b].filter((k) => !a.has(k))
    expect({ soloIt: onlyIt, soloEn: onlyEn }).toEqual({ soloIt: [], soloEn: [] })
  })

  it('nessuna stringa vuota', () => {
    const empty = [...enFlat, ...itFlat].filter((x) => x.value.trim() === '').map((x) => x.path)
    expect(empty).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// (5) Ricerca in inglese (e vecchi nomi italiani)
// ---------------------------------------------------------------------------
const rank = (q: string, lang: 'en' | 'it', n = 5) => searchDrinks(q, lang).slice(0, n).map((r) => r.drink.id)

describe('ricerca in inglese', () => {
  it.each([
    ['cachanchara', 'canchanchara', 3],
    ['canchanchara', 'canchanchara', 1],
    ['g&t', 'gin-tonic', 3],
    ['gin and tonic', 'gin-tonic', 3],
    ['cosmo', 'cosmopolitan', 3],
    ['spritz', 'aperol-spritz', 3],
    ['aperol spritz', 'aperol-spritz', 1],
    ['barracuda', 'barracuda', 1],
    ['vento', 've-n-to', 3],
    ['ve.n.to', 've-n-to', 3],
    ['illegal', 'illegal', 1],
    ['mistaken negroni', 'negroni-sbagliato', 3],
    ['negroni', 'negroni', 1],
    ['basil nojito', null, 3],
    ['virgin spritz', null, 5],
    ['bees knees', 'bees-knees', 1],
    ['dark and stormy', 'dark-n-stormy', 1],
    ['paper plane', 'paper-plane', 1],
    ['moscow mule', 'moscow-mule', 1],
    ['old fashioned', 'old-fashioned', 1],
  ] as [string, string | null, number][])("en: '%s' trova %s nei primi %i", (q, id, n) => {
    const got = rank(q, 'en', n)
    if (id) expect(got, `ricerca '${q}' (en)`).toContain(id)
    else expect(got.length, `ricerca '${q}' (en) senza risultati`).toBeGreaterThan(0)
  })

  it("'basil nojito' e 'virgin spritz' trovano un drink analogo (analcolico / basilico / spritz)", () => {
    const nojito = searchDrinks('basil nojito', 'en', 5).map((r) => r.drink)
    expect(nojito.some((d) => /nojito|mojito/i.test(d.id) || d.family === 'mocktail'), `trovati: ${nojito.map((d) => d.id)}`).toBe(true)
    const vs = searchDrinks('virgin spritz', 'en', 5).map((r) => r.drink)
    expect(vs.some((d) => /spritz/i.test(d.id) || /spritz/i.test(d.name)), `trovati: ${vs.map((d) => d.id)}`).toBe(true)
  })

  it('per ingrediente in inglese', () => {
    for (const [q, ing] of [['campari', 'campari'], ['mezcal', 'mezcal'], ['prosecco', 'prosecco'], ['lime juice', 'lime-juice'], ['sweet vermouth', 'sweet-vermouth']]) {
      const r = searchDrinks(q, 'en', 20)
      expect(r.length, `ricerca '${q}' (en)`).toBeGreaterThan(0)
      expect(r.some((x) => x.drink.ingredients.some((i) => i.id === ing)), `'${q}': nessun drink con ${ing}`).toBe(true)
    }
  })

  it('con lang it trova ancora i vecchi nomi italiani degli alias', () => {
    const olds: [string, string][] = []
    // ogni alias con parole italiane tipiche conservato nei dati deve trovare il suo drink con lang 'it'
    const hint = /\b(e|con|di|del|della|alla|al)\b/i
    for (const d of allDrinks) for (const a of d.aliases) if (hint.test(a)) olds.push([a, d.id])
    expect(olds.length, 'nessun alias italiano nei dati: test vuoto').toBeGreaterThan(5)
    const bad: string[] = []
    for (const [a, id] of olds) {
      const got = searchDrinks(a, 'it', 5).map((r) => r.drink.id)
      if (!got.includes(id)) bad.push(`alias "${a}" -> atteso ${id}, trovati ${got.join(', ') || '(nessuno)'}`)
    }
    expect(bad, bad.join('\n')).toEqual([])
  })

  it.each([
    ['negroni sbagliato', 'negroni-sbagliato'],
    ['margherita', 'margarita'],
    ['spriz', 'aperol-spritz'],
    ['rum e ginger beer', 'dark-n-stormy'],
    ['whisky miele zenzero', 'penicillin'],
    ['caffe martini', 'espresso-martini'],
  ])("it: '%s' trova %s", (q, id) => {
    expect(rank(q, 'it', 5), `ricerca '${q}' (it)`).toContain(id)
  })

  it('ogni nome e ogni alias trova il proprio drink (en e it)', () => {
    const bad: string[] = []
    for (const d of allDrinks)
      for (const q of [d.name, ...d.aliases]) {
        // la ricerca ignora la lingua: tutti i nomi/alias in 'en', i soli nomi anche in 'it'
        for (const lang of ['en', 'it'] as const) {
          if (lang === 'it' && q !== d.name) continue;
          const got = searchDrinks(q, lang, 20).map((r) => r.drink.id)
          if (!got.includes(d.id)) bad.push(`${lang}: "${q}" non trova ${d.id}`)
        }
      }
    expect(bad.slice(0, 30), bad.slice(0, 30).join('\n')).toEqual([])
  }, 120_000)
})

// ---------------------------------------------------------------------------
// (6) Parita' dei gesti it/en
// ---------------------------------------------------------------------------
describe('gesti: stesso gesto in inglese e in italiano', () => {
  const rows: { id: string; n: number; it: Gesture; en: Gesture; textIt: string; textEn: string }[] = []
  for (const d of allDrinks) {
    const namesIt = d.ingredients.map((i) => getIngredient(i.id)?.name.it ?? i.id)
    const namesEn = d.ingredients.map((i) => getIngredient(i.id)?.name.en ?? i.id)
    d.steps.forEach((s, k) =>
      rows.push({
        id: d.id, n: k + 1, textIt: s.it, textEn: s.en,
        it: parseStep(s.it, 'it', namesIt).gesture,
        en: parseStep(s.en, 'en', namesEn).gesture,
      }),
    )
  }

  it('al massimo il 3% dei passi ha un gesto diverso', () => {
    const diff = rows.filter((r) => r.it !== r.en)
    const share = diff.length / rows.length
    const list = diff.map((r) => `${r.id} #${r.n}: it=${r.it} en=${r.en} | "${r.textEn}"`)
    console.log(`[gesti] passi ${rows.length}, diversi ${diff.length} (${(share * 100).toFixed(2)}%)\n${list.join('\n')}`)
    expect(share, `gesti diversi:\n${list.join('\n')}`).toBeLessThanOrEqual(0.03)
  })

  it("stampa i passi 'other' (informativo)", () => {
    const other = rows.filter((r) => r.en === 'other' || r.it === 'other')
    console.log(`[gesti] passi 'other': ${other.length} su ${rows.length}\n${other.map((r) => `${r.id} #${r.n}: it=${r.it} en=${r.en} | "${r.textEn}"`).join('\n')}`)
    expect(other.length / rows.length).toBeLessThanOrEqual(0.1)
  })
})

// ---------------------------------------------------------------------------
// (7) Integrita' dei testi
// ---------------------------------------------------------------------------
describe('integrita dei testi', () => {
  it('ogni drink ha almeno 3 passi', () => {
    const bad = allDrinks.filter((d) => d.steps.length < 3).map((d) => `${d.id}: ${d.steps.length} passi`)
    expect(bad, bad.join('\n')).toEqual([])
  })

  const all: { where: string; value: string }[] = [
    ...texts.flatMap((t) => [{ where: `${t.where} (en)`, value: t.en }, ...(t.it !== undefined ? [{ where: `${t.where} (it)`, value: t.it }] : [])]),
    ...enFlat.map((x) => ({ where: `i18n.en.${x.path}`, value: x.value })),
    ...itFlat.map((x) => ({ where: `i18n.it.${x.path}`, value: x.value })),
    ...allDrinks.flatMap((d) => d.aliases.map((a) => ({ where: `${d.id}.alias`, value: a }))),
  ]

  it('nessun doppio spazio, spazio prima della virgola o carattere di controllo', () => {
    const bad: string[] = []
    for (const x of all) {
      if (/ {2,}/.test(x.value)) bad.push(`${x.where}: doppio spazio "${x.value}"`)
      if (/ ,/.test(x.value)) bad.push(`${x.where}: " ," "${x.value}"`)
      // eslint-disable-next-line no-control-regex
      if (/[\u0000-\u001f\u007f-\u009f]/.test(x.value)) bad.push(`${x.where}: carattere di controllo "${JSON.stringify(x.value)}"`)
      if (x.value !== x.value.trim()) bad.push(`${x.where}: spazi a inizio/fine "${x.value}"`)
    }
    expect(bad, bad.join('\n')).toEqual([])
  })

  it("nessun 'undefined', '[object', 'NaN' o 'null' nei testi", () => {
    const bad = all.filter((x) => /undefined|\[object|\bNaN\b|\bnull\b/.test(x.value)).map((x) => `${x.where}: "${x.value}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })

  it('nomi e id: nessun drink senza nome o con id non kebab-case', () => {
    const bad = allDrinks.filter((d) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.id) || !d.name.trim()).map((d) => d.id)
    expect(bad).toEqual([])
    expect(getDrink('negroni')).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// (8) Nessun testo fisso nei .tsx
// ---------------------------------------------------------------------------
/** Estrae i testi "fissi" da sorgente TSX: testo JSX tra tag e attributi di accessibilita con lettere. */
function hardcoded(src: string): string[] {
  const s = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (_m, a) => a)
  const out: string[] = []
  // testo tra tag: >testo<  (escluse le frecce => e i generici seguiti da codice)
  for (const m of s.matchAll(/(?<![=\-])>([^<>{}]*)(?=<)/g)) {
    const t = m[1].trim()
    if (!/[A-Za-zÀ-ÿ]{2,}/.test(t)) continue
    if (/[();=&|]/.test(t)) continue // codice, non testo
    if (/^[,\s]*[\w'-]+:?$/.test(t) && /[,:]/.test(t)) continue // chiavi di oggetto con valori JSX (Icon.tsx)
    out.push(t.replace(/\s+/g, ' '))
  }
  // attributi visibili o letti da screen reader con testo fisso
  for (const m of s.matchAll(/\b(aria-label|title|placeholder|alt|aria-description)=(?:"([^"{]*)"|\{\s*['"`]([^'"`]*)['"`]\s*\})/g)) {
    const t = m[2] ?? m[3] ?? ''
    if (/[A-Za-zÀ-ÿ]{2,}/.test(t)) out.push(`${m[1]}="${t}"`)
  }
  return out
}

/** Testi ammessi (simboli, marchi, nomi di formato). */
const TSX_ALLOW = new Set<string>(['Barista', 'Barback', 'ml', 'cl', 'oz', 'x'])

describe('nessun testo fisso nei .tsx di components e screens', () => {
  const files = ['src/components', 'src/screens'].flatMap((dir) =>
    readdirSync(join(process.cwd(), dir))
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => ({ file: `${dir}/${f}`, src: readFileSync(join(process.cwd(), dir, f), 'utf8') })),
  )

  it('ci sono file da controllare', () => expect(files.length).toBeGreaterThan(10))

  it('il rilevatore funziona (autotest)', () => {
    expect(hardcoded('<p>Ciao mondo</p>')).toEqual(['Ciao mondo'])
    expect(hardcoded('<input placeholder="Cerca" />')).toEqual(['placeholder="Cerca"'])
    expect(hardcoded('<p>{t.nav.search}</p><button aria-label={t.x}>{n}</button>')).toEqual([])
    expect(hardcoded('const f = (a: number) => a > 1 ? <b>{a}</b> : null')).toEqual([])
  })

  it('nessuna stringa visibile fuori da src/i18n', () => {
    const bad: string[] = []
    for (const f of files) for (const t of hardcoded(f.src)) if (!TSX_ALLOW.has(t)) bad.push(`${f.file}: "${t}"`)
    expect(bad, bad.join('\n')).toEqual([])
  })
})

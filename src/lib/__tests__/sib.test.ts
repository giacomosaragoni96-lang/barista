/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { allDrinks, getDrink, getIngredient } from '../catalog'
import { normalize } from '../normalize'
import type { Drink } from '../../data/types'

/**
 * Confronto dei nostri dati con il ricettario SIB (elenco IBA).
 * Il testo del ricettario e materiale protetto: qui dentro ci sono SOLO id, nomi dei cocktail e numeri.
 * Dove il sib.txt e disponibile (variabile d'ambiente SIB_TXT) i test lo rileggono per
 * verificare anche le tabelle scritte a mano; altrimenti quei test vengono saltati.
 */
const SIB_PATH = process.env.SIB_TXT ?? ''
const HAS_SIB = SIB_PATH !== '' && existsSync(SIB_PATH)

// ---------------------------------------------------------------------------
// Sezioni del SIB (nomi come titolo, nell'ordine del documento)
// ---------------------------------------------------------------------------
const SIB_UNFORGETTABLE = [
  'Alexander', 'Americano', 'Angel Face', 'Aviation', 'Between the Sheets', 'Boulevardier', 'Brandy Crusta',
  'Casino', 'Clover Club', 'Daiquiri', 'Dry Martini', 'Gin Fizz', 'Hanky Panky', 'John Collins', 'Last Word',
  'Manhattan', 'Martinez', 'Mary Pickford', 'Monkey Gland', 'Negroni', 'Old Fashioned', 'Paradise',
  "Planter's Punch", 'Porto Flip', 'Ramos Fizz', 'Rusty Nail', 'Sazerac', 'Sidecar', 'Stinger', 'Tuxedo',
  'Vieux Carré', 'Whiskey Sour', 'White Lady',
]
const SIB_CONTEMPORARY = [
  'Bellini', 'Black Russian', 'Bloody Mary', 'Caipirinha', 'Champagne Cocktail', 'Corpse Reviver #2',
  'Cosmopolitan', 'Cuba Libre', 'French 75', 'French Connection', 'Golden Dream', 'Grasshopper',
  'Hemingway Special', "Horse's Neck", 'Irish Coffee', 'Kir', 'Long Island Iced Tea', 'Mai-Tai', 'Margarita',
  'Mimosa', 'Mint Julep', 'Mojito', 'Moscow Mule', 'Pina Colada', 'Pisco Sour', 'Sea Breeze',
  'Sex on the Beach', 'Singapore Sling', 'Tequila Sunrise', 'Vesper', 'Zombie',
]
const SIB_NEW_ERA = [
  'Barracuda', "Bee's Knees", 'Bramble', 'Cachanchara', "Dark 'n' Stormy", 'Espresso Martini', 'Fernandito',
  'French Martini', 'Illegal', 'Lemon Drop Martini', 'Naked and Famous', 'New York Sour', 'Old Cuban', 'Paloma',
  'Paper Plane', 'Penicillin', 'Russian Spring Punch', 'Southside', 'Spicy Fifty', 'Spritz', 'Suffering Bastard',
  'Tipperary', "Tommy's Margarita", 'Trinidad Sour', 'VE.N.TO', 'Yellow Bird',
]

/** Eccezioni documentate: drink con tag IBA nei nostri dati ma assenti dal ricettario SIB. */
const TAGGED_BUT_NOT_IN_SIB: Record<string, string[]> = {
  unforgettable: [],
  // Rose e nell'elenco IBA ufficiale ma il ricettario SIB non lo riporta.
  contemporary: ['rose'],
  'new-era': [],
}

/** Trova il drink per nome o alias (confronto normalizzato). Il nome vince sull'alias. */
function findDrink(sibName: string): Drink | undefined {
  const n = normalize(sibName)
  return (
    allDrinks.find((d) => normalize(d.name) === n) ?? allDrinks.find((d) => d.aliases.some((a) => normalize(a) === n))
  )
}

const bySection = {
  unforgettable: SIB_UNFORGETTABLE,
  contemporary: SIB_CONTEMPORARY,
  'new-era': SIB_NEW_ERA,
} as const

describe('SIB: conteggi e tag iba', () => {
  it('le tabelle a mano hanno i conteggi attesi (33 / 31 / 26)', () => {
    expect(SIB_UNFORGETTABLE.length).toBe(33)
    expect(SIB_CONTEMPORARY.length).toBe(31)
    expect(SIB_NEW_ERA.length).toBe(26)
  })

  it("tag 'unforgettable' = 33", () => {
    expect(allDrinks.filter((d) => d.iba === 'unforgettable')).toHaveLength(33)
  })

  it.each(Object.entries(bySection))('sezione %s: ogni drink del SIB esiste nei dati ed ha il tag giusto', (tag, names) => {
    const problems: string[] = []
    for (const nm of names) {
      const d = findDrink(nm)
      if (!d) problems.push(`${nm}: nessun drink con questo nome o alias`)
      else if (d.iba !== tag) problems.push(`${nm} (${d.id}): iba atteso '${tag}', trovato '${d.iba ?? 'nessuno'}'`)
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it.each(Object.entries(bySection))('sezione %s: il tag coincide per nome con il SIB (conteggio e drink in piu)', (tag, names) => {
    const sibIds = new Set(names.map((n) => findDrink(n)?.id).filter((x): x is string => !!x))
    const tagged = allDrinks.filter((d) => d.iba === tag)
    const extra = tagged.filter((d) => !sibIds.has(d.id)).map((d) => d.id)
    const allowed = TAGGED_BUT_NOT_IN_SIB[tag]
    expect(
      extra.filter((id) => !allowed.includes(id)),
      `taggati '${tag}' ma assenti dal SIB (non documentati): ${extra.join(', ')}`,
    ).toEqual([])
    // le eccezioni documentate devono esistere davvero (se non servono piu, toglierle)
    for (const id of allowed) expect(extra, `eccezione ${id} non piu necessaria`).toContain(id)
    expect(tagged.length).toBe(names.length + allowed.length)
  })

  it('new-era: 26 drink (da Barracuda a Yellow Bird, con Bramble e Spritz)', () => {
    const tagged = allDrinks.filter((d) => d.iba === 'new-era').map((d) => d.id)
    expect(tagged).toHaveLength(26)
    expect(getDrink('bramble')?.iba).toBe('new-era')
    expect(getDrink('aperol-spritz')?.iba).toBe('new-era')
  })

  it('contemporary: 31 del SIB + Rose (eccezione documentata) = 32', () => {
    expect(allDrinks.filter((d) => d.iba === 'contemporary')).toHaveLength(32)
    expect(getDrink('rose')?.iba).toBe('contemporary')
  })

  it.skipIf(!HAS_SIB)('le tabelle a mano coincidono con i titoli del sib.txt (stesso ordine)', () => {
    const t = readFileSync(SIB_PATH, 'utf8').replace(/\r/g, '')
    const titles = [...t.matchAll(/^\s*([^\n(]+?)\s*\([^)\n]+\)?\s*\n\s*INGREDIENTI/gm)].map((m) => normalize(m[1].replace('DRNK', 'DRINK')))
    const mine = [...SIB_UNFORGETTABLE, ...SIB_CONTEMPORARY, ...SIB_NEW_ERA].map(normalize)
    expect(titles).toEqual(mine)
  })
})

describe('SIB: drink aggiunti', () => {
  it.each(['barracuda', 'illegal', 've-n-to'])('%s esiste, tag new-era, con almeno 3 passi', (id) => {
    const d = getDrink(id)
    expect(d, `drink ${id} mancante`).toBeDefined()
    expect(d!.iba).toBe('new-era')
    expect(d!.steps.length).toBeGreaterThanOrEqual(3)
  })

  it("canchanchara ha l'alias 'Cachanchara' (grafia del SIB)", () => {
    const d = getDrink('canchanchara')
    expect(d, 'drink canchanchara mancante').toBeDefined()
    expect(d!.aliases).toContain('Cachanchara')
    expect(findDrink('Cachanchara')?.id).toBe('canchanchara')
  })

  it("aperol-spritz e raggiungibile col nome SIB 'Spritz'", () => {
    expect(findDrink('Spritz')?.id).toBe('aperol-spritz')
  })

  it("ramos-gin-fizz e raggiungibile col nome SIB 'Ramos Fizz'", () => {
    expect(findDrink('Ramos Fizz')?.id, 'serve un alias "Ramos Fizz"').toBe('ramos-gin-fizz')
  })
})

// ---------------------------------------------------------------------------
// Verifica a campione indipendente: dosi lette a mano dal sib.txt (cl -> ml, spoon/cucchiaino = 5 ml)
// ---------------------------------------------------------------------------
type Row =
  | { ids: string[]; kind: 'ml'; ml: number; optional?: boolean }
  | { ids: string[]; kind: 'spoon'; ml: number } // cucchiaino / spoon: 5 ml, unita tsp o barspoon
  | { ids: string[]; kind: 'count'; n: number; unit: 'dash' | 'drop' | 'piece' | 'leaf' }
  | { ids: string[]; kind: 'top' }
  | { ids: string[]; kind: 'any' } // presente, dose non verificata (scelta consapevole o dose non in ml)

const ids = (x: string | string[]) => (Array.isArray(x) ? x : [x])
const cl = (x: string | string[], v: number, optional = false): Row => ({ ids: ids(x), kind: 'ml', ml: Math.round(v * 100) / 10, optional })
const spoon = (x: string | string[], n: number): Row => ({ ids: ids(x), kind: 'spoon', ml: n * 5 })
const cnt = (x: string | string[], n: number, unit: 'dash' | 'drop' | 'piece' | 'leaf'): Row => ({ ids: ids(x), kind: 'count', n, unit })
const top = (x: string | string[]): Row => ({ ids: ids(x), kind: 'top' })
const any = (x: string | string[]): Row => ({ ids: ids(x), kind: 'any' })

/** id del drink -> ingredienti attesi dal SIB. */
const SAMPLE: Record<string, Row[]> = {
  // Unforgettables
  negroni: [cl('gin', 3), cl('campari', 3), cl('sweet-vermouth', 3)],
  'old-fashioned': [cl(['bourbon', 'rye-whiskey'], 4.5), cnt('sugar-cube', 1, 'piece'), cnt('angostura', 1, 'dash'), cnt('water', 1, 'dash')],
  manhattan: [cl(['rye-whiskey', 'bourbon'], 5), cl('sweet-vermouth', 2), cnt('angostura', 1, 'dash')],
  'dry-martini': [cl('gin', 6), cl('dry-vermouth', 1)],
  americano: [cl('campari', 3), cl('sweet-vermouth', 3), top('soda-water')],
  aviation: [cl('gin', 4.5), cl('maraschino-liqueur', 1.5), cl('lemon-juice', 1.5), spoon('creme-de-violette', 1)],
  sidecar: [cl('cognac', 5), cl('triple-sec', 2), cl('lemon-juice', 2)],
  'whiskey-sour': [cl(['bourbon', 'rye-whiskey'], 4.5), cl('lemon-juice', 2.5), cl('simple-syrup', 2), cl('egg-white', 2, true)],
  // Daiquiri: solo rum e zucchero; il succo (limone nel PDF, lime nei nostri dati) e una scelta consapevole
  daiquiri: [cl('white-rum', 6), spoon(['sugar', 'simple-syrup'], 2), any(['lime-juice', 'lemon-juice'])],
  // Contemporary
  margarita: [cl('tequila', 5), cl('triple-sec', 2), cl('lime-juice', 1.5)],
  cosmopolitan: [cl('citrus-vodka', 4), cl('cointreau', 1.5), cl('lime-juice', 1.5), cl('cranberry-juice', 3)],
  mojito: [cl('white-rum', 4.5), cl('lime-juice', 2), cnt('mint', 6, 'leaf'), spoon(['sugar', 'brown-sugar'], 2), top('soda-water')],
  'mai-tai': [
    cl(['jamaican-rum', 'amber-rum'], 3), cl(['rhum-agricole', 'martinique-rum', 'dark-rum'], 3), cl('orange-curacao', 1.5),
    cl('orgeat', 1.5), cl('lime-juice', 3), cl('simple-syrup', 0.75),
  ],
  // Zombie: il Donn's Mix (1,5 cl = 2 parti succo di pompelmo + 1 parte sciroppo di cannella) e scomposto in 10 + 5 ml
  zombie: [
    cl(['jamaican-rum', 'dark-rum'], 4.5), cl('gold-rum', 4.5), cl(['overproof-rum', 'demerara-rum'], 3), cl('lime-juice', 2),
    cl('falernum', 1.5), cl('grapefruit-juice', 1), cl('cinnamon-syrup', 0.5), spoon('grenadine', 1), cnt('angostura', 1, 'dash'),
    cnt(['pernod', 'absinthe'], 6, 'drop'),
  ],
  // New Era
  'espresso-martini': [cl('vodka', 5), cl('kahlua', 3), cl('simple-syrup', 1), cl('espresso', 3)], // "1 espresso" = 30 ml
  'paper-plane': [cl(['bourbon', 'rye-whiskey'], 3), cl('amaro-nonino', 3), cl('aperol', 3), cl('lemon-juice', 3)],
  penicillin: [cl('blended-scotch', 6), cl('islay-scotch', 0.75), cl('lemon-juice', 2.25), cl('honey-syrup', 2.25), any('ginger')],
  'tommys-margarita': [cl(['tequila-blanco', 'tequila'], 6), cl('lime-juice', 3), cl('agave-syrup', 3)],
  barracuda: [cl('gold-rum', 4.5), cl('galliano', 1.5), cl('pineapple-juice', 6), cnt('lime-juice', 1, 'dash'), top('prosecco')],
  illegal: [
    cl('mezcal', 3), cl('overproof-rum', 1.5), cl('falernum', 1.5), spoon('maraschino-liqueur', 1), cl('lime-juice', 2.25),
    cl('simple-syrup', 1.5), any('egg-white'),
  ],
  've-n-to': [cl('grappa', 4.5), cl('lemon-juice', 2.25), cl('honey-syrup', 1.5), cl('chamomile-syrup', 1.5), cl('egg-white', 1, true)],
  // extra
  bramble: [cl('gin', 5), cl('lemon-juice', 2.5), cl('simple-syrup', 1.25), cl('creme-de-mure', 1.5)],
  canchanchara: [cl('white-rum', 6), cl('lime-juice', 1.5), cl('honey', 1.5), cl('water', 5)],
  'aperol-spritz': [cl('prosecco', 9), cl('aperol', 6), top('soda-water')],
}

const MEASURED = new Set(['ml', 'dash', 'drop', 'barspoon', 'tsp', 'top'])

function check(drinkId: string, rows: Row[]): string[] {
  const d = getDrink(drinkId)
  if (!d) return [`${drinkId}: drink inesistente`]
  const out: string[] = []
  const used = new Set<number>()
  for (const r of rows) {
    const idx = d.ingredients.findIndex((i, k) => !used.has(k) && r.ids.includes(i.id))
    const label = r.ids.join('|')
    if (idx < 0) {
      out.push(`${drinkId}, ingrediente ${label}: atteso presente, trovato assente (ingredienti: ${d.ingredients.map((i) => i.id).join(', ')})`)
      continue
    }
    used.add(idx)
    const i = d.ingredients[idx]
    const found = i.unit === 'top' ? 'top' : `${i.amount ?? '?'} ${i.unit}`
    if (r.kind === 'ml') {
      if (i.unit !== 'ml' || Math.abs((i.amount ?? NaN) - r.ml) > 0.01) out.push(`${drinkId}, ingrediente ${i.id}: atteso ${r.ml} ml, trovato ${found}`)
      if (r.optional && !i.optional) out.push(`${drinkId}, ingrediente ${i.id}: atteso opzionale, trovato obbligatorio`)
    } else if (r.kind === 'spoon') {
      const ml = (i.unit === 'tsp' || i.unit === 'barspoon') && i.amount !== undefined ? i.amount * 5 : NaN
      if (Math.abs(ml - r.ml) > 0.01) out.push(`${drinkId}, ingrediente ${i.id}: atteso ${r.ml / 5} cucchiaino/barspoon (${r.ml} ml), trovato ${found}`)
    } else if (r.kind === 'count') {
      if (i.unit !== r.unit || i.amount !== r.n) out.push(`${drinkId}, ingrediente ${i.id}: atteso ${r.n} ${r.unit}, trovato ${found}`)
    } else if (r.kind === 'top') {
      if (i.unit !== 'top') out.push(`${drinkId}, ingrediente ${i.id}: atteso top, trovato ${found}`)
    }
  }
  // ingredienti con dose non previsti dal SIB (le guarnizioni opzionali sono ammesse)
  d.ingredients.forEach((i, k) => {
    if (used.has(k) || i.optional) return
    if (MEASURED.has(i.unit)) out.push(`${drinkId}, ingrediente ${i.id}: atteso assente (non nel SIB), trovato ${i.amount ?? ''} ${i.unit}`)
  })
  return out
}

describe('SIB: verifica a campione indipendente (dosi in ml)', () => {
  it('il campione copre almeno 20 drink in tutte e tre le sezioni', () => {
    const tags = new Set(Object.keys(SAMPLE).map((id) => getDrink(id)?.iba))
    expect(Object.keys(SAMPLE).length).toBeGreaterThanOrEqual(20)
    expect(tags).toEqual(new Set(['unforgettable', 'contemporary', 'new-era']))
  })

  it('tutti gli ingredienti dei drink campionati esistono nel catalogo', () => {
    const missing: string[] = []
    for (const drinkId of Object.keys(SAMPLE)) {
      const d = getDrink(drinkId)
      if (!d) continue
      for (const i of d.ingredients) if (!getIngredient(i.id)) missing.push(`${drinkId}: ${i.id}`)
    }
    expect(missing).toEqual([])
  })

  it.each(Object.entries(SAMPLE))('%s: ingredienti e ml come nel SIB', (drinkId, rows) => {
    const problems = check(drinkId, rows)
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('il verificatore segnala un numero sbagliato (autotest)', () => {
    const p = check('negroni', [cl('gin', 3.5), cl('campari', 3), cl('sweet-vermouth', 3)])
    expect(p).toHaveLength(1)
    expect(p[0]).toMatch(/negroni, ingrediente gin: atteso 35 ml, trovato 30 ml/)
  })
})

// ---------------------------------------------------------------------------
// Confronto automatico di TUTTI i drink del SIB (solo se il sib.txt e disponibile)
// ---------------------------------------------------------------------------
/** Differenze note e consapevoli tra SIB e nostri dati (solo ml). */
const KNOWN_ML_DIFF: Record<string, string> = {
  zombie: "Donn's Mix 1,5 cl scomposto in 1 cl pompelmo + 0,5 cl sciroppo di cannella",
  'espresso-martini': '"1 espresso" reso con 30 ml di espresso',
}

/** Dash: il SIB cita Tabasco senza dose, noi usiamo 2 dash */
const KNOWN_DASH_DIFF: Record<string, string> = {
  'bloody-mary': 'Tabasco senza dose nel SIB, 2 dash da noi',
  'pisco-sour': 'Angostura in cima: nel SIB e solo nella decorazione, da noi 3 dash opzionali',
}

function parseSib() {
  const t = readFileSync(SIB_PATH, 'utf8').replace(/\r/g, '')
  const blocks = t.match(/^[^\n]+\n\s*INGREDIENTI[\s\S]*?\n\s*PREPARAZIONE/gm) ?? []
  const re = /^\s*([^\n(]+?)\s*\(([^)\n]+)\)?\s*\n\s*INGREDIENTI\s*\n([\s\S]*?)\n\s*PREPARAZIONE/
  return blocks.map((b) => {
    const m = re.exec(b)!
    const txt = m[3].replace(/\n/g, ' ')
    const frac = (s: string) => (s.includes('⁄') ? Number(s.split('⁄')[0]) / Number(s.split('⁄')[1]) : Number(s.replace(',', '.')))
    return {
      name: m[1].replace('DRNK', 'DRINK'),
      mlList: [...txt.matchAll(/(\d+(?:,\d+)?)\s*cl\b/g)].map((x) => Math.round(frac(x[1]) * 100) / 10).sort((a, b) => a - b),
      spoonMl: [...txt.matchAll(/(\d⁄\d|\d+(?:,\d+)?)\s*(?:spoon|cucchiai\w*)/g)].reduce((s, x) => s + frac(x[1]) * 5, 0),
      dashes: [...txt.matchAll(/(\d+)\s*dash/gi)].reduce((s, x) => s + Number(x[1]), 0),
    }
  })
}

describe.skipIf(!HAS_SIB)('SIB: confronto automatico di tutti i drink con il sib.txt', () => {
  const sib = HAS_SIB ? parseSib() : []

  it('il sib.txt contiene 90 ricette', () => expect(sib).toHaveLength(90))

  it('ogni ricetta del SIB ha una scheda nei nostri dati', () => {
    const miss = sib.filter((s) => !findDrink(s.name)).map((s) => s.name)
    expect(miss, `senza scheda: ${miss.join(', ')}`).toEqual([])
  })

  it('le dosi in cl (convertite in ml) coincidono per tutte le ricette (salvo le differenze note)', () => {
    const problems: string[] = []
    for (const s of sib) {
      const d = findDrink(s.name)
      if (!d || KNOWN_ML_DIFF[d.id]) continue
      const ours = d.ingredients.filter((i) => i.unit === 'ml').map((i) => i.amount!).sort((a, b) => a - b)
      if (JSON.stringify(ours) !== JSON.stringify(s.mlList))
        problems.push(`${d.id}: ml attesi [${s.mlList.join(', ')}], trovati [${ours.join(', ')}]`)
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('cucchiaini/spoon (5 ml) e dash coincidono per tutte le ricette', () => {
    const problems: string[] = []
    for (const s of sib) {
      const d = findDrink(s.name)
      if (!d) continue
      const spoonMl = d.ingredients.filter((i) => i.unit === 'tsp' || i.unit === 'barspoon').reduce((a, i) => a + (i.amount ?? 0) * 5, 0)
      const dashes = d.ingredients.filter((i) => i.unit === 'dash').reduce((a, i) => a + (i.amount ?? 0), 0)
      if (Math.abs(spoonMl - s.spoonMl) > 0.01) problems.push(`${d.id}: cucchiaini attesi ${s.spoonMl / 5}, trovati ${spoonMl / 5}`)
      if (dashes !== s.dashes && !KNOWN_DASH_DIFF[d.id]) problems.push(`${d.id}: dash attesi ${s.dashes}, trovati ${dashes}`)
    }
    expect(problems, problems.join('\n')).toEqual([])
  })
})

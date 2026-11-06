import Fuse from 'fuse.js'
import type { Base, Drink, Lang } from '../data/types'
import { allDrinks, getIngredient } from './catalog'
import { normalize } from './normalize'

export interface SearchResult {
  drink: Drink
  /** 0..1, piu alto = migliore (1 = match esatto) */
  score: number
  /** su cosa ha matchato: "name", "alias: X", "ingredient: X", "family" */
  matched?: string
}

interface Rec {
  drink: Drink
  name: string
  aliases: string[]
  ingredients: string[]
  family: string
}

let fuse: Fuse<Rec> | null = null
let recs: Rec[] = []

function build() {
  recs = allDrinks.map((drink) => {
    const names: string[] = []
    for (const di of drink.ingredients) {
      const ing = getIngredient(di.id)
      if (ing) names.push(normalize(ing.name.it), normalize(ing.name.en))
      else names.push(normalize(di.id))
    }
    return {
      drink,
      name: normalize(drink.name),
      aliases: drink.aliases.map(normalize),
      ingredients: [...new Set(names)],
      family: normalize(drink.family),
    }
  })
  fuse = new Fuse(recs, {
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.4,
    minMatchCharLength: 2,
    keys: [
      { name: 'name', weight: 3 },
      { name: 'aliases', weight: 2.5 },
      { name: 'ingredients', weight: 1.2 },
      { name: 'family', weight: 0.8 },
    ],
  })
}

interface Hit extends SearchResult {
  exact: boolean
}

export function searchDrinks(q: string, _lang: Lang, limit = 20): SearchResult[] {
  const nq = normalize(q)
  if (!nq) return []
  if (!fuse) build()
  const out: Hit[] = (fuse as Fuse<Rec>).search(nq).map((r) => {
    const rec = r.item
    const exactName = rec.name === nq
    const aliasIdx = rec.aliases.indexOf(nq)
    let matched: string | undefined
    if (exactName) matched = 'name'
    else if (aliasIdx >= 0) matched = `alias: ${rec.drink.aliases[aliasIdx]}`
    else {
      const m = r.matches?.[0]
      if (m?.key === 'name') matched = 'name'
      else if (m?.key === 'aliases') matched = `alias: ${rec.drink.aliases[m.refIndex ?? 0] ?? ''}`
      else if (m?.key === 'ingredients') matched = `ingredient: ${m.value ?? ''}`
      else if (m?.key === 'family') matched = 'family'
    }
    const exact = exactName || aliasIdx >= 0
    return { drink: rec.drink, score: exact ? 1 : Math.min(0.99, 1 - (r.score ?? 1)), matched, exact }
  })
  for (const rec of recs) {
    if ((rec.name === nq || rec.aliases.includes(nq)) && !out.some((o) => o.drink.id === rec.drink.id)) {
      out.push({ drink: rec.drink, score: 1, matched: rec.name === nq ? 'name' : 'alias', exact: true })
    }
  }
  out.sort(
    (a, b) =>
      Number(b.exact) - Number(a.exact) ||
      b.score - a.score ||
      Number(!!b.drink.popular) - Number(!!a.drink.popular),
  )
  return out.slice(0, limit).map((h) => ({ drink: h.drink, score: h.score, matched: h.matched }))
}

export function popularDrinks(limit = 12): Drink[] {
  return allDrinks.filter((d) => d.popular).slice(0, limit)
}

export function drinksByBase(base: Base): Drink[] {
  return allDrinks.filter((d) => d.base.includes(base))
}

import type { Drink } from '../data/types'
import { allDrinks, allIngredients, getIngredient } from './catalog'

export type PantryInput = Set<string> | string[]
export const toSet = (p: PantryInput): Set<string> => (p instanceof Set ? p : new Set(p))

export interface DrinkCheck {
  status: 'ok' | 'substitute' | 'missing'
  missing: string[]
  subs: { from: string; to: string }[]
}

const Q = { great: 0, good: 1, emergency: 2 } as const

export function checkDrink(drink: Drink, pantry: PantryInput): DrinkCheck {
  const have = toSet(pantry)
  const missing: string[] = []
  const subs: { from: string; to: string }[] = []
  for (const di of drink.ingredients) {
    if (di.optional) continue
    const ing = getIngredient(di.id)
    if (ing?.assumed || ing?.category === 'garnish') continue
    if (have.has(di.id)) continue
    const best = ing?.substitutes
      .filter((s) => have.has(s.id))
      .sort((a, b) => Q[a.quality] - Q[b.quality])[0]
    if (best) subs.push({ from: di.id, to: best.id })
    else missing.push(di.id)
  }
  const status = missing.length ? 'missing' : subs.length ? 'substitute' : 'ok'
  return { status, missing, subs }
}

export function drinksICanMake(pantry: PantryInput): {
  ready: Drink[]
  withSubs: Drink[]
  missingOne: { drink: Drink; missing: string }[]
} {
  const have = toSet(pantry)
  const ready: Drink[] = []
  const withSubs: Drink[] = []
  const missingOne: { drink: Drink; missing: string }[] = []
  for (const d of allDrinks) {
    const c = checkDrink(d, have)
    if (c.status === 'ok') ready.push(d)
    else if (c.status === 'substitute') withSubs.push(d)
    else if (c.missing.length === 1) missingOne.push({ drink: d, missing: c.missing[0] })
  }
  return { ready, withSubs, missingOne }
}

export const BASIC_KIT: string[] = allIngredients.filter((i) => i.basic).map((i) => i.id)

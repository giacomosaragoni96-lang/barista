import type { Drink, Ingredient, L10n, Substitute } from '../data/types'
import { allDrinks, getDrink, getIngredient, ingName } from './catalog'
import { checkDrink, toSet, type PantryInput } from './pantry'

const Q = { great: 0, good: 1, emergency: 2 } as const

export interface SubstituteInfo {
  ingredient: Ingredient
  quality: Substitute['quality']
  note: L10n
  inPantry?: boolean
}

export function getSubstitutes(ingId: string, pantry?: PantryInput): SubstituteInfo[] {
  const ing = getIngredient(ingId)
  if (!ing) return []
  const have = pantry ? toSet(pantry) : undefined
  const out: SubstituteInfo[] = []
  for (const s of ing.substitutes) {
    const sub = getIngredient(s.id)
    if (!sub) continue
    out.push({ ingredient: sub, quality: s.quality, note: s.note, inPantry: have ? have.has(s.id) : undefined })
  }
  return out.sort((a, b) => Number(!!b.inPantry) - Number(!!a.inPantry) || Q[a.quality] - Q[b.quality])
}

export interface SimilarDrink {
  drink: Drink
  reason: L10n
  feasible?: boolean
}

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1)

export function getSimilarDrinks(
  drinkId: string,
  missing: string[],
  pantry?: PantryInput,
  limit = 4,
): SimilarDrink[] {
  const src = getDrink(drinkId)
  if (!src) return []
  const srcIngs = new Set(src.ingredients.map((i) => i.id))
  const scored: { drink: Drink; score: number; sameFam: boolean; sameBase: string[] }[] = []
  for (const d of allDrinks) {
    if (d.id === drinkId) continue
    if (d.ingredients.some((i) => missing.includes(i.id))) continue
    const sameFam = d.family === src.family
    const sameBase = d.base.filter((b) => b !== 'none' && src.base.includes(b))
    const common = d.ingredients.filter((i) => srcIngs.has(i.id)).length
    const tastes = d.taste.filter((t) => src.taste.includes(t)).length
    const score = (sameFam ? 3 : 0) + (sameBase.length ? 3 : 0) + common + tastes * 0.5
    if (score > 0) scored.push({ drink: d, score, sameFam, sameBase })
  }
  scored.sort((a, b) => b.score - a.score || Number(!!b.drink.popular) - Number(!!a.drink.popular))
  return scored.slice(0, limit).map((s) => {
    const it: string[] = []
    const en: string[] = []
    if (s.sameFam) {
      it.push(`Stessa famiglia (${s.drink.family})`)
      en.push(`Same family (${s.drink.family})`)
    }
    if (s.sameBase.length) {
      it.push(`stessa base (${s.sameBase[0]})`)
      en.push(`same base (${s.sameBase[0]})`)
    }
    if (!it.length) {
      const shared = s.drink.ingredients.find((i) => srcIngs.has(i.id))
      it.push(shared ? `Ingrediente in comune (${ingName(shared.id, 'it')})` : 'Gusto simile')
      en.push(shared ? `Shared ingredient (${ingName(shared.id, 'en')})` : 'Similar taste')
    }
    return {
      drink: s.drink,
      reason: { it: cap(it.join(', ')), en: cap(en.join(', ')) },
      feasible: pantry ? checkDrink(s.drink, pantry).status !== 'missing' : undefined,
    }
  })
}

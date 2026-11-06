import type { Drink, Ingredient } from '../types'
import { drinks as d1, extraIngredients as e1 } from './iba-unforgettables'
import { drinks as d2, extraIngredients as e2 } from './iba-contemporary'
import { drinks as d3, extraIngredients as e3 } from './iba-new-era'
import { drinks as d4, extraIngredients as e4 } from './italiani-aperitivi'
import { drinks as d5, extraIngredients as e5 } from './classici-highball'
import { drinks as d6, extraIngredients as e6 } from './tiki-tropicali'
import { drinks as d7, extraIngredients as e7 } from './shot-party'
import { drinks as d8, extraIngredients as e8 } from './mocktail'

function dedupById<T extends { id: string }>(lists: T[][]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of lists.flat()) {
    if (seen.has(item.id)) continue // il primo vince
    seen.add(item.id)
    out.push(item)
  }
  return out
}

export const allDrinks: Drink[] = dedupById<Drink>([d1, d2, d3, d4, d5, d6, d7, d8])
export const allExtraIngredients: Ingredient[] = dedupById<Ingredient>([e1, e2, e3, e4, e5, e6, e7, e8])

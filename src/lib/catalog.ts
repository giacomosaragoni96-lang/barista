import type { Drink, Ingredient, IngredientCategory, Lang } from '../data/types'
import { ingredients } from '../data/ingredients'
import { allDrinks as drinksList, allExtraIngredients } from '../data/drinks'

export const allDrinks: Drink[] = drinksList

function dedup(list: Ingredient[]): Ingredient[] {
  const seen = new Set<string>()
  return list.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)))
}

export const allIngredients: Ingredient[] = dedup([...ingredients, ...allExtraIngredients])

const drinkMap = new Map(allDrinks.map((d) => [d.id, d]))
const ingMap = new Map(allIngredients.map((i) => [i.id, i]))

export const getDrink = (id: string): Drink | undefined => drinkMap.get(id)
export const getIngredient = (id: string): Ingredient | undefined => ingMap.get(id)

/** "lime-juice" -> "Lime juice" */
function readable(id: string): string {
  const s = id.replace(/-/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function ingName(id: string, lang: Lang): string {
  const ing = ingMap.get(id)
  return ing?.name[lang] || ing?.name.en || readable(id)
}

export function ingredientsByCategory(): Map<IngredientCategory, Ingredient[]> {
  const out = new Map<IngredientCategory, Ingredient[]>()
  for (const i of allIngredients) {
    const arr = out.get(i.category)
    if (arr) arr.push(i)
    else out.set(i.category, [i])
  }
  return out
}

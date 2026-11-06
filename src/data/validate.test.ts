import { describe, expect, test } from 'vitest'
import { ingredients } from './ingredients'
import { allDrinks, allIngredients } from '../lib/catalog'

const ids = new Set(allIngredients.map((i) => i.id))
const filled = (l: { it: string; en: string }) => !!l && l.it.trim() !== '' && l.en.trim() !== ''

describe('validazione dati', () => {
  test('conteggi (avviso)', () => {
    console.warn(`[validate] drink: ${allDrinks.length} (obiettivo >= 150), ingredienti: ${allIngredients.length}`)
  })

  test('id e nomi drink unici', () => {
    const dupIds = allDrinks.map((d) => d.id).filter((id, i, a) => a.indexOf(id) !== i)
    const names = allDrinks.map((d) => d.name.toLowerCase())
    const dupNames = names.filter((n, i) => names.indexOf(n) !== i)
    expect(dupIds).toEqual([])
    expect(dupNames).toEqual([])
  })

  test('nessun id duplicato in ingredients.ts', () => {
    const all = ingredients.map((i) => i.id)
    expect(all.filter((id, i) => all.indexOf(id) !== i)).toEqual([])
  })

  test('ingredienti dei drink e sostituti esistono', () => {
    const bad: string[] = []
    for (const d of allDrinks) for (const i of d.ingredients) if (!ids.has(i.id)) bad.push(`${d.id}: ${i.id}`)
    for (const ing of allIngredients)
      for (const s of ing.substitutes) if (!ids.has(s.id)) bad.push(`sostituto di ${ing.id}: ${s.id}`)
    expect(bad).toEqual([])
  })

  test('drink completi', () => {
    const bad: string[] = []
    for (const d of allDrinks) {
      if (d.steps.length < 2) bad.push(`${d.id}: meno di 2 passi`)
      if (!filled(d.description)) bad.push(`${d.id}: description`)
      if (!filled(d.garnish)) bad.push(`${d.id}: garnish`)
      if (d.steps.some((s) => !filled(s))) bad.push(`${d.id}: steps`)
      const ml = d.ingredients.reduce((t, i) => t + (i.unit === 'ml' ? (i.amount ?? 0) : 0), 0)
      if (ml > 450) bad.push(`${d.id}: ${ml} ml > 450`)
      if (d.family === 'mocktail' && d.abv !== 0) bad.push(`${d.id}: mocktail con abv ${d.abv}`)
      if (!/^#[0-9a-fA-F]{6}$/.test(d.color)) bad.push(`${d.id}: colore ${d.color}`)
    }
    expect(bad).toEqual([])
  })
})

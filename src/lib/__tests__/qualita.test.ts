import { describe, it, expect } from 'vitest'
import { searchDrinks } from '../search'
import { getSubstitutes, getSimilarDrinks } from '../alternatives'
import { checkDrink, BASIC_KIT } from '../pantry'
import { formatAmount } from '../units'
import { getDrink } from '../catalog'

const ids = (q: string, n = 5) => searchDrinks(q, 'it').slice(0, n).map((r) => r.drink.id)

describe('ricerca', () => {
  it('negroni sbagliato primo', () => expect(ids('negroni sbagliato')[0]).toBe('negroni-sbagliato'))
  it('margherita -> margarita nei primi 2', () => expect(ids('margherita', 2)).toContain('margarita'))
  it('spriz / spritz -> aperol-spritz nei primi 3', () => {
    expect(ids('spriz', 3)).toContain('aperol-spritz')
    expect(ids('spritz', 3)).toContain('aperol-spritz')
  })
  it('aperol trova drink con aperol', () => {
    const r = searchDrinks('aperol', 'it')
    expect(r.length).toBeGreaterThan(1)
    expect(r.some((x) => x.drink.ingredients.some((i) => i.id === 'aperol'))).toBe(true)
  })
  it('moscow mul', () => expect(ids('moscow mul', 3)).toContain('moscow-mule'))
  it('gin tonic primo', () => expect(ids('gin tonic')[0]).toBe('gin-tonic'))
  it.each([
    ['espresso martini', 'espresso-martini'],
    ['pornstar', 'pornstar-martini'],
    ['sex on the beach', 'sex-on-the-beach'],
    ['long island', 'long-island-iced-tea'],
  ])('%s primo', (q, id) => expect(ids(q)[0]).toBe(id))
  it('input vuoto / assurdo non rompe', () => {
    expect(searchDrinks('', 'it')).toEqual([])
    expect(searchDrinks('   ', 'it')).toEqual([])
    expect(() => searchDrinks('((**[[\\', 'it')).not.toThrow()
    expect(searchDrinks('zzzqqqxxx', 'it')).toEqual([])
  })
})

describe('sostituti e simili', () => {
  it('aperol -> select', () => expect(getSubstitutes('aperol').map((s) => s.ingredient.id)).toContain('select'))
  it('simili di negroni senza campari, max 4', () => {
    const s = getSimilarDrinks('negroni', ['campari'])
    expect(s.length).toBeLessThanOrEqual(4)
    for (const x of s) expect(x.drink.ingredients.some((i) => i.id === 'campari')).toBe(false)
  })
  it('checkDrink negroni kit base ok', () => {
    expect(checkDrink(getDrink('negroni')!, BASIC_KIT).status).toBe('ok')
  })
  it('checkDrink negroni solo gin', () => {
    const c = checkDrink(getDrink('negroni')!, ['gin'])
    expect(c.missing).toContain('campari')
    expect(c.missing).toContain('sweet-vermouth')
  })
})

describe('formatAmount', () => {
  it('oz', () => expect(formatAmount(45, 'ml', 'oz', 1, 'en')).toBe('1.5 oz'))
  it('cl', () => expect(formatAmount(45, 'ml', 'cl', 1, 'it')).toBe('4,5 cl'))
  it('top', () => expect(formatAmount(undefined, 'top', 'ml', 1, 'it')).toMatch(/colmare|top/i))
})

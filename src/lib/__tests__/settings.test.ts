import { describe, it, expect, beforeEach, vi } from 'vitest'
import { localRepo } from '../storage/localRepo'
import { defaultSettings, normalizeSettings, withLang, withUnits } from '../storage/repo'
import { currencyForLang, formatPrice, prices } from '../../config/pricing'

const KEY = 'barista:v1:settings'
let store: Record<string, string>

beforeEach(() => {
  store = {}
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => void (store[k] = v),
    removeItem: (k: string) => void delete store[k],
  })
  vi.stubGlobal('navigator', { language: 'en-US' })
})

describe('impostazioni iniziali', () => {
  it('prima visita browser en -> en + oz', async () => {
    expect(await localRepo.getSettings()).toBeNull()
    expect(defaultSettings()).toMatchObject({ lang: 'en', units: 'oz' })
  })
  it('prima visita it-IT -> it + ml', () => {
    vi.stubGlobal('navigator', { language: 'it-IT' })
    expect(defaultSettings()).toMatchObject({ lang: 'it', units: 'ml' })
  })
  it('lingua non italiana -> en', () => {
    vi.stubGlobal('navigator', { language: 'de-DE' })
    expect(defaultSettings().lang).toBe('en')
  })
})

describe('cambio lingua e unita', () => {
  it('senza scelta le unita seguono la lingua', () => {
    const s = withLang(defaultSettings(), 'it')
    expect(s).toMatchObject({ lang: 'it', units: 'ml' })
    expect(withLang(s, 'en').units).toBe('oz')
  })
  it('se l utente sceglie cl e poi cambia lingua resta cl', () => {
    let s = withUnits(defaultSettings(), 'cl')
    expect(s.unitsChosen).toBe(true)
    s = withLang(s, 'it')
    expect(s).toMatchObject({ lang: 'it', units: 'cl' })
    expect(withLang(s, 'en').units).toBe('cl')
  })
})

describe('migrazione impostazioni salvate', () => {
  it('lang it + units ml senza unitsChosen -> segue il default', async () => {
    store[KEY] = JSON.stringify({ lang: 'it', units: 'ml' })
    const s = (await localRepo.getSettings())!
    expect(s.unitsChosen).toBe(false)
    expect(withLang(s, 'en').units).toBe('oz')
  })
  it('lang en + units ml senza unitsChosen -> scelta fatta, resta ml', async () => {
    store[KEY] = JSON.stringify({ lang: 'en', units: 'ml' })
    const s = (await localRepo.getSettings())!
    expect(s).toMatchObject({ lang: 'en', units: 'ml', unitsChosen: true })
    expect(withLang(s, 'it').units).toBe('ml')
  })
  it('unitsChosen salvato ha la precedenza', () => {
    expect(normalizeSettings({ lang: 'en', units: 'oz', unitsChosen: true })).toMatchObject({
      units: 'oz',
      unitsChosen: true,
    })
  })
  it('dati non validi -> null', async () => {
    store[KEY] = JSON.stringify({ lang: 'fr', units: 'gal' })
    expect(await localRepo.getSettings()).toBeNull()
  })
  it('settings parziali: lingua mancante usa quella del browser', async () => {
    vi.stubGlobal('navigator', { language: 'it-IT' })
    store[KEY] = JSON.stringify({ units: 'cl' })
    expect(await localRepo.getSettings()).toMatchObject({ lang: 'it', units: 'cl', unitsChosen: true })
  })
  it('setSettings/getSettings round trip', async () => {
    await localRepo.setSettings(withUnits(defaultSettings(), 'cl'))
    expect(await localRepo.getSettings()).toMatchObject({ lang: 'en', units: 'cl', unitsChosen: true })
  })
})

describe('prezzi per lingua', () => {
  it('valuta per lingua', () => {
    expect(currencyForLang('en')).toBe('USD')
    expect(currencyForLang('it')).toBe('EUR')
    expect(prices.EUR.monthly).toBe(4.99)
  })
  it('formatPrice en-US e it-IT', () => {
    expect(formatPrice(4.99, 'en')).toBe('$4.99')
    expect(formatPrice(39, 'en')).toBe('$39')
    expect(formatPrice(4.99, 'it').replace(/\s/g, ' ')).toBe('4,99 €')
    expect(formatPrice(39, 'it').replace(/\s/g, ' ')).toBe('39 €')
    expect(formatPrice(4.99, 'it', 'USD')).toContain('4,99')
  })
})

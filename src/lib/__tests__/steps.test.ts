import { describe, it, expect } from 'vitest'
import { allDrinks, ingName } from '../catalog'
import { parseStep, GESTURES } from '../steps'
import type { Lang } from '../../data/types'

const LANGS: Lang[] = ['it', 'en']

type Part = { text: string; bold: boolean }
type Row = { id: string; lang: Lang; text: string; gesture: string; parts: Part[] }

const rows: Row[] = []
for (const d of allDrinks) {
  for (const lang of LANGS) {
    const names = d.ingredients.map((i) => ingName(i.id, lang))
    for (const s of d.steps) {
      const text = s[lang]
      const r = parseStep(text, lang, names)
      rows.push({ id: d.id, lang, text, gesture: r.gesture, parts: r.parts })
    }
  }
}

const show = (r: Row) =>
  `${r.id} [${r.lang}] "${r.text}" -> ${r.gesture} | ${r.parts.map((p) => (p.bold ? `**${p.text}**` : p.text)).join('')}`

const boldOf = (r: { parts: Part[] }) => r.parts.filter((p) => p.bold).map((p) => p.text).join('|')

describe('steps: tutti i passi del catalogo', () => {
  it('ci sono passi da provare', () => expect(rows.length).toBeGreaterThan(100))

  it('gesto sempre valido', () => {
    const bad = rows.filter((r) => !GESTURES.includes(r.gesture as never))
    expect(bad.map(show)).toEqual([])
  })

  it('testo ricomposto identico, nessun segmento vuoto, nessun segmento adiacente con stesso bold', () => {
    const bad: string[] = []
    for (const r of rows) {
      const joined = r.parts.map((p) => p.text).join('')
      if (joined !== r.text) bad.push('RICOMPOSTO ' + show(r))
      if (r.parts.some((p) => p.text.length === 0)) bad.push('VUOTO ' + show(r))
      for (let i = 1; i < r.parts.length; i++) {
        if (r.parts[i].bold === r.parts[i - 1].bold) {
          bad.push('ADIACENTI ' + show(r))
          break
        }
      }
    }
    expect(bad).toEqual([])
  })

  it('ogni passo ha almeno un segmento in grassetto', () => {
    const bad = rows.filter((r) => !r.parts.some((p) => p.bold)).map(show)
    expect(bad).toEqual([])
  })

  it('il grassetto non supera il 60% dei caratteri (passi oltre 40 caratteri)', () => {
    const bad: string[] = []
    for (const r of rows) {
      const boldLen = r.parts.filter((p) => p.bold).reduce((n, p) => n + p.text.length, 0)
      if (r.text.length > 40 && boldLen > 0.6 * r.text.length) bad.push(`BOLD ${Math.round((100 * boldLen) / r.text.length)}% ` + show(r))
    }
    // eslint-disable-next-line no-console
    console.log('BOLD>60%: ' + bad.length + '/' + rows.length + ' passi')
    expect(bad).toEqual([])
  })

  it("'other' al massimo nel 3% dei passi", () => {
    const others = rows.filter((r) => r.gesture === 'other')
    // eslint-disable-next-line no-console
    console.log(
      `PASSI 'other': ${others.length}/${rows.length}\n` + others.map((r) => `${r.id} [${r.lang}] "${r.text}"`).join('\n'),
    )
    expect(others.length).toBeLessThanOrEqual(Math.floor(rows.length * 0.03))
  })

  it('campione di 10 passi (stampa gesto e grassetto)', () => {
    const step = Math.max(1, Math.floor(rows.length / 10))
    const sample = Array.from({ length: 10 }, (_, i) => rows[(i * step + 7) % rows.length])
    // eslint-disable-next-line no-console
    console.log('CAMPIONE\n' + sample.map(show).join('\n'))
    expect(sample.length).toBe(10)
  })
})

describe('steps: coerenza col drink', () => {
  const expected: Record<string, string[]> = {
    shake: ['shake', 'dry-shake'],
    'dry-shake': ['dry-shake', 'shake'],
    stir: ['stir'],
    muddle: ['muddle'],
    blend: ['blend', 'whip'],
    layer: ['layer'],
  }
  for (const lang of LANGS) {
    it(`la tecnica del drink compare nei gesti dei passi (${lang})`, () => {
      const bad: string[] = []
      for (const d of allDrinks) {
        const names = d.ingredients.map((i) => ingName(i.id, lang))
        const parsed = d.steps.map((s) => ({ text: s[lang], g: parseStep(s[lang], lang, names).gesture as string }))
        for (const t of d.technique) {
          const want = expected[t]
          if (!want) continue
          if (!parsed.some((p) => want.includes(p.g))) {
            bad.push(
              `${d.id} (${d.name}) tecnica=${t} manca ${want.join('/')}:\n   ` +
                parsed.map((p) => `${p.g}: "${p.text}"`).join('\n   '),
            )
          }
        }
      }
      expect(bad).toEqual([])
    })
  }
})

describe('steps: esempi fissi', () => {
  it('it: shake con tempo in grassetto', () => {
    const r = parseStep('Aggiungi ghiaccio e shakera energicamente 10-12 secondi.', 'it')
    expect(r.gesture).toBe('shake')
    expect(r.parts.some((p) => p.bold && p.text.includes('10-12 secondi'))).toBe(true)
  })

  it.each([
    ['Pesta e mescola', 'muddle'],
    ['Raffredda il bicchiere con ghiaccio.', 'chill'],
    ['Riempi di ghiaccio tritato.', 'ice'],
    ['Versa lentamente sul dorso del cucchiaio.', 'layer'],
    ['Spremi la scorza di arancia sul drink e usala per guarnire.', 'express'],
  ])('it: "%s" -> %s', (text, g) => {
    const r = parseStep(text, 'it')
    expect(r.gesture).toBe(g)
    expect(r.parts.map((p) => p.text).join('')).toBe(text)
  })

  it('en: shake con tempo in grassetto', () => {
    const r = parseStep('Shake hard for 10-12 seconds.', 'en')
    expect(r.gesture).toBe('shake')
    expect(r.parts.some((p) => p.bold && p.text.includes('10-12 seconds'))).toBe(true)
  })

  it.each([
    ['Chill the glass with ice.', 'chill'],
    ['Strain into the glass.', 'strain'],
    ['Top up with soda.', 'top'],
    ['Fill with crushed ice.', 'ice'],
    ['Muddle the mint gently.', 'muddle'],
    ['Stir for 30 seconds.', 'stir'],
    ['Pour slowly over the back of a spoon.', 'layer'],
    ['Express the orange peel over the drink and use it to garnish.', 'express'],
  ])('en: "%s" -> %s', (text, g) => {
    const r = parseStep(text, 'en')
    expect(r.gesture).toBe(g)
    expect(r.parts.map((p) => p.text).join('')).toBe(text)
  })

  it('ingrediente passato (anche sostituto) finisce in grassetto', () => {
    const it1 = parseStep('Versa Select e prosecco nel bicchiere.', 'it', ['Select', 'Prosecco'])
    expect(boldOf(it1)).toContain('Select')
    const en1 = parseStep('Add Select and soda to the glass.', 'en', ['Select', 'Soda water'])
    expect(boldOf(en1)).toContain('Select')
  })

  it('"Non mescolare" / "Do not stir" non e stir', () => {
    expect(parseStep('Non mescolare: il cassis si integra da solo.', 'it').gesture).not.toBe('stir')
    expect(parseStep('Do not stir: the cassis mixes on its own.', 'en').gesture).not.toBe('stir')
  })

  it('"Versa ... e mescola" non e mai whip', () => {
    expect(['stir', 'pour']).toContain(parseStep('Versa 40 ml di whisky e mescola 3 giri.', 'it', ['Whisky']).gesture)
    expect(['stir', 'pour']).toContain(parseStep('Pour 40 ml of whisky and stir 3 times.', 'en', ['Whisky']).gesture)
    expect(parseStep('Versa whiskey, zucchero di canna e caffè caldo.', 'it', ['Whiskey']).gesture).not.toBe('whip')
    expect(parseStep('Pour in whiskey, brown sugar and hot coffee.', 'en', ['Whiskey']).gesture).not.toBe('whip')
  })

  it('senza ingredientNames non va in errore', () => {
    expect(() => parseStep('Versa Select nel bicchiere.', 'it')).not.toThrow()
  })
})

describe('steps: robustezza', () => {
  const weird: string[] = [
    '',
    '   ',
    '\n\t',
    'Lorem ipsum dolor sit amet.',
    '🍸🍸🍸',
    'Shake 🍸 hard ✨ for 10 s',
    '٣ مل — 日本語のテキスト',
    '((**[[\\ .* $^ +?',
    '<script>alert(1)</script>',
    '10',
    '.',
    'a'.repeat(5000),
    'Mescola '.repeat(200),
    'Aggiungi Ünïcödé-Liqueur (50%) e shakera',
  ]
  const nameSets: (string[] | undefined)[] = [undefined, [], ['', ' ', '.*', '((', 'Ünïcödé-Liqueur', '🍸']]
  for (const lang of LANGS) {
    it.each(weird.map((w) => [w.length > 40 ? w.slice(0, 40) + '...' : JSON.stringify(w), w]))(
      `${lang}: %s non lancia e conserva il testo`,
      (_label, text) => {
        for (const names of nameSets) {
          const r = parseStep(text, lang, names)
          expect(GESTURES).toContain(r.gesture)
          expect(r.parts.map((p) => p.text).join('')).toBe(text)
          expect(r.parts.every((p) => p.text.length > 0)).toBe(true)
        }
      },
    )
  }
})

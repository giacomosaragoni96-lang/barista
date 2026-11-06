// TEMPORANEO: drink di prova solo in memoria (se l'archivio è vuoto). Da rimuovere.
import { drinks } from './data/drinks/mocktail'

if (drinks.length === 0) {
  drinks.push(
    {
      id: 'negroni', name: 'Negroni', aliases: [], description: { it: 'Amaro, secco e potente: il re degli aperitivi.', en: 'Bitter, dry and bold.' },
      base: ['gin'], family: 'spirit-forward', glass: 'rocks', technique: ['stir'], ice: 'big-cube',
      ingredients: [{ id: 'gin', amount: 30, unit: 'ml' }, { id: 'campari', amount: 30, unit: 'ml' }, { id: 'sweet-vermouth', amount: 30, unit: 'ml' }, { id: 'orange-slice', unit: 'slice', optional: true }],
      garnish: { it: 'Fetta d\'arancia', en: 'Orange slice' },
      steps: [{ it: 'Versa tutto nel bicchiere con ghiaccio.', en: 'Pour all into the glass with ice.' }, { it: 'Mescola 20 secondi.', en: 'Stir 20 seconds.' }],
      tip: { it: 'Ghiaccio grande: si diluisce più piano.', en: 'Big ice dilutes slower.' },
      difficulty: 1, timeMin: 2, abv: 24, taste: ['bitter', 'strong'], popular: true, color: '#B3202A',
    },
    {
      id: 'daiquiri', name: 'Daiquiri', aliases: [], description: { it: 'Rum, lime e zucchero: perfetto equilibrio.', en: 'Rum, lime, sugar.' },
      base: ['rum'], family: 'sour', glass: 'coupe', technique: ['shake'], ice: 'none',
      ingredients: [{ id: 'white-rum', amount: 60, unit: 'ml' }, { id: 'lime-juice', amount: 22.5, unit: 'ml' }, { id: 'simple-syrup', amount: 15, unit: 'ml' }],
      garnish: { it: 'Lime', en: 'Lime' },
      steps: [{ it: 'Shake con ghiaccio.', en: 'Shake with ice.' }, { it: 'Filtra in coppa.', en: 'Strain into a coupe.' }],
      difficulty: 1, timeMin: 3, abv: 20, taste: ['sour', 'refreshing'], popular: true, color: '#E9F0B8',
    },
    {
      id: 'spritz', name: 'Aperol Spritz', aliases: [], description: { it: 'Il rito dell\'aperitivo.', en: 'The aperitivo ritual.' },
      base: ['sparkling'], family: 'spritz', glass: 'wine', technique: ['build'], ice: 'cubes',
      ingredients: [{ id: 'prosecco', amount: 90, unit: 'ml' }, { id: 'aperol', amount: 60, unit: 'ml' }, { id: 'soda-water', unit: 'top' }],
      garnish: { it: 'Fetta d\'arancia', en: 'Orange slice' },
      steps: [{ it: 'Build nel calice con ghiaccio.', en: 'Build over ice.' }],
      difficulty: 1, timeMin: 2, abv: 8, taste: ['bitter', 'refreshing'], popular: true, color: '#F2762E',
    },
  )
}

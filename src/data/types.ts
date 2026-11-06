/** Lingue supportate. */
export type Lang = 'it' | 'en'
/** Testo localizzato: sempre entrambe le lingue. */
export type L10n = { it: string; en: string }

export type IngredientCategory =
  | 'spirit' | 'liqueur' | 'vermouth' | 'bitter' | 'amaro' | 'wine' | 'sparkling' | 'beer'
  | 'juice' | 'syrup' | 'soda' | 'dairy' | 'fresh' | 'spice' | 'garnish' | 'other'

/** Sostituto di un ingrediente. */
export interface Substitute {
  /** id di un Ingredient esistente nel catalogo */
  id: string
  quality: 'great' | 'good' | 'emergency'
  /** come cambia il drink usando questo sostituto */
  note: L10n
}

export interface Ingredient {
  /** kebab-case inglese generico: lime-juice, triple-sec, aperol */
  id: string
  name: L10n
  category: IngredientCategory
  substitutes: Substitute[]
  /** fa parte del kit base di un bar (BASIC_KIT) */
  basic?: boolean
  /** ghiaccio, acqua: sempre disponibili, mai bloccanti */
  assumed?: boolean
}

/**
 * Unità di misura. 'top' = colmare con l'ingrediente (senza dose);
 * 'piece' = pezzo intero (es. 1 uovo, 1 lime); 'slice' = fetta; 'wedge' = spicchio;
 * 'dash' = goccia da bitter (~0,6 ml); 'drop' = goccia; 'barspoon' = cucchiaio da bar (~5 ml);
 * 'tsp' = cucchiaino; 'g' = grammi; 'leaf' = foglia; 'sprig' = rametto; 'pinch' = pizzico.
 * ml è la sola unità convertibile in cl/oz.
 */
export type Unit =
  | 'ml' | 'dash' | 'drop' | 'barspoon' | 'tsp' | 'g' | 'piece' | 'slice' | 'wedge' | 'leaf' | 'sprig' | 'pinch' | 'top'

export interface DrinkIngredient {
  /** id di un Ingredient (catalogo o extraIngredients) */
  id: string
  /** assente con unit 'top' o quando non quantificabile */
  amount?: number
  unit: Unit
  /** non blocca la preparazione (guarnizioni incluse) */
  optional?: boolean
  note?: L10n
}

export type Technique = 'shake' | 'dry-shake' | 'stir' | 'build' | 'blend' | 'muddle' | 'layer' | 'throw' | 'swizzle'

export type Glass =
  | 'coupe' | 'martini' | 'nick-nora' | 'rocks' | 'double-rocks' | 'highball' | 'collins' | 'flute' | 'wine'
  | 'copper-mug' | 'hurricane' | 'tiki' | 'shot' | 'julep' | 'irish-coffee' | 'balloon' | 'margarita' | 'beer'

export type Ice = 'none' | 'cubes' | 'crushed' | 'big-cube'

export type Family =
  | 'sour' | 'spirit-forward' | 'highball' | 'spritz' | 'fizz-collins' | 'mule-buck' | 'julep-smash' | 'tiki'
  | 'punch' | 'flip-cream' | 'sparkling' | 'frozen' | 'hot' | 'coffee' | 'shot' | 'mocktail'

export type Base =
  | 'gin' | 'vodka' | 'rum' | 'tequila' | 'mezcal' | 'bourbon' | 'rye' | 'scotch' | 'irish' | 'whisky' | 'brandy'
  | 'cognac' | 'pisco' | 'cachaca' | 'wine' | 'sparkling' | 'liqueur' | 'amaro' | 'none'

export type Taste =
  | 'sweet' | 'sour' | 'bitter' | 'dry' | 'fruity' | 'herbal' | 'creamy' | 'spicy' | 'smoky' | 'refreshing' | 'strong'

export interface Drink {
  /** kebab-case inglese, univoco: old-fashioned */
  id: string
  /** nome ufficiale (non localizzato) */
  name: string
  aliases: string[]
  description: L10n
  base: Base[]
  family: Family
  iba?: 'unforgettable' | 'contemporary' | 'new-era'
  glass: Glass
  technique: Technique[]
  ice: Ice
  /** ordine = ordine di preparazione */
  ingredients: DrinkIngredient[]
  garnish: L10n
  /** passi di preparazione, uno per elemento */
  steps: L10n[]
  tip?: L10n
  /** 1 facile, 3 difficile */
  difficulty: 1 | 2 | 3
  /** minuti di preparazione */
  timeMin: number
  /** gradazione stimata in % vol */
  abv: number
  taste: Taste[]
  popular?: boolean
  /** hex del liquido, per l'illustrazione */
  color: string
}

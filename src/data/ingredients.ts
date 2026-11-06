import type { Ingredient, IngredientCategory } from './types'

/** Catalogo ingredienti principale. Sostituti: G = great, O = good, E = emergency. */
type Q = 'great' | 'good' | 'emergency'
type S = [id: string, q: Q, it: string, en: string]
const G: Q = 'great'
const O: Q = 'good'
const E: Q = 'emergency'
const B = { basic: true }
const A = { assumed: true }

const mk = (
  id: string, it: string, en: string, category: IngredientCategory,
  subs: S[] = [], flags: { basic?: boolean; assumed?: boolean } = {},
): Ingredient => ({
  id,
  name: { it, en },
  category,
  substitutes: subs.map(([sid, quality, nit, nen]) => ({ id: sid, quality, note: { it: nit, en: nen } })),
  ...flags,
})

export const ingredients: Ingredient[] = [
  // ---------- DISTILLATI ----------
  mk('gin', 'Gin', 'Gin', 'spirit', [
    ['london-dry-gin', G, 'Identico per uso; profilo ginepro classico.', 'Same use; classic juniper profile.'],
    ['vodka', E, 'Perde le botaniche: il drink diventa più neutro.', 'Loses the botanicals: the drink turns more neutral.'],
  ], B),
  mk('london-dry-gin', 'London Dry Gin', 'London Dry Gin', 'spirit', [
    ['gin', G, 'Qualsiasi gin secco va bene.', 'Any dry gin works.'],
    ['old-tom-gin', O, 'Più dolce e rotondo: riduci un po\' lo zucchero.', 'Sweeter and rounder: cut the sugar a little.'],
  ]),
  mk('old-tom-gin', 'Old Tom Gin', 'Old Tom Gin', 'spirit', [
    ['london-dry-gin', O, 'Più secco: aggiungi 5 ml di sciroppo semplice.', 'Drier: add 5 ml of simple syrup.'],
    ['gin', O, 'Più secco: aggiungi 5 ml di sciroppo semplice.', 'Drier: add 5 ml of simple syrup.'],
  ]),
  mk('vodka', 'Vodka', 'Vodka', 'spirit', [
    ['gin', E, 'Aggiunge note botaniche al drink.', 'Adds botanical notes to the drink.'],
    ['white-rum', E, 'Leggermente più dolce e con più carattere.', 'Slightly sweeter with more character.'],
  ], B),
  mk('white-rum', 'Rum bianco', 'White rum', 'spirit', [
    ['gold-rum', O, 'Un po\' più rotondo e tostato.', 'A bit rounder and toastier.'],
    ['rhum-agricole', G, 'Più erbaceo e secco: ottimo nei sour.', 'More grassy and dry: great in sours.'],
    ['cachaca', O, 'Più vegetale e funky.', 'More vegetal and funky.'],
  ], B),
  mk('gold-rum', 'Rum ambrato', 'Gold rum', 'spirit', [
    ['white-rum', O, 'Meno corpo e meno vaniglia.', 'Less body and less vanilla.'],
    ['dark-rum', O, 'Più intenso e melassato: usane un po\' meno.', 'Richer and more molasses: use slightly less.'],
  ]),
  mk('dark-rum', 'Rum scuro', 'Dark rum', 'spirit', [
    ['gold-rum', G, 'Più leggero, stesso carattere caramellato.', 'Lighter, same caramel character.'],
    ['spiced-rum', O, 'Più speziato e dolce.', 'Spicier and sweeter.'],
  ], B),
  mk('spiced-rum', 'Rum speziato', 'Spiced rum', 'spirit', [
    ['dark-rum', O, 'Meno spezie: aggiungi un pizzico di cannella.', 'Fewer spices: add a pinch of cinnamon.'],
    ['gold-rum', O, 'Meno spezie e vaniglia.', 'Fewer spices and less vanilla.'],
  ]),
  mk('overproof-rum', 'Rum overproof', 'Overproof rum', 'spirit', [
    ['jamaican-rum', G, 'Meno alcolico: usa 15 ml invece di 10.', 'Less alcohol: use 15 ml instead of 10.'],
    ['dark-rum', O, 'Meno forza: dosa un po\' di più.', 'Less punch: pour a little more.'],
  ]),
  mk('jamaican-rum', 'Rum giamaicano', 'Jamaican rum', 'spirit', [
    ['dark-rum', O, 'Meno funk e meno frutta matura.', 'Less funk and ripe fruit.'],
    ['overproof-rum', O, 'Più forte: dosa meno.', 'Stronger: pour less.'],
  ]),
  mk('rhum-agricole', 'Rhum agricole', 'Rhum agricole', 'spirit', [
    ['white-rum', O, 'Meno erbaceo, più neutro.', 'Less grassy, more neutral.'],
    ['cachaca', G, 'Molto simile: canna fresca e vegetale.', 'Very close: fresh vegetal cane.'],
  ]),
  mk('cachaca', 'Cachaça', 'Cachaça', 'spirit', [
    ['rhum-agricole', G, 'Stesso profilo di canna fresca.', 'Same fresh cane profile.'],
    ['white-rum', O, 'Meno carattere, più pulito.', 'Less character, cleaner.'],
    ['vodka', E, 'Perde la nota di canna: il drink diventa neutro.', 'Loses the cane note: the drink turns neutral.'],
  ]),
  mk('pisco', 'Pisco', 'Pisco', 'spirit', [
    ['grappa', E, 'Più secca e vinosa: dosa meno.', 'Drier and winier: pour less.'],
    ['white-rum', E, 'Perde le note di uva.', 'Loses the grape notes.'],
  ]),
  mk('tequila', 'Tequila', 'Tequila', 'spirit', [
    ['tequila-blanco', G, 'Identica per uso.', 'Same use.'],
    ['mezcal', O, 'Più affumicato.', 'Smokier.'],
  ], B),
  mk('tequila-blanco', 'Tequila blanco', 'Tequila blanco', 'spirit', [
    ['tequila', G, 'Qualsiasi tequila 100% agave.', 'Any 100% agave tequila.'],
    ['tequila-reposado', G, 'Più morbida, note di legno.', 'Smoother, with some oak.'],
    ['mezcal', O, 'Più affumicato.', 'Smokier.'],
  ]),
  mk('tequila-reposado', 'Tequila reposado', 'Tequila reposado', 'spirit', [
    ['tequila-blanco', G, 'Più vivace, meno legno.', 'Livelier, less oak.'],
    ['tequila', G, 'Stesso uso.', 'Same use.'],
  ]),
  mk('mezcal', 'Mezcal', 'Mezcal', 'spirit', [
    ['tequila-reposado', O, 'Perde il fumo: aggiungi 1 goccia di scotch torbato se ce l\'hai.', 'Loses the smoke: add a drop of peated scotch if you have it.'],
    ['tequila-blanco', E, 'Niente fumo, più pulita.', 'No smoke, cleaner.'],
  ]),
  mk('bourbon', 'Bourbon', 'Bourbon', 'spirit', [
    ['rye-whiskey', G, 'Più speziato e secco.', 'Spicier and drier.'],
    ['irish-whiskey', O, 'Più morbido e leggero.', 'Softer and lighter.'],
    ['scotch', E, 'Meno dolce e vanigliato, più maltato.', 'Less sweet and vanilla, more malty.'],
  ], B),
  mk('rye-whiskey', 'Rye whiskey', 'Rye whiskey', 'spirit', [
    ['bourbon', G, 'Più dolce e rotondo, meno pepe.', 'Sweeter and rounder, less pepper.'],
    ['irish-whiskey', E, 'Più leggero e meno speziato.', 'Lighter and less spicy.'],
  ]),
  mk('scotch', 'Scotch whisky', 'Scotch whisky', 'spirit', [
    ['blended-scotch', G, 'Stesso uso.', 'Same use.'],
    ['irish-whiskey', O, 'Più morbido, senza torba.', 'Softer, no peat.'],
    ['bourbon', E, 'Più dolce, senza malto.', 'Sweeter, no malt.'],
  ], B),
  mk('blended-scotch', 'Scotch blended', 'Blended Scotch', 'spirit', [
    ['scotch', G, 'Stesso uso.', 'Same use.'],
    ['irish-whiskey', O, 'Più morbido.', 'Softer.'],
  ]),
  mk('islay-scotch', 'Scotch torbato (Islay)', 'Islay Scotch', 'spirit', [
    ['scotch', O, 'Meno fumo: il drink è meno marcato.', 'Less smoke: the drink is less pronounced.'],
    ['mezcal', O, 'Fumo diverso, più vegetale.', 'Different, more vegetal smoke.'],
  ]),
  mk('irish-whiskey', 'Whiskey irlandese', 'Irish whiskey', 'spirit', [
    ['bourbon', O, 'Più dolce e vanigliato.', 'Sweeter and more vanilla.'],
    ['scotch', O, 'Più maltato.', 'Maltier.'],
  ], B),
  mk('japanese-whisky', 'Whisky giapponese', 'Japanese whisky', 'spirit', [
    ['scotch', G, 'Stile molto simile: leggero e pulito.', 'Very similar style: light and clean.'],
    ['irish-whiskey', O, 'Leggero e morbido.', 'Light and soft.'],
  ]),
  mk('cognac', 'Cognac', 'Cognac', 'spirit', [
    ['brandy', G, 'Un po\' meno elegante, stesso uso.', 'Slightly less refined, same use.'],
    ['calvados', O, 'Note di mela al posto dell\'uva.', 'Apple notes instead of grape.'],
  ], B),
  mk('brandy', 'Brandy', 'Brandy', 'spirit', [
    ['cognac', G, 'Più raffinato, stesso uso.', 'More refined, same use.'],
    ['apple-brandy', O, 'Note di mela.', 'Apple notes.'],
  ]),
  mk('calvados', 'Calvados', 'Calvados', 'spirit', [
    ['apple-brandy', G, 'Stesso profilo di mela.', 'Same apple profile.'],
    ['cognac', O, 'Perde la mela, più uva.', 'Loses apple, more grape.'],
  ]),
  mk('apple-brandy', 'Apple brandy', 'Apple brandy', 'spirit', [
    ['calvados', G, 'Stesso profilo di mela.', 'Same apple profile.'],
    ['brandy', O, 'Meno mela.', 'Less apple.'],
  ]),
  mk('grappa', 'Grappa', 'Grappa', 'spirit', [
    ['pisco', O, 'Più morbido e aromatico.', 'Softer and more aromatic.'],
    ['brandy', E, 'Più dolce e rotondo.', 'Sweeter and rounder.'],
  ]),
  mk('absinthe', 'Assenzio', 'Absinthe', 'spirit', [
    ['pernod', O, 'Anice più morbido, meno erbaceo.', 'Softer anise, less herbal.'],
    ['sambuca', E, 'Anice più dolce: 2 gocce bastano.', 'Sweeter anise: 2 drops are enough.'],
  ]),
  mk('pernod', 'Pastis / Pernod', 'Pastis / Pernod', 'spirit', [
    ['absinthe', G, 'Più forte ed erbaceo: dosa un po\' meno.', 'Stronger and more herbal: use a bit less.'],
    ['sambuca', E, 'Più dolce.', 'Sweeter.'],
  ]),

  // ---------- LIQUORI ----------
  mk('triple-sec', 'Triple sec', 'Triple sec', 'liqueur', [
    ['cointreau', G, 'Più secco e pulito: stessa dose.', 'Drier and cleaner: same amount.'],
    ['orange-curacao', G, 'Un po\' più dolce e amaro.', 'Slightly sweeter and more bitter.'],
    ['grand-marnier', O, 'Più ricco, con cognac.', 'Richer, with cognac.'],
  ], B),
  mk('cointreau', 'Cointreau', 'Cointreau', 'liqueur', [
    ['triple-sec', G, 'Un po\' più dolce e meno intenso.', 'Slightly sweeter and less intense.'],
    ['orange-curacao', G, 'Più dolce: riduci lo zucchero.', 'Sweeter: cut the sugar.'],
    ['grand-marnier', O, 'Più ricco e corposo.', 'Richer and fuller.'],
  ], B),
  mk('grand-marnier', 'Grand Marnier', 'Grand Marnier', 'liqueur', [
    ['cointreau', O, 'Più secco, senza cognac.', 'Drier, no cognac.'],
    ['triple-sec', O, 'Più semplice e dolce.', 'Simpler and sweeter.'],
  ]),
  mk('orange-curacao', 'Curaçao arancia', 'Orange curaçao', 'liqueur', [
    ['triple-sec', G, 'Incolore e un po\' più secco.', 'Clear and slightly drier.'],
    ['cointreau', G, 'Più secco e intenso.', 'Drier and more intense.'],
  ]),
  mk('blue-curacao', 'Blue curaçao', 'Blue curaçao', 'liqueur', [
    ['triple-sec', O, 'Stesso gusto ma senza colore blu.', 'Same flavour, but no blue colour.'],
    ['orange-curacao', O, 'Stesso gusto, colore arancio.', 'Same flavour, orange colour.'],
  ]),
  mk('maraschino-liqueur', 'Liquore di maraschino', 'Maraschino liqueur', 'liqueur', [
    ['cherry-brandy', O, 'Più dolce e meno secco: dosa un po\' meno.', 'Sweeter and less dry: use slightly less.'],
    ['amaretto', E, 'Mandorla al posto della ciliegia amara.', 'Almond instead of bitter cherry.'],
  ]),
  mk('green-chartreuse', 'Chartreuse verde', 'Green Chartreuse', 'liqueur', [
    ['yellow-chartreuse', O, 'Più dolce e meno potente.', 'Sweeter and less potent.'],
    ['benedictine', E, 'Più dolce e al miele, meno erbaceo.', 'Sweeter, honeyed, less herbal.'],
  ]),
  mk('yellow-chartreuse', 'Chartreuse gialla', 'Yellow Chartreuse', 'liqueur', [
    ['green-chartreuse', O, 'Più forte ed erbacea: dosa meno.', 'Stronger and more herbal: use less.'],
    ['benedictine', O, 'Simile per dolcezza e miele.', 'Similar sweetness and honey.'],
    ['drambuie', E, 'Più miele e whisky.', 'More honey and whisky.'],
  ]),
  mk('elderflower-liqueur', 'Liquore al sambuco (St-Germain)', 'Elderflower liqueur (St-Germain)', 'liqueur', [
    ['st-germain', G, 'Marchio standard di bancone.', 'The standard bar brand.'],
    ['elderflower-syrup', O, 'Niente alcol: usa 15 ml invece di 20 e meno zucchero.', 'No alcohol: use 15 ml instead of 20 and less sugar.'],
    ['limoncello', E, 'Limone al posto del fiore di sambuco.', 'Lemon instead of elderflower.'],
  ]),
  mk('st-germain', 'St-Germain', 'St-Germain', 'liqueur', [
    ['elderflower-liqueur', G, 'Qualsiasi liquore al sambuco.', 'Any elderflower liqueur.'],
    ['elderflower-syrup', O, 'Niente alcol: usa 15 ml invece di 20 e meno zucchero.', 'No alcohol: use 15 ml instead of 20 and less sugar.'],
  ]),
  mk('coffee-liqueur', 'Liquore al caffè', 'Coffee liqueur', 'liqueur', [
    ['kahlua', G, 'Marchio standard di bancone.', 'The standard bar brand.'],
    ['espresso', E, 'Senza dolcezza: aggiungi 10 ml di sciroppo semplice.', 'Not sweet: add 10 ml simple syrup.'],
  ]),
  mk('kahlua', 'Kahlúa', 'Kahlúa', 'liqueur', [
    ['coffee-liqueur', G, 'Qualsiasi liquore al caffè.', 'Any coffee liqueur.'],
    ['espresso', E, 'Senza dolcezza: aggiungi 10 ml di sciroppo semplice.', 'Not sweet: add 10 ml simple syrup.'],
  ]),
  mk('irish-cream', 'Crema irlandese', 'Irish cream', 'liqueur', [
    ['baileys', G, 'Marchio standard di bancone.', 'The standard bar brand.'],
    ['coffee-liqueur', E, 'Perde la cremosità: aggiungi 10 ml di panna.', 'Loses creaminess: add 10 ml cream.'],
  ]),
  mk('baileys', 'Baileys', 'Baileys', 'liqueur', [
    ['irish-cream', G, 'Qualsiasi crema irlandese.', 'Any Irish cream.'],
    ['coffee-liqueur', E, 'Perde la cremosità: aggiungi 10 ml di panna.', 'Loses creaminess: add 10 ml cream.'],
  ]),
  mk('galliano', 'Galliano', 'Galliano', 'liqueur', [
    ['benedictine', E, 'Erbaceo e al miele, senza vaniglia e anice.', 'Herbal and honeyed, no vanilla or anise.'],
    ['vanilla-syrup', E, 'Solo vaniglia: dosa 10 ml.', 'Vanilla only: use 10 ml.'],
  ]),
  mk('amaretto', 'Amaretto', 'Amaretto', 'liqueur', [
    ['orgeat', O, 'Senza alcol, mandorla fresca: 15 ml.', 'Alcohol-free almond: 15 ml.'],
    ['frangelico', E, 'Nocciola al posto della mandorla.', 'Hazelnut instead of almond.'],
  ]),
  mk('limoncello', 'Limoncello', 'Limoncello', 'liqueur', [
    ['lemon-juice', E, 'Meno dolce e alcolico: aggiungi 10 ml di sciroppo semplice.', 'Less sweet and boozy: add 10 ml simple syrup.'],
    ['triple-sec', E, 'Arancia al posto del limone.', 'Orange instead of lemon.'],
  ]),
  mk('midori', 'Midori', 'Midori', 'liqueur', [
    ['blue-curacao', E, 'Colore diverso e gusto d\'arancia, non melone.', 'Different colour and orange taste, not melon.'],
    ['triple-sec', E, 'Niente melone: il drink cambia gusto.', 'No melon: the drink changes flavour.'],
  ]),
  mk('jagermeister', 'Jägermeister', 'Jägermeister', 'liqueur', [
    ['amaro-montenegro', O, 'Più delicato e floreale.', 'Gentler and floral.'],
    ['fernet-branca', E, 'Molto più amaro: dosa metà.', 'Much more bitter: use half.'],
  ]),
  mk('sambuca', 'Sambuca', 'Sambuca', 'liqueur', [
    ['pernod', O, 'Anice meno dolce.', 'Less sweet anise.'],
    ['absinthe', E, 'Più erbaceo e forte: dosa meno.', 'More herbal and strong: use less.'],
  ]),
  mk('coconut-rum', 'Rum al cocco', 'Coconut rum', 'liqueur', [
    ['malibu', G, 'Marchio standard di bancone.', 'The standard bar brand.'],
    ['white-rum', E, 'Aggiungi 15 ml di crema di cocco per ricreare il gusto.', 'Add 15 ml coconut cream to recreate the flavour.'],
  ]),
  mk('malibu', 'Malibu', 'Malibu', 'liqueur', [
    ['coconut-rum', G, 'Qualsiasi rum al cocco.', 'Any coconut rum.'],
    ['white-rum', E, 'Aggiungi 15 ml di crema di cocco.', 'Add 15 ml coconut cream.'],
  ]),
  mk('frangelico', 'Frangelico', 'Frangelico', 'liqueur', [
    ['amaretto', O, 'Mandorla al posto della nocciola.', 'Almond instead of hazelnut.'],
    ['coffee-liqueur', E, 'Caffè al posto della nocciola.', 'Coffee instead of hazelnut.'],
  ]),
  mk('drambuie', 'Drambuie', 'Drambuie', 'liqueur', [
    ['benedictine', O, 'Più erbaceo, meno whisky.', 'More herbal, less whisky.'],
    ['honey-syrup', E, '10 ml di miele; aggiungi 5 ml di scotch per il carattere.', '10 ml honey; add 5 ml scotch for character.'],
  ]),
  mk('benedictine', 'Bénédictine', 'Bénédictine', 'liqueur', [
    ['yellow-chartreuse', O, 'Più erbacea e meno dolce.', 'More herbal and less sweet.'],
    ['drambuie', O, 'Più miele e whisky.', 'More honey and whisky.'],
  ]),
  mk('chambord', 'Chambord', 'Chambord', 'liqueur', [
    ['creme-de-mure', G, 'Mora al posto del lampone: molto simile.', 'Blackberry instead of raspberry: very close.'],
    ['creme-de-cassis', O, 'Ribes nero, più acido.', 'Blackcurrant, tarter.'],
    ['raspberry-syrup', O, 'Senza alcol: usa 15 ml.', 'Alcohol-free: use 15 ml.'],
  ]),
  mk('creme-de-cassis', 'Crème de cassis', 'Crème de cassis', 'liqueur', [
    ['creme-de-mure', G, 'Mora, profilo molto simile.', 'Blackberry, very similar.'],
    ['chambord', O, 'Lampone al posto del ribes.', 'Raspberry instead of blackcurrant.'],
  ]),
  mk('creme-de-mure', 'Crème de mûre', 'Crème de mûre', 'liqueur', [
    ['creme-de-cassis', G, 'Ribes nero, un po\' più acido.', 'Blackcurrant, slightly tarter.'],
    ['chambord', G, 'Lampone, più dolce.', 'Raspberry, sweeter.'],
  ]),
  mk('creme-de-cacao-white', 'Crème de cacao bianca', 'White crème de cacao', 'liqueur', [
    ['creme-de-cacao-dark', G, 'Stesso gusto, ma il drink si scurisce.', 'Same flavour, but the drink darkens.'],
    ['coffee-liqueur', E, 'Caffè al posto del cacao; colore scuro.', 'Coffee instead of cocoa; darker colour.'],
  ]),
  mk('creme-de-cacao-dark', 'Crème de cacao scura', 'Dark crème de cacao', 'liqueur', [
    ['creme-de-cacao-white', G, 'Stesso gusto, drink più chiaro.', 'Same flavour, lighter drink.'],
    ['coffee-liqueur', E, 'Caffè al posto del cacao.', 'Coffee instead of cocoa.'],
  ]),
  mk('creme-de-menthe-green', 'Crème de menthe verde', 'Green crème de menthe', 'liqueur', [
    ['creme-de-menthe-white', G, 'Uguale ma incolore.', 'Same but clear.'],
  ]),
  mk('creme-de-menthe-white', 'Crème de menthe bianca', 'White crème de menthe', 'liqueur', [
    ['creme-de-menthe-green', G, 'Uguale ma il drink diventa verde.', 'Same but the drink turns green.'],
  ]),
  mk('apricot-brandy', 'Apricot brandy', 'Apricot brandy', 'liqueur', [
    ['peach-schnapps', O, 'Pesca al posto dell\'albicocca.', 'Peach instead of apricot.'],
    ['cherry-brandy', E, 'Ciliegia al posto dell\'albicocca.', 'Cherry instead of apricot.'],
  ]),
  mk('cherry-brandy', 'Liquore di ciliegia', 'Cherry brandy', 'liqueur', [
    ['cherry-heering', G, 'Marchio standard di bancone.', 'The standard bar brand.'],
    ['maraschino-liqueur', O, 'Più secco, mandorla amara.', 'Drier, bitter almond.'],
    ['chambord', E, 'Frutti rossi al posto della ciliegia.', 'Red berries instead of cherry.'],
  ]),
  mk('cherry-heering', 'Cherry Heering', 'Cherry Heering', 'liqueur', [
    ['cherry-brandy', G, 'Qualsiasi liquore di ciliegia scuro.', 'Any dark cherry liqueur.'],
    ['maraschino-liqueur', O, 'Più secco.', 'Drier.'],
  ]),
  mk('peach-schnapps', 'Peach schnapps', 'Peach schnapps', 'liqueur', [
    ['apricot-brandy', O, 'Albicocca al posto della pesca.', 'Apricot instead of peach.'],
    ['peach-puree', O, 'Senza alcol: 30 ml e un po\' di zucchero.', 'Alcohol-free: 30 ml with a little sugar.'],
  ]),

  // ---------- AMARI E APERITIVI ----------
  mk('aperol', 'Aperol', 'Aperol', 'amaro', [
    ['select', G, 'Più amaro e meno dolce: stessa dose.', 'More bitter and less sweet: same amount.'],
    ['campari', E, 'Molto più amaro: usa metà dose e allunga con soda.', 'Much more bitter: use half the amount and top with soda.'],
  ], B),
  mk('campari', 'Campari', 'Campari', 'amaro', [
    ['select', G, 'Un po\' più dolce e meno intenso.', 'Slightly sweeter and less intense.'],
    ['aperol', E, 'Molto più dolce e leggero: usa 1,5 volte la dose.', 'Much sweeter and lighter: use 1.5 times the amount.'],
  ], B),
  mk('select', 'Select', 'Select Aperitivo', 'amaro', [
    ['aperol', G, 'Più dolce e arancio.', 'Sweeter and more orange.'],
    ['campari', O, 'Più amaro: dosa un po\' meno.', 'More bitter: use a bit less.'],
  ]),
  mk('cynar', 'Cynar', 'Cynar', 'amaro', [
    ['amaro-montenegro', O, 'Più floreale e meno amaro.', 'More floral and less bitter.'],
    ['averna', O, 'Più dolce, note di cola.', 'Sweeter, cola-like.'],
  ]),
  mk('fernet-branca', 'Fernet-Branca', 'Fernet-Branca', 'amaro', [
    ['jagermeister', E, 'Molto più dolce.', 'Much sweeter.'],
    ['amaro-del-capo', E, 'Più dolce e agrumato.', 'Sweeter and more citrusy.'],
  ]),
  mk('amaro-del-capo', 'Amaro del Capo', 'Amaro del Capo', 'amaro', [
    ['amaro-montenegro', G, 'Simile, più floreale.', 'Similar, more floral.'],
    ['averna', O, 'Più dolce e scuro.', 'Sweeter and darker.'],
  ]),
  mk('amaro-montenegro', 'Amaro Montenegro', 'Amaro Montenegro', 'amaro', [
    ['amaro-nonino', G, 'Più grappa e arancia.', 'More grappa and orange.'],
    ['amaro-del-capo', G, 'Un po\' più agrumato.', 'Slightly more citrusy.'],
  ]),
  mk('amaro-nonino', 'Amaro Nonino', 'Amaro Nonino', 'amaro', [
    ['amaro-montenegro', G, 'Più floreale e meno corposo.', 'More floral and lighter.'],
    ['averna', O, 'Più scuro, note di cola.', 'Darker, cola-like.'],
  ]),
  mk('averna', 'Averna', 'Averna', 'amaro', [
    ['amaro-nonino', O, 'Più chiaro e secco.', 'Lighter and drier.'],
    ['cynar', O, 'Più vegetale.', 'More vegetal.'],
  ]),

  // ---------- VERMOUTH, VINI, BOLLICINE, BIRRE ----------
  mk('sweet-vermouth', 'Vermouth rosso', 'Sweet vermouth', 'vermouth', [
    ['bianco-vermouth', E, 'Più chiaro e floreale, meno spezie.', 'Lighter and floral, fewer spices.'],
    ['port', E, 'Più denso e fruttato: dosa 3/4.', 'Denser and fruitier: use 3/4.'],
  ], B),
  mk('dry-vermouth', 'Vermouth dry', 'Dry vermouth', 'vermouth', [
    ['bianco-vermouth', O, 'Più dolce: riduci lo zucchero nel drink.', 'Sweeter: cut sugar in the drink.'],
    ['lillet-blanc', O, 'Più morbido e fruttato.', 'Softer and fruitier.'],
    ['white-wine', E, 'Meno erbe: aggiungi una goccia di assenzio se vuoi.', 'Fewer herbs: add a drop of absinthe if you like.'],
  ], B),
  mk('bianco-vermouth', 'Vermouth bianco', 'Bianco vermouth', 'vermouth', [
    ['lillet-blanc', G, 'Molto simile.', 'Very similar.'],
    ['dry-vermouth', O, 'Più secco: aggiungi 5 ml di sciroppo semplice.', 'Drier: add 5 ml simple syrup.'],
  ]),
  mk('lillet-blanc', 'Lillet Blanc', 'Lillet Blanc', 'wine', [
    ['cocchi-americano', G, 'Più amaro e chinato.', 'More bitter and quinine-y.'],
    ['bianco-vermouth', O, 'Più erbaceo e dolce.', 'More herbal and sweet.'],
    ['dry-vermouth', E, 'Più secco: aggiungi 5 ml di sciroppo semplice.', 'Drier: add 5 ml simple syrup.'],
  ]),
  mk('cocchi-americano', 'Cocchi Americano', 'Cocchi Americano', 'wine', [
    ['lillet-blanc', G, 'Meno amaro, più fruttato.', 'Less bitter, fruitier.'],
    ['bianco-vermouth', O, 'Più dolce.', 'Sweeter.'],
  ]),
  mk('sherry-fino', 'Sherry fino', 'Fino sherry', 'wine', [
    ['dry-vermouth', O, 'Meno salino e nocciolato.', 'Less saline and nutty.'],
    ['white-wine', E, 'Più fruttato, meno ossidato.', 'Fruitier, less oxidised.'],
  ]),
  mk('port', 'Porto', 'Port', 'wine', [
    ['sweet-vermouth', O, 'Meno corpo e frutta; dosa uguale.', 'Less body and fruit; same amount.'],
    ['red-wine', E, 'Aggiungi 5 ml di sciroppo semplice.', 'Add 5 ml simple syrup.'],
  ]),
  mk('marsala', 'Marsala', 'Marsala', 'wine', [
    ['sweet-vermouth', O, 'Più erbaceo, meno caramello.', 'More herbal, less caramel.'],
    ['port', O, 'Più fruttato.', 'Fruitier.'],
  ]),
  mk('white-wine', 'Vino bianco', 'White wine', 'wine', [
    ['dry-vermouth', O, 'Più erbaceo e forte.', 'More herbal and stronger.'],
  ], B),
  mk('red-wine', 'Vino rosso', 'Red wine', 'wine', [
    ['port', O, 'Più dolce e forte: dosa un po\' meno.', 'Sweeter and stronger: use slightly less.'],
  ]),
  mk('prosecco', 'Prosecco', 'Prosecco', 'sparkling', [
    ['sparkling-wine', G, 'Qualsiasi spumante secco.', 'Any dry sparkling wine.'],
    ['champagne', G, 'Più secco e fine.', 'Drier and finer.'],
    ['soda-water', E, 'Niente alcol né sapore: aggiungi 10 ml di sciroppo semplice.', 'No alcohol or flavour: add 10 ml simple syrup.'],
  ], B),
  mk('champagne', 'Champagne', 'Champagne', 'sparkling', [
    ['sparkling-wine', G, 'Più semplice, stesso uso.', 'Simpler, same use.'],
    ['prosecco', G, 'Più fruttato e meno secco.', 'Fruitier and less dry.'],
  ]),
  mk('sparkling-wine', 'Spumante', 'Sparkling wine', 'sparkling', [
    ['prosecco', G, 'Stesso uso.', 'Same use.'],
    ['champagne', G, 'Più fine e secco.', 'Finer and drier.'],
  ]),
  mk('lager-beer', 'Birra chiara', 'Lager beer', 'beer', [
    ['stout', E, 'Molto più scura e tostata.', 'Much darker and roasted.'],
  ]),
  mk('stout', 'Birra scura (stout)', 'Stout', 'beer', [
    ['lager-beer', E, 'Più chiara e leggera.', 'Lighter and paler.'],
  ]),

  // ---------- BITTER ----------
  mk('angostura', 'Angostura bitter', 'Angostura bitters', 'bitter', [
    ['orange-bitters', O, 'Più agrumato e meno speziato.', 'More citrus, less spice.'],
    ['peychauds', O, 'Più anice e fiori.', 'More anise and floral.'],
    ['campari', E, '1 goccia di Campari per dash: più amaro e dolce.', '1 drop of Campari per dash: bitterer and sweeter.'],
  ], B),
  mk('orange-bitters', 'Bitter all\'arancia', 'Orange bitters', 'bitter', [
    ['angostura', O, 'Meno agrumi, più spezie.', 'Less citrus, more spice.'],
    ['triple-sec', E, 'Aggiungi 5 ml e un twist d\'arancia.', 'Add 5 ml plus an orange twist.'],
  ]),
  mk('peychauds', 'Peychaud\'s bitters', 'Peychaud\'s bitters', 'bitter', [
    ['angostura', O, 'Meno anice, più spezie.', 'Less anise, more spice.'],
    ['orange-bitters', E, 'Profilo agrumato.', 'Citrusy profile.'],
  ]),

  // ---------- SUCCHI ----------
  mk('lime-juice', 'Succo di lime', 'Lime juice', 'juice', [
    ['lemon-juice', O, 'Meno amaro e aromatico: usa un po\' meno sciroppo.', 'Less bitter and aromatic: use slightly less syrup.'],
    ['lime-cordial', E, 'Più dolce: riduci lo sciroppo.', 'Sweeter: cut the syrup.'],
  ], B),
  mk('lemon-juice', 'Succo di limone', 'Lemon juice', 'juice', [
    ['lime-juice', O, 'Più aspro e aromatico.', 'Tarter and more aromatic.'],
  ], B),
  mk('orange-juice', 'Succo d\'arancia', 'Orange juice', 'juice', [
    ['grapefruit-juice', E, 'Più acido e amaro; aggiungi 5 ml di sciroppo.', 'Tarter and bitter; add 5 ml syrup.'],
    ['pineapple-juice', E, 'Più tropicale e dolce.', 'More tropical and sweet.'],
  ], B),
  mk('grapefruit-juice', 'Succo di pompelmo', 'Grapefruit juice', 'juice', [
    ['orange-juice', E, 'Più dolce e meno amaro; aggiungi 5 ml di limone.', 'Sweeter, less bitter; add 5 ml lemon.'],
  ], B),
  mk('pineapple-juice', 'Succo di ananas', 'Pineapple juice', 'juice', [
    ['orange-juice', E, 'Meno tropicale e meno schiuma.', 'Less tropical and less foam.'],
    ['mango-puree', E, 'Più denso e dolce.', 'Thicker and sweeter.'],
  ], B),
  mk('cranberry-juice', 'Succo di mirtillo rosso', 'Cranberry juice', 'juice', [
    ['pomegranate-juice', O, 'Più dolce e profondo.', 'Sweeter and deeper.'],
    ['grenadine', E, '10 ml di granatina in 40 ml di acqua o soda.', '10 ml grenadine in 40 ml water or soda.'],
  ], B),
  mk('tomato-juice', 'Succo di pomodoro', 'Tomato juice', 'juice', [
    ['orange-juice', E, 'Cambia completamente il drink.', 'Completely changes the drink.'],
  ]),
  mk('apple-juice', 'Succo di mela', 'Apple juice', 'juice', [
    ['white-grape-juice', O, 'Più dolce e neutro.', 'Sweeter and more neutral.'],
    ['orange-juice', E, 'Più agrumato.', 'More citrusy.'],
  ]),
  mk('white-grape-juice', 'Succo d\'uva bianca', 'White grape juice', 'juice', [
    ['apple-juice', O, 'Più acido.', 'Tarter.'],
  ]),
  mk('pomegranate-juice', 'Succo di melograno', 'Pomegranate juice', 'juice', [
    ['cranberry-juice', O, 'Più acido e meno dolce.', 'Tarter and less sweet.'],
    ['grenadine', E, '15 ml di granatina in acqua.', '15 ml grenadine in water.'],
  ]),
  mk('coconut-water', 'Acqua di cocco', 'Coconut water', 'juice', [
    ['soda-water', E, 'Meno dolce e senza cocco.', 'Less sweet and no coconut.'],
  ]),
  mk('passion-fruit-puree', 'Purea di frutto della passione', 'Passion fruit purée', 'juice', [
    ['passion-fruit-syrup', G, 'Più dolce: riduci lo zucchero e aggiungi 5 ml di lime.', 'Sweeter: cut sugar and add 5 ml lime.'],
    ['pineapple-juice', E, 'Meno acido e profumato.', 'Less tart and aromatic.'],
  ]),
  mk('strawberry-puree', 'Purea di fragola', 'Strawberry purée', 'juice', [
    ['strawberry', G, '3-4 fragole frullate o pestate.', '3-4 strawberries blended or muddled.'],
    ['raspberry-syrup', E, 'Più dolce: riduci lo zucchero.', 'Sweeter: cut sugar.'],
  ]),
  mk('peach-puree', 'Purea di pesca', 'Peach purée', 'juice', [
    ['peach', G, 'Mezza pesca frullata.', 'Half a blended peach.'],
    ['peach-schnapps', O, 'Più alcolico e dolce.', 'Boozier and sweeter.'],
  ]),
  mk('mango-puree', 'Purea di mango', 'Mango purée', 'juice', [
    ['passion-fruit-puree', O, 'Più acida.', 'Tarter.'],
    ['pineapple-juice', E, 'Più sottile.', 'Thinner.'],
  ]),
  mk('raspberry-puree', 'Purea di lampone', 'Raspberry purée', 'juice', [
    ['raspberry', G, '6-8 lamponi pestati.', '6-8 muddled raspberries.'],
    ['raspberry-syrup', O, 'Più dolce: riduci lo zucchero.', 'Sweeter: cut sugar.'],
  ]),
  mk('watermelon-juice', 'Succo di anguria', 'Watermelon juice', 'juice', [
    ['strawberry-puree', E, 'Più denso e intenso.', 'Thicker and more intense.'],
  ]),

  // ---------- SCIROPPI ----------
  mk('simple-syrup', 'Sciroppo semplice', 'Simple syrup', 'syrup', [
    ['sugar', O, '1 cucchiaino = 10 ml; mescola bene finché si scioglie.', '1 teaspoon = 10 ml; stir until dissolved.'],
    ['agave-syrup', G, 'Più dolce: usa 3/4 della dose.', 'Sweeter: use 3/4 of the amount.'],
    ['honey-syrup', O, 'Più aromatico: stessa dose.', 'More aromatic: same amount.'],
  ], B),
  mk('demerara-syrup', 'Sciroppo demerara', 'Demerara syrup', 'syrup', [
    ['simple-syrup', G, 'Meno ricco e caramellato.', 'Less rich and caramelly.'],
    ['brown-sugar', O, '1 cucchiaino = 10 ml, sciolto bene.', '1 teaspoon = 10 ml, well dissolved.'],
  ]),
  mk('orgeat', 'Orzata (orgeat)', 'Orgeat', 'syrup', [
    ['amaretto', O, 'Più alcolico: 15 ml e riduci il resto dello zucchero.', 'Boozier: 15 ml and cut other sugar.'],
    ['simple-syrup', E, 'Perde la mandorla: aggiungi 1 goccia di estratto.', 'Loses almond: add a drop of extract.'],
  ]),
  mk('grenadine', 'Granatina', 'Grenadine', 'syrup', [
    ['pomegranate-juice', O, 'Meno dolce: aggiungi 5 ml di sciroppo semplice.', 'Less sweet: add 5 ml simple syrup.'],
    ['raspberry-syrup', O, 'Sapore di lampone.', 'Raspberry flavour.'],
    ['creme-de-cassis', E, 'Ribes nero, più alcolico.', 'Blackcurrant, boozier.'],
  ], B),
  mk('falernum', 'Falernum', 'Falernum', 'syrup', [
    ['orgeat', O, 'Aggiungi un pizzico di spezie e lime.', 'Add a pinch of spice and some lime.'],
    ['cinnamon-syrup', E, 'Solo spezie, niente mandorla.', 'Spice only, no almond.'],
  ]),
  mk('honey-syrup', 'Sciroppo di miele', 'Honey syrup', 'syrup', [
    ['honey', G, '2 parti di miele e 1 di acqua tiepida.', '2 parts honey to 1 part warm water.'],
    ['agave-syrup', G, 'Più neutro, stessa dose.', 'More neutral, same amount.'],
    ['simple-syrup', O, 'Perde l\'aroma del miele.', 'Loses the honey aroma.'],
  ]),
  mk('agave-syrup', 'Sciroppo d\'agave', 'Agave syrup', 'syrup', [
    ['honey-syrup', G, 'Più aromatico.', 'More aromatic.'],
    ['simple-syrup', O, 'Meno dolce: usane un po\' di più.', 'Less sweet: use a bit more.'],
  ]),
  mk('raspberry-syrup', 'Sciroppo di lampone', 'Raspberry syrup', 'syrup', [
    ['grenadine', O, 'Più dolce e meno fruttato.', 'Sweeter, less fruity.'],
    ['chambord', G, 'Alcolico, più intenso.', 'Alcoholic, more intense.'],
  ]),
  mk('vanilla-syrup', 'Sciroppo di vaniglia', 'Vanilla syrup', 'syrup', [
    ['simple-syrup', E, 'Perde la vaniglia: aggiungi 1 goccia di estratto.', 'Loses vanilla: add a drop of extract.'],
    ['galliano', E, '10 ml, più alcolico e con anice.', '10 ml, boozier with anise.'],
  ]),
  mk('cinnamon-syrup', 'Sciroppo di cannella', 'Cinnamon syrup', 'syrup', [
    ['demerara-syrup', O, 'Più ricco; aggiungi cannella.', 'Richer; add cinnamon.'],
    ['simple-syrup', E, 'Aggiungi un pizzico di cannella in polvere.', 'Add a pinch of ground cinnamon.'],
  ]),
  mk('ginger-syrup', 'Sciroppo di zenzero', 'Ginger syrup', 'syrup', [
    ['ginger-beer', O, '30 ml al posto di 15 ml di sciroppo; riduci il resto del liquido.', '30 ml replaces 15 ml syrup; cut other liquid.'],
    ['simple-syrup', E, 'Aggiungi 2 fettine di zenzero fresco pestate.', 'Add 2 slices of muddled fresh ginger.'],
  ]),
  mk('elderflower-syrup', 'Sciroppo di sambuco', 'Elderflower syrup', 'syrup', [
    ['elderflower-liqueur', O, 'Alcolico: usa 15 ml e meno zucchero.', 'Alcoholic: use 15 ml and less sugar.'],
    ['simple-syrup', E, 'Perde il fiore.', 'Loses the floral note.'],
  ]),
  mk('passion-fruit-syrup', 'Sciroppo di frutto della passione', 'Passion fruit syrup', 'syrup', [
    ['passion-fruit-puree', G, 'Più acida: aggiungi 5 ml di sciroppo.', 'Tarter: add 5 ml syrup.'],
    ['simple-syrup', E, 'Perde l\'aroma.', 'Loses the aroma.'],
  ]),
  mk('blue-curacao-syrup', 'Sciroppo blue curaçao (analcolico)', 'Blue curaçao syrup (non-alcoholic)', 'syrup', [
    ['blue-curacao', O, 'Alcolico: stessa dose.', 'Alcoholic: same amount.'],
    ['orange-juice', E, 'Perde il colore blu.', 'Loses the blue colour.'],
  ]),
  mk('lime-cordial', 'Lime cordial', 'Lime cordial', 'syrup', [
    ['lime-juice', O, 'Aggiungi 15 ml di sciroppo semplice.', 'Add 15 ml simple syrup.'],
    ['lemon-juice', E, 'Aggiungi 15 ml di sciroppo semplice.', 'Add 15 ml simple syrup.'],
  ]),
  mk('sour-mix', 'Sour mix', 'Sour mix', 'syrup', [
    ['lemon-juice', G, '2 parti di limone e 1 di sciroppo.', '2 parts lemon to 1 part syrup.'],
    ['lime-juice', O, 'Più aromatico.', 'More aromatic.'],
  ]),

  // ---------- SODA E BOLLICINE ANALCOLICHE ----------
  mk('tonic-water', 'Acqua tonica', 'Tonic water', 'soda', [
    ['bitter-lemon', O, 'Più dolce e agrumata.', 'Sweeter and more citrusy.'],
    ['soda-water', E, 'Niente amaro: aggiungi 10 ml di limone.', 'No bitterness: add 10 ml lemon.'],
  ], B),
  mk('soda-water', 'Acqua gassata (soda)', 'Soda water', 'soda', [
    ['sparkling-water', G, 'Stessa funzione, meno bollicine.', 'Same function, fewer bubbles.'],
    ['tonic-water', E, 'Più dolce e amara.', 'Sweeter and more bitter.'],
  ], B),
  mk('sparkling-water', 'Acqua frizzante', 'Sparkling water', 'soda', [
    ['soda-water', G, 'Più bollicine.', 'More fizz.'],
  ]),
  mk('ginger-beer', 'Ginger beer', 'Ginger beer', 'soda', [
    ['ginger-ale', O, 'Più dolce e meno piccante; aggiungi 5 ml di lime.', 'Sweeter, less spicy; add 5 ml lime.'],
    ['ginger-syrup', O, '15 ml di sciroppo + soda.', '15 ml syrup + soda.'],
  ], B),
  mk('ginger-ale', 'Ginger ale', 'Ginger ale', 'soda', [
    ['ginger-beer', O, 'Più piccante e intenso.', 'Spicier and stronger.'],
  ]),
  mk('cola', 'Cola', 'Cola', 'soda', [
    ['dr-pepper', E, 'Più dolce e fruttata.', 'Sweeter and fruitier.'],
  ], B),
  mk('dr-pepper', 'Cola alla ciliegia / Dr Pepper', 'Dr Pepper / cherry cola', 'soda', [
    ['cola', E, 'Meno fruttata.', 'Less fruity.'],
  ]),
  mk('lemon-soda', 'Limonata gassata', 'Lemon soda', 'soda', [
    ['lemon-lime-soda', G, 'Un po\' più dolce.', 'Slightly sweeter.'],
    ['soda-water', E, 'Aggiungi 15 ml di limone e 10 ml di sciroppo.', 'Add 15 ml lemon and 10 ml syrup.'],
  ], B),
  mk('lemon-lime-soda', 'Gassosa lemon-lime (Sprite)', 'Lemon-lime soda (Sprite)', 'soda', [
    ['lemon-soda', G, 'Più limone.', 'More lemon.'],
    ['soda-water', E, 'Aggiungi 10 ml di sciroppo e limone.', 'Add 10 ml syrup and lemon.'],
  ]),
  mk('bitter-lemon', 'Bitter lemon', 'Bitter lemon', 'soda', [
    ['tonic-water', O, 'Meno limone: aggiungi 10 ml di limone.', 'Less lemon: add 10 ml lemon.'],
    ['lemon-soda', E, 'Meno amara.', 'Less bitter.'],
  ]),
  mk('energy-drink', 'Energy drink', 'Energy drink', 'soda', [
    ['lemon-lime-soda', E, 'Senza caffeina né gusto tipico.', 'No caffeine or the typical flavour.'],
  ]),

  // ---------- LATTICINI E UOVA ----------
  mk('cream', 'Panna fresca', 'Heavy cream', 'dairy', [
    ['coconut-cream', O, 'Gusto di cocco.', 'Coconut taste.'],
    ['milk', E, 'Meno cremoso: usane un po\' di più.', 'Less creamy: use a bit more.'],
  ], B),
  mk('milk', 'Latte', 'Milk', 'dairy', [
    ['oat-milk', G, 'Vegano, più dolce.', 'Vegan, sweeter.'],
    ['cream', E, 'Più denso: dimezza la dose.', 'Thicker: halve the amount.'],
  ], B),
  mk('oat-milk', 'Latte d\'avena', 'Oat milk', 'dairy', [
    ['milk', G, 'Meno dolce.', 'Less sweet.'],
  ]),
  mk('coconut-cream', 'Crema di cocco', 'Coconut cream', 'dairy', [
    ['coconut-milk', G, 'Più leggero: usa 1,5 volte la dose.', 'Lighter: use 1.5 times the amount.'],
    ['cream', O, 'Senza cocco: aggiungi 10 ml di sciroppo.', 'No coconut: add 10 ml syrup.'],
  ]),
  mk('coconut-milk', 'Latte di cocco', 'Coconut milk', 'dairy', [
    ['coconut-cream', G, 'Più denso: dimezza la dose.', 'Thicker: use less.'],
    ['milk', E, 'Senza cocco.', 'No coconut.'],
  ]),
  mk('whipped-cream', 'Panna montata', 'Whipped cream', 'dairy', [
    ['cream', O, 'Va montata un po\' prima di versarla.', 'Whip it lightly before pouring.'],
  ]),
  mk('vanilla-ice-cream', 'Gelato alla vaniglia', 'Vanilla ice cream', 'dairy', [
    ['cream', E, 'Meno freddo: aggiungi ghiaccio e 10 ml di sciroppo.', 'Less cold: add ice and 10 ml syrup.'],
  ]),
  mk('lemon-sorbet', 'Sorbetto al limone', 'Lemon sorbet', 'dairy', [
    ['lemon-juice', E, 'Aggiungi ghiaccio frullato e 10 ml di sciroppo.', 'Add blended ice and 10 ml syrup.'],
  ]),
  mk('egg-white', 'Albume', 'Egg white', 'dairy', [
    ['aquafaba', G, 'Vegano: 30 ml per albume; shake a secco.', 'Vegan: 30 ml per egg white; dry shake.'],
  ], B),
  mk('egg-yolk', 'Tuorlo', 'Egg yolk', 'dairy', [
    ['cream', E, 'Meno ricco: 20 ml per tuorlo.', 'Less rich: 20 ml per yolk.'],
  ]),
  mk('whole-egg', 'Uovo intero', 'Whole egg', 'dairy', [
    ['egg-yolk', O, 'Meno schiuma.', 'Less foam.'],
    ['egg-white', E, 'Meno corpo.', 'Less body.'],
  ]),
  mk('aquafaba', 'Aquafaba', 'Aquafaba', 'dairy', [
    ['egg-white', G, 'Non vegano: 1 albume per 30 ml.', 'Not vegan: 1 egg white per 30 ml.'],
  ]),

  // ---------- FRESCHI ----------
  mk('lime', 'Lime', 'Lime', 'fresh', [
    ['lemon', O, 'Meno amaro e aromatico.', 'Less bitter and aromatic.'],
  ], B),
  mk('lemon', 'Limone', 'Lemon', 'fresh', [
    ['lime', O, 'Più aspro e aromatico.', 'Tarter and more aromatic.'],
  ], B),
  mk('orange', 'Arancia', 'Orange', 'fresh', [
    ['grapefruit', E, 'Più amaro.', 'More bitter.'],
    ['lemon', E, 'Più acido.', 'Tarter.'],
  ], B),
  mk('grapefruit', 'Pompelmo', 'Grapefruit', 'fresh', [
    ['orange', E, 'Più dolce e meno amaro.', 'Sweeter and less bitter.'],
  ]),
  mk('mint', 'Menta', 'Mint', 'fresh', [
    ['basil', E, 'Profilo diverso, più dolce e aromatico.', 'Different, sweeter and more aromatic.'],
    ['creme-de-menthe-white', E, '10 ml di liquore al posto delle foglie.', '10 ml of liqueur instead of leaves.'],
  ], B),
  mk('basil', 'Basilico', 'Basil', 'fresh', [
    ['mint', E, 'Più fresca, meno pepata.', 'Fresher, less peppery.'],
  ]),
  mk('cucumber', 'Cetriolo', 'Cucumber', 'fresh', [
    ['celery', E, 'Più erbaceo e salato.', 'More herbal and salty.'],
  ]),
  mk('espresso', 'Espresso', 'Espresso', 'fresh', [
    ['cold-brew', G, 'Meno intenso: usa 1,5 volte la dose.', 'Less intense: use 1.5 times the amount.'],
    ['hot-coffee', O, 'Più leggero; raffredda prima.', 'Lighter; cool it first.'],
    ['coffee-liqueur', E, 'Più dolce: riduci lo zucchero.', 'Sweeter: cut the sugar.'],
  ], B),
  mk('cold-brew', 'Caffè cold brew', 'Cold brew coffee', 'fresh', [
    ['espresso', G, 'Più intenso: usa 2/3 della dose.', 'Stronger: use 2/3 of the amount.'],
    ['hot-coffee', O, 'Raffredda prima di usarlo.', 'Cool it down first.'],
  ]),
  mk('hot-coffee', 'Caffè caldo', 'Hot coffee', 'fresh', [
    ['espresso', G, 'Più concentrato: dimezza la dose.', 'More concentrated: use half.'],
  ]),
  mk('hot-water', 'Acqua calda', 'Hot water', 'fresh', [], A),
  mk('ginger', 'Zenzero fresco', 'Fresh ginger', 'fresh', [
    ['ginger-syrup', O, '15 ml al posto di 3 fettine.', '15 ml instead of 3 slices.'],
    ['ginger-beer', E, 'Meno intenso e più dolce.', 'Less intense and sweeter.'],
  ]),
  mk('strawberry', 'Fragola', 'Strawberry', 'fresh', [
    ['strawberry-puree', G, '30 ml al posto di 3-4 fragole.', '30 ml instead of 3-4 strawberries.'],
    ['raspberry', O, 'Più acida.', 'Tarter.'],
  ]),
  mk('raspberry', 'Lampone', 'Raspberry', 'fresh', [
    ['raspberry-puree', G, 'Stessa funzione.', 'Same role.'],
    ['strawberry', O, 'Più dolce.', 'Sweeter.'],
  ]),
  mk('blackberry', 'Mora', 'Blackberry', 'fresh', [
    ['raspberry', O, 'Più acida.', 'Tarter.'],
    ['creme-de-mure', O, '15 ml invece di 4 more.', '15 ml instead of 4 berries.'],
  ]),
  mk('peach', 'Pesca', 'Peach', 'fresh', [
    ['peach-puree', G, '30 ml per mezza pesca.', '30 ml per half peach.'],
  ]),
  mk('pineapple', 'Ananas', 'Pineapple', 'fresh', [
    ['pineapple-juice', G, '30 ml al posto di 2 pezzi.', '30 ml instead of 2 chunks.'],
  ]),
  mk('celery', 'Sedano', 'Celery', 'fresh', [
    ['cucumber', E, 'Meno sapido.', 'Less savoury.'],
  ]),
  mk('jalapeno', 'Jalapeño', 'Jalapeño', 'fresh', [
    ['tabasco', E, '2-3 gocce al posto di 2 fette.', '2-3 drops instead of 2 slices.'],
  ]),

  // ---------- SPEZIE E DISPENSA ----------
  mk('sugar', 'Zucchero', 'Sugar', 'spice', [
    ['simple-syrup', G, '10 ml = 1 cucchiaino di zucchero.', '10 ml = 1 teaspoon of sugar.'],
    ['honey', O, 'Più aromatico: dosa un po\' meno.', 'More aromatic: use a little less.'],
  ], { basic: true, assumed: true }),
  mk('brown-sugar', 'Zucchero di canna', 'Brown sugar', 'spice', [
    ['sugar', G, 'Meno caramello.', 'Less caramel.'],
    ['demerara-syrup', G, '10 ml per cucchiaino.', '10 ml per teaspoon.'],
  ]),
  mk('sugar-cube', 'Zolletta di zucchero', 'Sugar cube', 'spice', [
    ['sugar', G, '1 cucchiaino = 1 zolletta.', '1 teaspoon = 1 cube.'],
    ['simple-syrup', O, '5 ml = 1 zolletta.', '5 ml = 1 cube.'],
  ], B),
  mk('salt', 'Sale', 'Salt', 'spice', [], { basic: true, assumed: true }),
  mk('pepper', 'Pepe nero', 'Black pepper', 'spice', [
    ['tabasco', E, '1 goccia al posto di un pizzico.', '1 drop instead of a pinch.'],
  ], B),
  mk('nutmeg', 'Noce moscata', 'Nutmeg', 'spice', [
    ['cinnamon', E, 'Più dolce e meno terrosa.', 'Sweeter and less earthy.'],
  ]),
  mk('cinnamon', 'Cannella', 'Cinnamon', 'spice', [
    ['nutmeg', E, 'Più terrosa.', 'More earthy.'],
  ]),
  mk('tabasco', 'Tabasco', 'Tabasco', 'spice', [
    ['jalapeno', E, '2 fettine al posto di 3 gocce.', '2 slices instead of 3 drops.'],
    ['pepper', E, 'Meno piccante.', 'Less hot.'],
  ], B),
  mk('worcestershire', 'Salsa Worcestershire', 'Worcestershire sauce', 'spice', [
    ['tabasco', E, 'Perde l\'umami: aggiungi una goccia di salsa di soia.', 'Loses umami: add a drop of soy sauce.'],
  ], B),
  mk('honey', 'Miele', 'Honey', 'spice', [
    ['honey-syrup', G, 'Più fluido: stessa dose.', 'More fluid: same amount.'],
    ['agave-syrup', G, 'Più neutro.', 'More neutral.'],
  ]),
  mk('cocoa-powder', 'Cacao in polvere', 'Cocoa powder', 'spice', [
    ['chocolate-shavings', O, 'Per guarnire.', 'For garnish.'],
  ]),
  mk('coffee-beans', 'Chicchi di caffè', 'Coffee beans', 'spice', [
    ['cocoa-powder', E, 'Solo per guarnire.', 'Garnish only.'],
  ]),

  // ---------- GUARNIZIONI ----------
  mk('orange-peel', 'Scorza d\'arancia', 'Orange peel', 'garnish', [
    ['orange-slice', O, 'Meno oli essenziali.', 'Fewer essential oils.'],
    ['lemon-peel', E, 'Profumo di limone.', 'Lemon aroma.'],
  ], B),
  mk('lemon-peel', 'Scorza di limone', 'Lemon peel', 'garnish', [
    ['lemon-slice', O, 'Meno oli essenziali.', 'Fewer essential oils.'],
    ['orange-peel', E, 'Profumo d\'arancia.', 'Orange aroma.'],
  ], B),
  mk('lime-wedge', 'Spicchio di lime', 'Lime wedge', 'garnish', [
    ['lemon-wedge', O, 'Profumo di limone.', 'Lemon aroma.'],
  ], B),
  mk('lemon-wedge', 'Spicchio di limone', 'Lemon wedge', 'garnish', [
    ['lime-wedge', O, 'Profumo di lime.', 'Lime aroma.'],
  ]),
  mk('orange-slice', 'Fetta d\'arancia', 'Orange slice', 'garnish', [
    ['orange-peel', O, 'Solo scorza.', 'Peel only.'],
  ], B),
  mk('lemon-slice', 'Fetta di limone', 'Lemon slice', 'garnish', [
    ['lemon-peel', O, 'Solo scorza.', 'Peel only.'],
  ]),
  mk('lime-slice', 'Fetta di lime', 'Lime slice', 'garnish', [
    ['lime-wedge', G, 'Stesso uso.', 'Same use.'],
  ]),
  mk('maraschino-cherry', 'Ciliegia al maraschino', 'Maraschino cherry', 'garnish', [
    ['cocktail-cherry', G, 'Più scura e meno dolce.', 'Darker and less sweet.'],
    ['orange-peel', E, 'Perde il colore rosso.', 'Loses the red colour.'],
  ]),
  mk('cocktail-cherry', 'Ciliegia Luxardo', 'Luxardo cherry', 'garnish', [
    ['maraschino-cherry', G, 'Più dolce.', 'Sweeter.'],
  ]),
  mk('olive', 'Oliva', 'Olive', 'garnish', [
    ['cocktail-onion', E, 'Per il Gibson.', 'For a Gibson.'],
    ['lemon-peel', E, 'Twist di limone.', 'Lemon twist.'],
  ], B),
  mk('cocktail-onion', 'Cipollina', 'Cocktail onion', 'garnish', [
    ['olive', E, 'Più salata.', 'Brinier.'],
  ]),
  mk('mint-sprig', 'Rametto di menta', 'Mint sprig', 'garnish', [
    ['basil-sprig', E, 'Profumo diverso.', 'Different aroma.'],
    ['rosemary-sprig', E, 'Profumo resinoso.', 'Resinous aroma.'],
  ], B),
  mk('basil-sprig', 'Rametto di basilico', 'Basil sprig', 'garnish', [
    ['mint-sprig', E, 'Profumo di menta.', 'Mint aroma.'],
  ]),
  mk('celery-stalk', 'Gambo di sedano', 'Celery stalk', 'garnish', [
    ['cucumber-slice', E, 'Meno sapido.', 'Less savoury.'],
  ]),
  mk('cucumber-slice', 'Fetta di cetriolo', 'Cucumber slice', 'garnish', [
    ['celery-stalk', E, 'Più sapido.', 'More savoury.'],
  ]),
  mk('pineapple-wedge', 'Spicchio di ananas', 'Pineapple wedge', 'garnish', [
    ['orange-slice', E, 'Meno tropicale.', 'Less tropical.'],
  ]),
  mk('pineapple-leaf', 'Foglia di ananas', 'Pineapple leaf', 'garnish', [
    ['mint-sprig', E, 'Solo decorazione.', 'Decoration only.'],
  ]),
  mk('grated-nutmeg', 'Noce moscata grattugiata', 'Grated nutmeg', 'garnish', [
    ['nutmeg', G, 'Grattugia al momento.', 'Grate fresh.'],
    ['cinnamon', E, 'Cannella in polvere.', 'Ground cinnamon.'],
  ]),
  mk('cinnamon-stick', 'Stecca di cannella', 'Cinnamon stick', 'garnish', [
    ['cinnamon', O, 'Un pizzico di polvere sopra.', 'A pinch of powder on top.'],
  ]),
  mk('rosemary-sprig', 'Rametto di rosmarino', 'Rosemary sprig', 'garnish', [
    ['mint-sprig', E, 'Profumo fresco al posto del resinoso.', 'Fresh aroma instead of resinous.'],
  ]),
  mk('edible-flower', 'Fiore edibile', 'Edible flower', 'garnish', [
    ['mint-sprig', E, 'Solo decorazione.', 'Decoration only.'],
  ]),
  mk('chocolate-shavings', 'Scaglie di cioccolato', 'Chocolate shavings', 'garnish', [
    ['cocoa-powder', G, 'Spolverata di cacao.', 'A dusting of cocoa.'],
  ]),
  mk('coffee-beans-garnish', 'Chicchi di caffè (guarnizione)', 'Coffee beans (garnish)', 'garnish', [
    ['coffee-beans', G, 'Tre chicchi.', 'Three beans.'],
  ]),
  mk('salt-rim', 'Bordo di sale', 'Salt rim', 'garnish', [
    ['salt', G, 'Passa uno spicchio di lime sul bordo e immergilo nel sale.', 'Run a lime wedge around the rim and dip in salt.'],
  ]),
  mk('sugar-rim', 'Bordo di zucchero', 'Sugar rim', 'garnish', [
    ['sugar', G, 'Bagna il bordo con limone e immergilo nello zucchero.', 'Wet the rim with lemon and dip in sugar.'],
  ]),

  // ---------- ALTRO / ASSUNTI ----------
  mk('ice', 'Ghiaccio', 'Ice', 'other', [], { basic: true, assumed: true }),
  mk('crushed-ice', 'Ghiaccio tritato', 'Crushed ice', 'other', [
    ['ice', G, 'Pesta i cubetti in un canovaccio.', 'Crush cubes in a towel.'],
  ], { basic: true, assumed: true }),
  mk('water', 'Acqua', 'Water', 'other', [], { basic: true, assumed: true }),
  mk('crodino', 'Crodino', 'Crodino', 'other', [
    ['sanbitter', G, 'Stesso uso, più amaro e rosso.', 'Same use, bitterer and red.'],
    ['orange-juice', E, '60 ml di succo d\'arancia più 1 goccia di bitter.', '60 ml orange juice plus a dash of bitters.'],
  ]),
  mk('sanbitter', 'Sanbittèr', 'Sanbittèr', 'other', [
    ['crodino', G, 'Più dolce e arancione.', 'Sweeter and orange.'],
    ['cranberry-juice', E, 'Colore simile, più acido.', 'Similar colour, tarter.'],
  ]),
  mk('non-alcoholic-spirit', 'Distillato analcolico', 'Non-alcoholic spirit', 'other', [
    ['tonic-water', E, 'Meno aromatico.', 'Less aromatic.'],
  ]),
  mk('orange-flower-water', 'Acqua di fiori d\'arancio', 'Orange flower water', 'other', [
    ['triple-sec', E, 'Poche gocce di liquore.', 'A few drops of liqueur.'],
  ]),
  mk('rose-water', 'Acqua di rose', 'Rose water', 'other', [
    ['orange-flower-water', E, 'Profumo d\'arancio.', 'Orange aroma.'],
  ]),
  mk('vanilla-extract', 'Estratto di vaniglia', 'Vanilla extract', 'other', [
    ['vanilla-syrup', G, '10 ml di sciroppo al posto di 2 gocce.', '10 ml syrup instead of 2 drops.'],
  ]),
  mk('saline-solution', 'Soluzione salina', 'Saline solution', 'other', [
    ['salt', G, 'Un pizzico di sale.', 'A pinch of salt.'],
  ]),
]

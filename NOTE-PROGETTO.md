# Barista - note di progetto (LEGGI PER PRIMO)

## Obiettivo
- PWA mobile-first per baristi al lavoro: cerchi un drink e vedi dosi, bicchiere, tecnica e passi.
- Tasto "Non ce l'ho" su un ingrediente: propone sostituti o drink simili.
- Dispensa a spunta salvata sul dispositivo (funzione "Pro" finta, freemium).
- Italiano + inglese. Tema scuro.
- Scadenza prodotto finito: 16:00 del 6 novembre 2026.

## Decisioni vincolanti
- Lingue: it + en, ogni testo e L10n.
- Niente login/Supabase oggi (limite piano gratuito): strato dati predisposto con `repo.ts` (oggi `localRepo.ts` su localStorage, domani `supabaseRepo.ts`).
- Hosting: GitHub Pages (base `/barista/`).
- Freemium finto: prova 14 giorni sbloccata in locale. Prezzi segnaposto 4,99 EUR/mese e 39 EUR/anno in `src/config/pricing.ts`.
- Solo tema scuro (sfondo #0E0C0A, testo crema #F5EBDD, ambra #E8A33D).
- Nessuna AI nell'app.

## URL e repo
- Live: https://giacomosaragoni96-lang.github.io/barista/
- Repo: https://github.com/giacomosaragoni96-lang/barista (deploy automatico a ogni push su main, Action `deploy.yml`)

## Comandi
- `npm i` installa; `npm run dev` sviluppo; `npm run build` (tsc + vite); `npm run preview`
- `npm test` tutti i test; `npm run validate` solo test dei dati (`src/data`)

## Struttura e proprietari
| Percorso | Proprietario |
|---|---|
| `src/data/**` (types.ts, ingredients.ts, drinks/*.ts), `src/lib/**`, `src/state/**`, `src/config/**`, `.github/` (CI), `vite.config.ts` | backend |
| `src/components`, `src/screens`, `src/hooks`, `src/i18n`, `src/router.ts`, `src/index.css`, `src/App.tsx`, `src/main.tsx`, `public/` | interfaccia |
| `src/lib/__tests__/` | qualita |

Regole dati: `src/data/types.ts` e il contratto comune (non cambiarlo senza coordinatore). `src/data/drinks/index.ts` unisce i file in `allDrinks` / `allExtraIngredients` deduplicando per id (il primo vince). Un agente per file.

## Contratto delle funzioni
- `src/lib/catalog.ts`: `allDrinks: Drink[]`, `allIngredients: Ingredient[]` (ingredients.ts + extra dedup), `getDrink(id)`, `getIngredient(id)`, `ingName(id, lang)`.
- `src/lib/search.ts`: `searchDrinks(q, lang, limit=20): {drink, score, matched?: string}[]`; normalizza accenti/maiuscole, cerca su name, aliases e nomi ingredienti ("aperol" restituisce i drink con Aperol).
- `src/lib/alternatives.ts`: `getSubstitutes(ingId, pantry?): {ingredient, quality, note, inPantry?}[]`; `getSimilarDrinks(drinkId, missing: string[], pantry?, limit=4): {drink, reason: L10n, feasible?}[]` (punteggio: stessa famiglia +3, stessa base +3, ingredienti in comune, gusti in comune; esclude drink che contengono i mancanti).
- `src/lib/pantry.ts`: `checkDrink(drink, pantry: Set<string>|string[]): {status:'ok'|'substitute'|'missing', missing: string[], subs: {from,to}[]}` (guarnizioni, opzionali e assumed non bloccano); `drinksICanMake(pantry): {ready, withSubs, missingOne}`; `BASIC_KIT: string[]`.
- `src/lib/units.ts`: `formatAmount(amount, unit, system: 'ml'|'cl'|'oz', scale, lang): string` (1 oz = 30 ml, arrotonda a 0,25).
- `src/lib/plan.ts`: `isPro()`, `startTrial()`, `PRO_FEATURES`.
- `src/lib/storage/repo.ts`: interfaccia `UserDataRepo` asincrona (pantry, favorites, recents, settings, plan: get/set); `localRepo.ts` la implementa su localStorage con chiavi `barista:*` versionate; domani `supabaseRepo.ts`.
- `src/state/store.ts`: `usePantry()`, `useFavorites()`, `useRecents()`, `useSettings()` (lang, units), `usePlan()`; ognuno restituisce valore + azioni; basato su useSyncExternalStore.
- `src/config/pricing.ts`: prezzi segnaposto.

## Compiti
| # | Compito | Stato |
|---|---|---|
| T1 | Scheletro, schema dati, pipeline Pages, file di memoria | fatto |
| T2 | Catalogo ingredienti (`ingredients.ts`) | da fare |
| T3 | Logica + storage + store + validate | da fare |
| T4a-g | Archivio drink, 8 file (elenchi chiusi per file: li aggiunge il coordinatore) | da fare |
| T5 | Design system + guscio app | da fare |
| T6 | Schermate | da fare |
| T7 | Verifica qualita | da fare |
| T8 | Correzioni | da fare |
| T9 | Pubblicazione finale | da fare |

## Come riprendere
1. Leggi questo file e `CLAUDE.md`.
2. `npm i` poi `npm run dev`.
3. A fine compito aggiorna la tabella qui sopra.

## Cosa resta aperto / prossimi passi
- Supabase + login Google (implementare `supabaseRepo.ts`).
- Pagamenti Stripe (oggi Pro e finto).
- Tema chiaro.
- Foto dei drink (oggi illustrazione col colore del liquido).

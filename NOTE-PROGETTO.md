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
| T2 | Catalogo ingredienti (`ingredients.ts`) | fatto (13:25, 216 ingredienti) |
| T3 | Logica + storage + store + validate | fatto (13:16) |
| T4a-g | Archivio drink, 8 file (elenchi chiusi per file, vedi sotto) | fatto (14:17, 210 drink) |
| T5 | Design system + guscio app | fatto (13:18) |
| T6 | Schermate | fatto (14:20) |
| T7 | Verifica qualita | fatto (14:22, 18 test, 7 difetti trovati) |
| T8 | Correzioni | fatto (14:25, tutti i 7 difetti corretti) |
| T9 | Pubblicazione finale | fatto (14:28, commit 8847774, controllo finale VA BENE) |
| T10 | Upgrade ricetta: passi con icona del gesto, grassetto, progresso, barra in alto, tipografia | fatto (6 nov, parser src/lib/steps.ts, icone GestureIcon.tsx, 79 test verdi, controllo finale VA BENE) |
| T11 | Allineamento al ricettario SIB (IBA 2021), inglese perfetto, inglese lingua principale | fatto (6 nov sera: 3 drink nuovi, 213 drink, 190 test, controllo finale VA BENE) |

## Come riprendere
1. Leggi questo file e `CLAUDE.md`.
2. `npm i` poi `npm run dev`.
3. A fine compito aggiorna la tabella qui sopra.

## Cosa resta aperto / prossimi passi
- Supabase + login Google (implementare `supabaseRepo.ts`).
- Pagamenti Stripe (oggi Pro e finto).
- Tema chiaro.
- Foto dei drink (oggi illustrazione col colore del liquido).


## Elenchi drink per file (T4)
- iba-unforgettables.ts: 33 IBA Unforgettables (Alexander ... White Lady)
- iba-contemporary.ts: 33 IBA Contemporary (Bellini ... Bramble)
- iba-new-era.ts: 23 IBA New Era + Pornstar Martini, Gin Basil Smash, Jungle Bird, Mexican Mule, Kentucky Mule
- italiani-aperitivi.ts: 28 (spritz vari, Hugo, Negroni Sbagliato, Garibaldi, Gin Tonic, Bombardino, Caffe Shakerato...)
- classici-highball.ts: 35 (Vodka Lemon, White Russian, Amaretto Sour, Caipiroska, Rum e Pera...)
- tiki-tropicali.ts: 17 · shot-party.ts: 19-20 · mocktail.ts: 20

## Diario
- 13:30-14:10 del 6 nov 2026: limite di utilizzo raggiunto, 8 agenti interrotti; ripresi alle 14:13. Checkpoint commit 027fa62.

- 14:32: rifinitura grafica pubblicata (commit 1b07c37), flussi riprovati sul sito live: ricerca 'spriz' -> Aperol Spritz -> Non ce l'ho -> Usa questo (Select), console pulita. Screenshot in docs/screenshots/.
- 14:28: v1 completa online. 210 drink, 23 test verdi, build ok, controllo finale VA BENE.

- 6 nov: T10 upgrade grafico dei passi (icone gesto, grassetto automatico, Passo n di N, barra sticky). Limiti: nei passi lunghi con molti ingredienti il grassetto resta sul verbo; plurali italiani degli ingredienti non presi; home/ricerca/dispensa cambiate solo nella tipografia globale.


- 6 nov sera: T11. Ricette IBA allineate al ricettario SIB (il PDF e materiale protetto: non e nel repository; i test lo leggono solo se si imposta la variabile SIB_TXT). Aggiunti Barracuda, Illegal, VE.N.TO; Zombie riscritto. Daiquiri con lime (il PDF dice limone, scelta consapevole). Tutto l'inglese riscritto (americano); inglese lingua principale: lingua dal browser (it solo se il browser e italiano), unita en=oz e it=ml, prezzi $ per en e euro per it, percorsi #/pantry #/favorites #/can-make #/settings (i vecchi italiani restano come alias). Nomi descrittivi tradotti con il vecchio nome negli alias, id invariati.

## Cosa resta aperto (prossimi passi, in ordine)
1. Drink ancora fuori: Angelo Azzurro e Cuba Pantera (non sono nel ricettario SIB). Rose ha il tag contemporary ma non e nel PDF: dosi originali. Dubbi di contenuto da un barman: Trinidad Sour (la SIB dice stir), Mai Tai (rhum Martinique reso con rhum agricole), Zombie (Demerara reso con overproof).
2. Supabase + login (email, poi Google): implementare src/lib/storage/supabaseRepo.ts con la stessa interfaccia UserDataRepo e scegliere il repo in storage/index.ts. Limite piano gratuito: 2 progetti attivi (l'utente deve metterne in pausa uno o passare a Pro).
3. Pagamenti reali (Stripe) al posto del paywall finto; prezzi in src/config/pricing.ts.
4. Piccolezze: Paywall.tsx ricava '14' dal testo i18n (usare pricing.trialDays); versione '1.0.0' fissa in SettingsScreen.tsx (leggere da package.json).
5. Idee: tema chiaro, foto drink, food cost per drink, condivisione ricetta, modalita' 'batch' per eventi.

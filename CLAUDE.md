# Barista

Leggi PRIMA `NOTE-PROGETTO.md` e aggiornane la tabella dei compiti a fine compito.

## Comandi
- `npm run dev` / `npm run build` / `npm test` / `npm run validate` (test dei dati)
- Deploy: automatico con push su main (GitHub Pages, `/barista/`)

## Convenzioni
- id in kebab-case inglese (drink e ingredienti).
- Testi sempre `L10n` con it ed en.
- Nessun testo fisso nell'interfaccia fuori da `src/i18n`.
- `extraIngredients` solo se l'ingrediente manca davvero dal catalogo (dedup per id, il primo vince).
- Un agente per file: mai due agenti sugli stessi file.
- `src/data/types.ts` e il contratto: non modificarlo senza accordo.
- Solo tema scuro; italiano + inglese.

## Proprietari
- backend: `src/data/**`, `src/lib/**`, `src/state/**`, `src/config/**`, CI, `vite.config.ts`
- interfaccia: `src/components`, `src/screens`, `src/hooks`, `src/i18n`, `src/router.ts`, `src/index.css`, `App.tsx`, `main.tsx`, `public/`
- qualita: `src/lib/__tests__/`

# Checklist di pubblicazione - Barback

Preparata il 7 novembre 2026, aggiornata lo stesso giorno con le decisioni dell'utente (nome Barback, account Google Play e App Store già posseduti, app completamente gratuita). Nomi e numeri sono verificati con una ricerca web del 7 novembre 2026 dove indicato; dove non ho potuto verificare lo dico.
In questa cartella c'è tutto il materiale di testo e immagini. Nessun account, acquisto o invio è stato fatto.

## 0. Cosa mi serve da te (prima di tutto)

- [x] **Nome**: Barback (deciso). Nell'app resta "Barback"; negli store si usa un titolo più lungo e unico (vedi la sezione "Rischio nome" qui sotto e `testi-store.md`).
- [ ] **Email di contatto pubblica**: da creare (una casella dedicata che inoltra alla tua personale). Poi sostituire `[CONTACT EMAIL]` nei testi e nelle informative.
- [ ] **Nome dello sviluppatore**: il tuo nome, come compare nell'account (su Google Play deve coincidere con il nome legale). Poi sostituire `[DEVELOPER NAME]`.
- [ ] **Indirizzo web pubblico dell'informativa** (pagina raggiungibile da chiunque, non un file). Serve per entrambi gli store.
- [ ] **Sito o dominio** su cui mettere l'app (vedi sezione 2).
- [x] **Quali store**: entrambi; hai già gli account Google Play e App Store. Per iPhone serve comunque un Mac o un servizio in rete che ne offra uno.
- [ ] **La tua posizione di docente**: prima di intestare account di sviluppatore, dominio o email pubblica rileggi il capitolo 5 del PDF "situazione e prossimi passi" nella cartella `docs/` e fatti confermare per iscritto quello che serve. Non ho verificato né deciso nulla su questo punto. Anche la scelta "operatore commerciale / non commerciale" che Apple e Google chiedono per l'Unione europea (legge sui servizi digitali) va fatta con quel quadro chiaro.

## 1. Cosa ho già preparato io (cartella `docs/store/`)

- `testi-store.md`: titolo, descrizioni, parole chiave, novità, in inglese e italiano, già contati.
- `privacy-policy.md` e `privacy-policy.it.md`: informative con i segnaposto `[DEVELOPER NAME]`, `[CONTACT EMAIL]`, `[HOSTING PROVIDER]`.
- `risposte-moduli.md`: risposte per Data safety, classificazione contenuti, App Privacy, età, crittografia.
- `immagini/`: 24 screenshot telefono rifatti il 7 novembre con la versione attuale (6 per lingua, formati Google Play 1080x1920 e App Store 1290x2796), `icona-1024.png` (opaca, per Apple), `icona-512-play.png` (opaca, per Google Play), `feature-graphic-1024x500.png` (e versione `.it`, con il nome Barback) solo per Google Play.

Cose che ho notato (stato del 7 novembre):
- Le icone in `public/` sono state corrette dal settore interfaccia: `maskable-icon-512x512.png` e `apple-touch-icon-180x180.png` ora sono opache a tutto campo. `pwa-512x512.png` ha gli angoli arrotondati trasparenti (va bene per la PWA, non per gli store: usa le `icona-*.png` di `immagini/`).
- Le etichette italiane nelle schede dei drink (famiglia, tecnica) sono ora tradotte e gli screenshot italiani le mostrano.
- Per l'iPad: non ho fatto screenshot iPad (vedi sotto).

## Rischio nome (Barback)

**Il problema.** Il nome "Barback" è già usato da altre app di cocktail su entrambi gli store (esempi segnalati dall'utente il 7 novembre: "BarBack - Cocktail Assistant" di Jordan Link su App Store, "BarBack - Cocktail Companion" di Linkrulz su Google Play, "Barback: Cocktails" di Intelligent Sands LLC su App Store) ed esiste una domanda di marchio "BAR-BACK APP" (BARBACK, LLC, 2023, app per trovare collaboratori). Non ho ricontrollato questi dati: sono quelli forniti dall'utente.

**Cosa è stato deciso per ridurre il rischio.**
- Il nome nell'app resta **Barback**, ma il titolo negli store è più lungo e unico. Preferito: **"Barback: Recipes & Subs"** (23/30) in inglese e **"Barback: Ricette e Sostituti"** (28/30) in italiano.
- Piano B, in ordine, se il titolo A viene rifiutato o segnalato (tutti entro 30 caratteri):
  - EN: B "Barback: Bar Recipes & Subs" (27), C "Barback: Recipes & Pantry" (25), D "Barback: Recipes, Subs, Pantry" (30).
  - IT: B "Barback: Ricette e Dispensa" (27), C "Barback: Dosi e Sostituti" (25), D "Barback: Ricette per il Bar" (27).
- Mai usare nel titolo, nel sottotitolo o nelle parole chiave "Cocktail Assistant" o "Cocktail Companion" (sono i titoli di altre app).
- Il nome dello sviluppatore sarà il tuo nome (diverso da quelli sopra), l'icona è un calice da cocktail con una stella ambra, la descrizione dice che l'app è indipendente e non affiliata ad altre con nome simile. Prima di inviare, guarda le icone delle app omonime sugli store e controlla che la tua non sia confondibile (se lo è, cambia colori o simbolo).
- Email di contatto dedicata e, se possibile, un indirizzo web dell'informativa con il tuo nome o dominio, non quello di altri.

**Se lo store rifiuta il nome.**
1. App Store: App Store Connect rifiuta subito un nome già in uso al momento di creare la scheda. Prova B, poi C, poi D (stessa lingua). Lo stesso vale se la revisione segnala somiglianza o violazione di diritti: cambia titolo e rispondi nella stessa conversazione di revisione.
2. Google Play: permette titoli uguali, ma può rifiutare o sospendere per violazione della politica sui metadati o sulla proprietà intellettuale se il titolare di un marchio protesta. Cambia il titolo con B, C o D e invia di nuovo; se ricevi una segnalazione, rispondi e non ignorarla.
3. Se anche D viene rifiutato, o arriva una diffida del titolare del marchio: **cambio nome** completo (app, store, informative). Il cambio tocca `index.html`, il manifest in `vite.config.ts`, `src/i18n` e le immagini di questa cartella: è un lavoro di poche ore, ma va fatto prima di pubblicare, non dopo.

**Consiglio forte: fai verificare il marchio prima del lancio.** Cerca "Barback" (e varianti BAR-BACK, BARBACK) nelle banche dati ufficiali: UIBM (Italia), EUIPO TMview (Unione europea), USPTO (Stati Uniti), guardando le classi del software scaricabile (classe 9) e dei servizi software/web (classi 42 e 41). Meglio ancora, una verifica da un consulente di marchi e proprietà intellettuale prima di spendere tempo e soldi. Questo non è un parere legale e non so se il tuo uso sia in conflitto con quei marchi: la valutazione spetta a un professionista. Se emerge un conflitto, il momento giusto per cambiare nome è adesso.

## 2. Percorso tecnico

### Android

Due strade; la decisione tecnica va presa insieme, io consiglio la B se non vuoi un dominio.

**A) App web impacchettata (TWA) con PWABuilder o Bubblewrap**
- Serve un indirizzo con **https** e un **dominio proprio** (oppure `nomeutente.github.io` dedicato, vedi sotto). La sua radice deve pubblicare `/.well-known/assetlinks.json` (collega l'app alla chiave di firma; senza, l'app mostra la barra del browser).
- **L'indirizzo attuale `https://giacomosaragoni96-lang.github.io/barista/` NON va bene**: sta in un sottopercorso `/barista/` e il file `assetlinks.json` deve stare nella radice del sito (`https://.../.well-known/assetlinks.json`), che su GitHub Pages appartiene a un altro progetto (`nomeutente.github.io`). Servono: un dominio proprio, oppure un repository chiamato `nomeutente.github.io` con l'app alla radice.
- Per fare il passaggio alla radice va cambiato `base` in `vite.config.ts` da `/barista/` a `/`, `start_url` e `scope` del manifest, e i collegamenti in `index.html` (settore backend/interfaccia; io non l'ho toccato).
- PWABuilder (sito web, senza installare nulla) produce il pacchetto AAB da caricare; Bubblewrap è lo stesso strumento da riga di comando (richiede Java e Android SDK).
- Firma: usa "Play App Signing" e metti nel file `assetlinks.json` l'impronta SHA-256 che mostra la Play Console.
- Costo: dominio, circa 10-15 euro l'anno (stima mia, non verificata); hosting su GitHub Pages gratuito.

**B) Capacitor (consigliata): i file stanno dentro l'app**
- Non serve dominio né `assetlinks.json`. L'app funziona offline davvero, perché i file sono nel pacchetto.
- Serve installare Android Studio sul PC. È lo stesso progetto che si usa per iOS: un solo lavoro per due store.
- Contro: ogni aggiornamento dei contenuti richiede una nuova versione da caricare (con TWA, invece, l'aggiornamento è il normale deploy del sito).

### iPhone (iOS)

- **Capacitor** (impacchetta il sito in un'app iOS). Per compilare serve **Xcode, quindi un Mac**. Senza Mac si può provare un servizio di compilazione in rete o i computer macOS di GitHub Actions: non l'ho verificato per questo progetto.
- **Attenzione, rischio revisione Apple (regola 4.2, "funzionalità minime")**: Apple a volte rifiuta app che sono solo un sito dentro una cornice. Punti a favore di Barback: funziona offline con i file nel pacchetto, ha un'interfaccia pensata per il telefono, vibrazione, schermo sempre acceso. Per ridurre il rischio meglio spedirla con i dati inclusi nell'app (Capacitor) e non caricandola da internet.
- Chiavi `Info.plist` da impostare: `ITSAppUsesNonExemptEncryption` = `NO` (vedi `risposte-moduli.md`).
- Per iPad: un'app Capacitor di norma gira anche su iPad, e allora Apple chiede screenshot iPad. Per semplificare si può limitarla a iPhone. Da decidere con me.

## 3. Account e costi (verificato con ricerca web il 7 novembre 2026)

| Store | Costo | Note |
|---|---|---|
| Google Play | **25 USD una tantum** (hai già l'account) | Confermato dalla pagina di aiuto di Google ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)). Può richiedere documento d'identità e carta intestati al nome legale. |
| Apple Developer Program | **99 USD l'anno** (hai già l'account; rinnovo annuale) | Importo confermato da più guide di terzi di quest'anno; la pagina ufficiale Apple non l'ho potuta aprire. Possono esserci IVA e altri importi a seconda del paese. |

Altri costi eventuali: dominio (vedi sopra); un Mac o un servizio di compilazione se vuoi iOS.

### Regola Google Play per account personali nuovi (verificato il 7 novembre 2026)

- **Cosa dice la pagina di aiuto ufficiale** ([App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)): gli account personali creati **dopo il 13 novembre 2023** devono fare un **test chiuso con almeno 12 tester che restano iscritti in modo continuativo per almeno 14 giorni**, prima di poter chiedere l'accesso alla produzione (pubblicazione).
- Dettagli (da guide di terzi, non confermati dalla pagina ufficiale): chi esce e rientra azzera il conteggio dei 14 giorni; dopo i 14 giorni si fa richiesta a Google e la risposta arriva di solito in circa 7 giorni; gli account "organizzazione" sarebbero esenti; alcune fonti dicono che la regola vale per ogni nuova app, altre per l'account: **va controllata sulla pagina ufficiale quando apri l'account**.
- Una guida di terzi del 2026 dice che da settembre 2026 anche la verifica d'identità degli sviluppatori è obbligatoria per i nuovi account personali; non confermato da Google nelle fonti che ho letto.
- **Conseguenza pratica**: l'attesa minima è di circa 14 giorni di test più il tempo di revisione. Conviene far partire il test chiuso appena l'account è pronto. Servono 12 persone con un account Google che accettino di installare l'app di test e tenerla per 14 giorni. Visto che l'app parla di alcol, invita solo maggiorenni (niente studenti minorenni).
- Se il tuo account Google Play è stato creato prima del 13 novembre 2023, la regola non si applica (secondo la pagina di Google): controlla la data di creazione, l'attesa cambia molto.

## 4. Ordine consigliato dei passi

1. **Tu**: completa la sezione 0 (email, nome sviluppatore, indirizzo dell'informativa, sito/dominio, chiarimento sulla posizione di docente) e fai la verifica del marchio (sezione "Rischio nome").
2. **Io**: compilo i segnaposto nei testi e nelle informative; preparo la pagina pubblica dell'informativa (serve un indirizzo pubblico: può essere una pagina del sito dell'app).
3. **Tu**: pubblica o fai pubblicare l'informativa a un indirizzo pubblico e dammi l'indirizzo.
4. **Google Play**:
   1. Tu: completa l'account sviluppatore (già aperto) e la verifica d'identità, se richiesta. Non posso farlo io.
   2. Io: genero il pacchetto Android (AAB).
   3. Tu: carichi l'AAB in "Test chiuso", aggiungi 12 tester e **il giorno stesso** parte il conteggio dei 14 giorni.
   4. Tu: compili la scheda (testi, immagini, moduli): usa `testi-store.md`, `immagini/` e `risposte-moduli.md`.
   5. Dopo 14 giorni: richiesta accesso alla produzione, poi pubblicazione.
5. **App Store** (se lo vuoi):
   1. Tu: controlla che l'iscrizione ad Apple Developer Program sia attiva (99 USD/anno).
   2. Io: preparo il progetto iOS con Capacitor (serve un Mac o un servizio in rete).
   3. Caricamento su TestFlight, prova su un iPhone vero, poi invio alla revisione con `testi-store.md`, `immagini/`, `risposte-moduli.md` e le note per i revisori.
6. Dopo la pubblicazione: se cambi qualcosa che riguarda i dati (login, analisi, pubblicità, pagamenti), aggiornare informativa e moduli **prima** di rilasciare.

## 5. Da controllare prima di inviare

- [x] Nome Barback già in testi, informative, `index.html` e manifest (verificato il 7 novembre). Nelle schede degli store usare il titolo unico (A) di `testi-store.md`.
- [ ] Verifica del marchio fatta (vedi "Rischio nome").
- [ ] `[CONTACT EMAIL]`, `[DEVELOPER NAME]`, `[HOSTING PROVIDER]` compilati.
- [ ] Provare l'app in modalità aereo: ricette, ricerca, dispensa devono funzionare (il testo dice che funziona offline).
- [ ] **Marchi**: le ricette seguono i classici dell'elenco IBA e il ricettario SIB, ma il testo degli store non cita IBA né SIB né marchi di liquori (Campari, Aperol, ecc.) nei titoli e nelle parole chiave: non aggiungerli, per evitare rifiuti per marchio. Le ricette del ricettario SIB sono materiale protetto: ricontrollare i diritti prima di pubblicare (decisione tua, non mia).
- [ ] Dubbi di contenuto ancora aperti nelle note del progetto (Trinidad Sour, Mai Tai, Zombie, Rose): farli vedere a un barman prima di pubblicare.
- [ ] Gli screenshot mostrano app vuota/nuovo utente più kit base nella dispensa: sono veri, nessun dato inventato.

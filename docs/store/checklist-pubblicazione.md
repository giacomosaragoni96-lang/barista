# Checklist di pubblicazione - Barista

Preparata il 7 novembre 2026. Nomi e numeri sono verificati con una ricerca web del 7 novembre 2026 dove indicato; dove non ho potuto verificare lo dico.
In questa cartella c'è tutto il materiale di testo e immagini. Nessun account, acquisto o invio è stato fatto.

## 0. Cosa mi serve da te (prima di tutto)

- [ ] **Nome definitivo** dell'app (massimo 30 caratteri; controlla che non sia già usato negli store).
- [ ] **Email di contatto pubblica** (comparirà negli store e nell'informativa; meglio una casella dedicata).
- [ ] **Nome dello sviluppatore** come vuoi che compaia (su Google Play deve coincidere con il nome legale dell'account).
- [ ] **Indirizzo web pubblico dell'informativa** (pagina raggiungibile da chiunque, non un file). Serve per entrambi gli store.
- [ ] **Sito o dominio** su cui mettere l'app (vedi sezione 2).
- [ ] **Quali store**: solo Android (più semplice, serve solo il PC) o anche iPhone (serve un Mac o un servizio in rete che ne offra uno, e 99 USD l'anno).
- [ ] **La tua posizione di docente**: prima di intestare account di sviluppatore, dominio o email pubblica rileggi il capitolo 5 del PDF `docs/Barista-situazione-e-prossimi-passi.pdf` e fatti confermare per iscritto quello che serve. Non ho verificato né deciso nulla su questo punto. Anche la scelta "operatore commerciale / non commerciale" che Apple e Google chiedono per l'Unione europea (legge sui servizi digitali) va fatta con quel quadro chiaro.

## 1. Cosa ho già preparato io (cartella `docs/store/`)

- `testi-store.md`: titolo, descrizioni, parole chiave, novità, in inglese e italiano, già contati.
- `privacy-policy.md` e `privacy-policy.it.md`: informative con i segnaposto `[DEVELOPER NAME]`, `[CONTACT EMAIL]`, `[HOSTING PROVIDER]`.
- `risposte-moduli.md`: risposte per Data safety, classificazione contenuti, App Privacy, età, crittografia.
- `immagini/`: 24 screenshot telefono (6 per lingua, formati Google Play 1080x1920 e App Store 1290x2796), `icona-1024.png` (opaca, per Apple), `icona-512-play.png` (opaca, per Google Play), `feature-graphic-1024x500.png` (e versione `.it`) solo per Google Play.

Cose che ho notato e **non ho toccato** (non erano nella mia cartella):
- Le icone in `public/`: `pwa-512x512.png` ha gli angoli arrotondati trasparenti (vanno bene per la PWA, non per gli store: usa le mie `icona-*.png`). `maskable-icon-512x512.png` e `apple-touch-icon-180x180.png` hanno gli angoli bianchi invece di essere a tutto campo: per un'icona maskable il fondo scuro dovrebbe riempire tutto il quadrato. Da correggere dal settore interfaccia se si pubblica come PWA/TWA.
- Nelle schede dei drink in italiano si legge ancora "Spirit forward · Build" (famiglia e tecnica in inglese): da decidere se è voluto.
- Per l'iPad: non ho fatto screenshot iPad (vedi sotto).

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
- **Attenzione, rischio revisione Apple (regola 4.2, "funzionalità minime")**: Apple a volte rifiuta app che sono solo un sito dentro una cornice. Punti a favore di Barista: funziona offline con i file nel pacchetto, ha un'interfaccia pensata per il telefono, vibrazione, schermo sempre acceso. Per ridurre il rischio meglio spedirla con i dati inclusi nell'app (Capacitor) e non caricandola da internet.
- Chiavi `Info.plist` da impostare: `ITSAppUsesNonExemptEncryption` = `NO` (vedi `risposte-moduli.md`).
- Per iPad: un'app Capacitor di norma gira anche su iPad, e allora Apple chiede screenshot iPad. Per semplificare si può limitarla a iPhone. Da decidere con me.

## 3. Account e costi (verificato con ricerca web il 7 novembre 2026)

| Store | Costo | Note |
|---|---|---|
| Google Play | **25 USD una tantum** | Confermato dalla pagina di aiuto di Google ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)). Può richiedere documento d'identità e carta intestati al nome legale. |
| Apple Developer Program | **99 USD l'anno** (rinnovo annuale) | Importo confermato da più guide di terzi di quest'anno; la pagina ufficiale Apple non l'ho potuta aprire. Possono esserci IVA e altri importi a seconda del paese. |

Altri costi eventuali: dominio (vedi sopra); un Mac o un servizio di compilazione se vuoi iOS.

### Regola Google Play per account personali nuovi (verificato il 7 novembre 2026)

- **Cosa dice la pagina di aiuto ufficiale** ([App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)): gli account personali creati **dopo il 13 novembre 2023** devono fare un **test chiuso con almeno 12 tester che restano iscritti in modo continuativo per almeno 14 giorni**, prima di poter chiedere l'accesso alla produzione (pubblicazione).
- Dettagli (da guide di terzi, non confermati dalla pagina ufficiale): chi esce e rientra azzera il conteggio dei 14 giorni; dopo i 14 giorni si fa richiesta a Google e la risposta arriva di solito in circa 7 giorni; gli account "organizzazione" sarebbero esenti; alcune fonti dicono che la regola vale per ogni nuova app, altre per l'account: **va controllata sulla pagina ufficiale quando apri l'account**.
- Una guida di terzi del 2026 dice che da settembre 2026 anche la verifica d'identità degli sviluppatori è obbligatoria per i nuovi account personali; non confermato da Google nelle fonti che ho letto.
- **Conseguenza pratica**: l'attesa minima è di circa 14 giorni di test più il tempo di revisione. Conviene far partire il test chiuso appena l'account è pronto. Servono 12 persone con un account Google che accettino di installare l'app di test e tenerla per 14 giorni. Visto che l'app parla di alcol, invita solo maggiorenni (niente studenti minorenni).
- Se l'account è già stato creato prima del 13 novembre 2023, la regola non si applica (secondo la pagina di Google); controllalo.

## 4. Ordine consigliato dei passi

1. **Tu**: rispondi alla sezione 0 (nome, email, sviluppatore, indirizzo, sito/dominio, quali store, chiarimento sulla posizione di docente).
2. **Io**: compilo i segnaposto nei testi e nelle informative; preparo la pagina pubblica dell'informativa (serve un indirizzo pubblico: può essere una pagina del sito dell'app).
3. **Tu**: pubblica o fai pubblicare l'informativa a un indirizzo pubblico e dammi l'indirizzo.
4. **Google Play**:
   1. Tu: apri/completa l'account sviluppatore (25 USD) e la verifica d'identità. Non posso farlo io.
   2. Io: genero il pacchetto Android (AAB).
   3. Tu: carichi l'AAB in "Test chiuso", aggiungi 12 tester e **il giorno stesso** parte il conteggio dei 14 giorni.
   4. Tu: compili la scheda (testi, immagini, moduli): usa `testi-store.md`, `immagini/` e `risposte-moduli.md`.
   5. Dopo 14 giorni: richiesta accesso alla produzione, poi pubblicazione.
5. **App Store** (se lo vuoi):
   1. Tu: iscrizione ad Apple Developer Program (99 USD/anno).
   2. Io: preparo il progetto iOS con Capacitor (serve un Mac o un servizio in rete).
   3. Caricamento su TestFlight, prova su un iPhone vero, poi invio alla revisione con `testi-store.md`, `immagini/`, `risposte-moduli.md` e le note per i revisori.
6. Dopo la pubblicazione: se cambi qualcosa che riguarda i dati (login, analisi, pubblicità, pagamenti), aggiornare informativa e moduli **prima** di rilasciare.

## 5. Da controllare prima di inviare

- [ ] Nome definitivo sostituito in testi, informativa, `index.html` e manifest.
- [ ] `[CONTACT EMAIL]`, `[DEVELOPER NAME]`, `[HOSTING PROVIDER]` compilati.
- [ ] Provare l'app in modalità aereo: ricette, ricerca, dispensa devono funzionare (il testo dice che funziona offline).
- [ ] **Marchi**: le ricette seguono i classici dell'elenco IBA e il ricettario SIB, ma il testo degli store non cita IBA né SIB né marchi di liquori (Campari, Aperol, ecc.) nei titoli e nelle parole chiave: non aggiungerli, per evitare rifiuti per marchio. Le ricette del ricettario SIB sono materiale protetto: ricontrollare i diritti prima di pubblicare (decisione tua, non mia).
- [ ] Dubbi di contenuto ancora aperti nelle note del progetto (Trinidad Sour, Mai Tai, Zombie, Rose): farli vedere a un barman prima di pubblicare.
- [ ] Gli screenshot mostrano app vuota/nuovo utente più kit base nella dispensa: sono veri, nessun dato inventato.

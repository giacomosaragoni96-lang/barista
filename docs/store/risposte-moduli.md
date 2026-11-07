# Risposte pronte per i moduli degli store

Preparate il 7 novembre 2026, in italiano semplice. Si basano su ciò che ho verificato nel codice (cartella `src/`): l'app (nome: **Barback**, completamente gratuita) salva solo preferiti, dispensa, visti di recente e impostazioni nella memoria del dispositivo (localStorage). Non ci sono chiamate di rete per i dati dell'utente, né analytics, né pubblicità, né login, né fotocamera/posizione/contatti. I font sono inclusi nell'app (nessun servizio esterno).

**Se un giorno aggiungi login, analytics o pubblicità, queste risposte vanno rifatte.**

I nomi dei campi sono quelli in inglese dei moduli, perché è come li vedrai a schermo. Non posso aprire i moduli reali da qui: i nomi esatti possono cambiare un poco, la sostanza no.

---

## 1. Google Play Console

### 1.1 Sicurezza dei dati (Data safety)

| Domanda del modulo | Risposta |
|---|---|
| L'app raccoglie o condivide uno dei tipi di dati utente richiesti? (Does your app collect or share any of the required user data types?) | **No** |
| Tutti i dati sono criptati in transito? / Gli utenti possono chiedere la cancellazione? | Se rispondi "No" alla prima domanda, queste domande non compaiono. |
| Politica sulla privacy (URL) | L'indirizzo pubblico della pagina con `privacy-policy.md` (obbligatorio, vedi checklist) |

Perché "No": per Google "raccogliere" significa trasmettere dati fuori dal dispositivo. I preferiti e la dispensa restano sul dispositivo e non vengono trasmessi, quindi non contano.

Dubbio onesto: se l'app è un'app web caricata da un tuo server (percorso Android "TWA"), il server dell'hosting può registrare l'indirizzo IP nei suoi registri normali, come ogni sito. Non è un dato che l'app raccoglie o usa e per questo penso che "No" sia corretto, ma non ho modo di verificarlo con Google. Lo scrivo nell'informativa per trasparenza. Se scegli Capacitor (app con i file dentro il pacchetto) il dubbio non esiste.

### 1.2 Classificazione dei contenuti (IARC)

- **Categoria del questionario**: "Reference, news or educational" (consultazione/educativa). In alternativa "Utility, productivity, communication or other".
- Violenza: No. Contenuti sessuali o nudità: No. Linguaggio volgare: No. Paura/orrore: No. Gioco d'azzardo: No.
- **Alcol, tabacco, droghe** (Controlled substances): **Sì, riferimento ad alcol** (le ricette di cocktail contengono alcolici). L'app **non vende** alcol e **non ne permette l'acquisto**; non invita a bere in eccesso (nelle Impostazioni c'è l'avviso "Bevi responsabilmente / solo per maggiorenni").
- Interazione tra utenti / contenuti generati dagli utenti: No. Condivisione della posizione: No. Acquisti digitali: No.
- Il voto finale lo calcola Google dalle risposte (per i riferimenti all'alcol di solito esce un limite d'età medio, tipo PEGI 12 / ESRB Teen; non lo so con certezza). Non è un problema per la pubblicazione. Non cambiare le risposte per "abbassare" il voto: devono essere vere.

### 1.3 Pubblico di destinazione e contenuti (Target audience and content)

- Fascia d'età: **solo 18 anni e oltre** (18+). Non selezionare fasce sotto i 18: l'app parla di alcol e non è per bambini. Così non si applicano le regole delle app per famiglie.
- "L'app è rivolta ai bambini?" **No**.

### 1.4 Altre dichiarazioni

| Voce | Risposta |
|---|---|
| Pubblicità (Ads) | **No**, l'app non contiene pubblicità |
| ID pubblicitario (Advertising ID) | **No**, non lo usa |
| Accesso all'app (App access) | Tutte le funzioni sono disponibili senza account: "Tutte le funzionalità sono accessibili senza restrizioni" |
| Account / login | Nessuno: non serve nulla per l'eliminazione dell'account |
| Contenuti generati dagli utenti | Nessuno |
| Funzioni finanziarie, salute, notizie, governo, COVID | **No** a tutte |
| Acquisti in-app | Nessuno |
| App gratuita o a pagamento | **Gratuita (Free)**. Su Google Play questa scelta non si può cambiare dopo la pubblicazione: va bene, l'app resta gratuita. |
| Leggi sull'esportazione (Export laws) | Spunta la conferma standard: l'app non contiene crittografia propria |
| Categoria | Food & Drink (Cibo e bevande) |

---

## 2. App Store Connect (Apple)

### 2.1 Privacy dell'app (App Privacy)

- "Do you or your third-party partners collect data from this app?" → **No** → risultato sulla scheda: **Data Not Collected** (dati non raccolti).
- Informativa privacy: l'URL pubblico è obbligatorio comunque.
- Tracking (App Tracking Transparency): **non** usare tracciamento; nessuna finestra di richiesta nell'app; nessun IDFA.

### 2.2 Età consigliata (Age Rating)

Il questionario dell'età di Apple è cambiato: oggi le fasce sono **4+, 9+, 13+, 16+, 18+** (le vecchie 12+ e 17+ non esistono più, secondo le fonti che ho trovato il 7 novembre 2026). Quindi "17+" non è più una scelta: la fascia la calcola Apple dalle tue risposte.

Cosa rispondere e perché:
- **Alcohol, Tobacco, or Drug Use or References** (alcol, tabacco, droghe): rispondi in modo onesto che i riferimenti ad alcol sono **frequenti**: tutta l'app è fatta di ricette di cocktail. È il motivo per cui ci si aspetta una fascia alta (16+ o 18+; non so quale uscirà esattamente, lo decide il questionario).
- Tutte le altre voci (violenza, contenuti sessuali, linguaggio volgare, gioco d'azzardo, horror, ecc.): **Nessuno**.
- "Unrestricted web access" (navigazione web libera): **No** (l'app non è un browser).
- "Made for Kids": **No**.
- Se Apple consente di indicare un'età minima più alta di quella calcolata (override), non è necessario. Si può scegliere la più alta se vuoi essere prudente.

### 2.3 Crittografia (Export compliance)

- L'app non ha crittografia sua: al massimo usa quella standard del sistema (HTTPS). Questo di solito **rientra nelle esenzioni**: alla domanda "usa crittografia non esente?" rispondi **No**.
- Nel pacchetto iOS (Capacitor) si imposta in `Info.plist` la chiave `ITSAppUsesNonExemptEncryption` = `NO`, così Apple non chiede la conferma a ogni versione.
- In Francia: per la crittografia esente non serve alcun documento (ma verifica nella scheda di App Store Connect quando la compili: io non ho potuto confermare).

### 2.4 Altre voci

| Voce | Risposta |
|---|---|
| Account / login | **Nessun account**: non serve account demo per i revisori e non serve la funzione "elimina account" |
| Contenuti generati dagli utenti (UGC) | **Nessuno** (nessuna chat, commenti, condivisione di contenuti): le regole sui contenuti degli utenti non si applicano |
| Pubblicità | **Nessuna** |
| Acquisti in-app | **Nessuno** (app gratuita) |
| Funzioni di pagamento | **Nessuna** (nessun Apple Pay, nessuna carta, nessun checkout) |
| Contenuti di terzi / diritti | Le ricette sono scritte da noi; i nomi dei drink sono nomi comuni. Vedi la nota sui marchi e la sezione "Rischio nome" nella checklist |

Testo suggerito per le "Note per la revisione" (App Review Information):

> Barback is a free cocktail recipe reference. No account or sign-in is required. All data (favorites, pantry, settings) is stored locally on the device. The app does not collect personal data, show ads, or sell alcohol. It works offline.

---

## 3. Tabella riassuntiva (da tenere sotto mano)

| Domanda | Risposta |
|---|---|
| Raccoglie dati personali? | No |
| Condivide dati con terzi? | No |
| Pubblicità? | No |
| Account / login? | No |
| Contenuti generati dagli utenti? | No |
| Acquisti in-app? | No |
| Costo per chi la scarica | Zero: app gratuita |
| Alcol? | Sì, riferimenti (ricette); nessuna vendita |
| Età | Google: pubblico 18+; Apple: la fascia più alta proposta dal questionario con alcol "frequente" |
| Crittografia | Solo standard (HTTPS): esente |
| Categoria | Food & Drink |

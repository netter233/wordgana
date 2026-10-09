# Publicar WordGana en la App Store

Antes de empezar, la app ya tiene que instalar y funcionar desde Xcode, como se explica en
[IPHONE_INSTALL.md](IPHONE_INSTALL.md).

## 1. Inscribirte en el Apple Developer Program

1. Entrá a https://developer.apple.com/programs/enroll/ con tu Apple ID. Necesitás la verificación en dos pasos activada.
2. Inscribite como **Individual**. Tu nombre legal va a aparecer como vendedor en la App Store.
3. Pagá los USD 99. La aprobación puede tardar entre unas horas y un par de días.

## 2. Cambiar la firma al equipo pago

1. Ejecutá `npm run ios:open`.
2. En **Signing & Capabilities**, elegí en **Team** tu equipo pago, no el que dice **Personal Team**.
3. Dejá activado **Automatically manage signing** y verificá que el Bundle Identifier siga siendo `com.brunokupferberg.wordgana`.
4. Si el Team ID cambió, actualizá el que figura en [IPHONE_INSTALL.md](IPHONE_INSTALL.md).

## 3. Crear la app en App Store Connect

1. Entrá a https://appstoreconnect.apple.com → **Apps** → **+** → **Nueva app**.
2. Completá los campos:
   - **Plataforma:** iOS
   - **Nombre:** `WordGana: Hiragana & Katakana`. Debe ser único en toda la App Store; cada idioma de la
     ficha lleva una variante propia (ver **Idiomas de la ficha**).
   - **Idioma principal:** English (U.S.). Lo ven quienes tienen el iPhone en un idioma sin ficha propia.
   - **ID del paquete:** `com.brunokupferberg.wordgana`
   - **SKU:** `wordgana`

## 4. Completar la ficha

### Datos generales

| Campo | Valor |
| --- | --- |
| Categoría principal | Educación |
| Categoría secundaria | Referencia (opcional) |
| Precio | Gratis |
| Clasificación por edad | Respondé **No** a todo. El resultado es 4+ |
| URL de la política de privacidad | https://github.com/netter233/wordgana/blob/main/docs/PRIVACY.md |
| URL de soporte | https://github.com/netter233/wordgana/issues |
| Copyright | 2026 Bruno Kupferberg |

La URL de la política de privacidad funciona solo después de hacer push de `docs/PRIVACY.md` a GitHub.

### Privacidad de la app

En **Privacidad de la app**, elegí **No, no recopilamos datos de esta app**. Es correcto porque WordGana
no tiene servidor, analíticas ni publicidad: todo queda en el dispositivo.

### Cumplimiento de exportación

El `Info.plist` declara `ITSAppUsesNonExemptEncryption = false`, así que App Store Connect no te va a
preguntar por cifrado en cada build.

### Estado de comerciante en la UE

App Store Connect te va a pedir que declares si sos comerciante (*trader*) según la Ley de Servicios
Digitales (DSA). Para una app gratuita sin fines comerciales podés declarar que **no** sos comerciante.
Si declarás que sí, tu dirección y tu teléfono quedan públicos en la ficha. Si no querés responder, podés
excluir los países de la UE en **Disponibilidad**.

### Idiomas de la ficha

App Store Connect no acepta el mismo nombre en dos idiomas de la ficha: cada uno lleva una variante propia,
de 30 caracteres como máximo, que figura al principio de su sección. El idioma principal es inglés: quien tenga
el iPhone en un idioma sin ficha (japonés, coreano, chino…) ve la ficha en inglés.

En la página de la versión, usá el selector de idioma de arriba a la derecha → **Agregar idioma** y sumá:
**Spanish (Mexico)**, **Spanish (Spain)**, **Portuguese (Brazil)**, **French (France)**, **German** e
**Italian**. En cada uno pegá el nombre y los textos de abajo. El nombre y el subtítulo se cargan en
**Información de la app**; el resto, en la página de la versión.

No repitas en las palabras clave las que ya están en el nombre (WordGana, hiragana, katakana): Apple ya las
indexa en todos los idiomas.

### English (U.S.), idioma principal

**Nombre:** `WordGana: Hiragana & Katakana`

**Subtitle** (máximo 30 caracteres):
```
Learn kana with real words
```

**Promotional text** (máximo 170 caracteres):
```
Learn hiragana and katakana row by row with real words, then put them to use with travel phrases for the konbini, trains and hotels.
```

**Description:**
```
WordGana helps you learn hiragana and katakana step by step, using real Japanese words.

Check off the kana rows you already know, and WordGana builds rounds using only what you can read. As you add rows, new words unlock.

FROM CHARACTERS TO SENTENCES
• Characters: practice the individual kana of each new row.
• Words: nearly 450 in hiragana and almost 150 in katakana, each with its meaning.
• Sentences: complete every row to unlock simple sentences.

JAPANESE FOR YOUR TRIP
• Useful phrases for the konbini, restaurants, transport and hotels, like "Can I pay by card?" or "The check, please."
• Written in kana, so you can read them with what you've learned.

TWO PRACTICE MODES
• Read: see the kana and type its reading in romaji.
• Write: see the romaji and type it in kana with the Japanese keyboard.

BUILT FOR LEARNING
• Short rounds of 10.
• What you miss comes back more often.
• Hear the pronunciation with your device's Japanese voice.
• Accepts romaji variants like shi/si and tsu/tu.
• Statistics show the characters and words you find hardest.

STUDY TIME
• Time spent practicing in the app is logged automatically.
• Add what you study elsewhere with a timer or by hand: classes, reading, listening and your own categories.
• Daily goal, day-by-day chart and breakdown by category.

STAY MOTIVATED
• Daily streak and an optional reminder, only on days you haven't practiced yet.
• 30 achievements to unlock: rounds, streaks, study hours, vocabulary and more.

NO DISTRACTIONS
• Works offline.
• No accounts, no ads, no data collection.
• Your progress is saved on your device.

Available in English, Spanish, Portuguese, French, German and Italian.
```

**Keywords** (máximo 100 caracteres, separadas por coma y sin espacios):
```
japanese,romaji,learn,alphabet,vocabulary,writing,reading,beginner,jlpt,nihongo,travel,phrases
```

### Spanish (Mexico) y Spanish (Spain)

Las dos fichas llevan los mismos textos, en tuteo (no voseo), salvo el nombre.

**Nombre:** Spanish (Mexico): `WordGana: Hiragana y Katakana` · Spanish (Spain): `WordGana – Hiragana y Katakana`

**Subtítulo:**
```
Practica kana con palabras
```

**Texto promocional:**
```
Aprende hiragana y katakana fila por fila con palabras reales, y úsalos con frases de viaje para el konbini, el tren y el hotel.
```

**Descripción:**
```
WordGana te ayuda a aprender hiragana y katakana de forma progresiva, con palabras japonesas reales.

Marca las filas del silabario que ya conoces y WordGana arma rondas solo con lo que ya puedes leer. A medida que sumas filas, aparecen palabras nuevas.

DE LA LETRA A LA ORACIÓN
• Letras: practica los kana sueltos de cada fila nueva.
• Palabras: cerca de 450 en hiragana y casi 150 en katakana, cada una con su significado.
• Oraciones: al completar todas las filas se desbloquean oraciones simples.

JAPONÉS PARA TU VIAJE
• Frases útiles para el konbini, restaurantes, transporte y hoteles, como "¿Puedo pagar con tarjeta?" o "La cuenta, por favor".
• Escritas en kana, para que las leas con lo que ya aprendiste.

DOS MODOS DE PRÁCTICA
• Leer: ves el kana y escribes cómo se lee en romaji.
• Escribir: ves el romaji y escribes en kana con el teclado japonés.

PENSADA PARA APRENDER
• Rondas cortas de 10.
• Prioriza lo que más te cuesta.
• Escucha la pronunciación con la voz japonesa de tu dispositivo.
• Acepta variantes de romaji como shi/si o tsu/tu.
• Estadísticas con las letras y palabras que más te cuestan.

TIEMPO DE ESTUDIO
• El tiempo que practicas en la app se registra solo.
• Suma lo que estudias fuera de la app con cronómetro o a mano: clases, lectura, escucha y tus propias categorías.
• Meta diaria, gráfico por día y reparto por categoría.

MOTIVACIÓN PARA SEGUIR
• Racha de días y recordatorio diario opcional, solo los días que todavía no practicaste.
• 30 logros para desbloquear: rondas, racha, horas de estudio, vocabulario y más.

SIN DISTRACCIONES
• Funciona sin conexión.
• Sin cuentas, sin publicidad y sin recolección de datos.
• Tu progreso queda guardado en tu dispositivo.

Disponible en español, inglés, portugués, francés, alemán e italiano.
```

**Palabras clave:**
```
japonés,kana,romaji,aprender,silabario,vocabulario,japón,idioma,escritura,lectura,viaje,frases
```

### French (France)

**Nombre:** `WordGana: Hiragana et Katakana`

**Sous-titre :**
```
Apprenez les kana en mots
```

**Texte promotionnel :**
```
Apprenez les hiragana et katakana ligne par ligne avec de vrais mots, puis utilisez-les avec des phrases de voyage : konbini, train, hôtel.
```

**Description :**
```
WordGana vous aide à apprendre les hiragana et les katakana pas à pas, avec de vrais mots japonais.

Cochez les lignes de kana que vous connaissez déjà : WordGana crée des séries uniquement avec ce que vous savez lire. À chaque nouvelle ligne, de nouveaux mots se débloquent.

DU CARACTÈRE À LA PHRASE
• Caractères : entraînez-vous sur les kana de chaque nouvelle ligne.
• Mots : près de 450 en hiragana et presque 150 en katakana, chacun avec sa traduction.
• Phrases : terminez toutes les lignes pour débloquer des phrases simples.

LE JAPONAIS POUR VOTRE VOYAGE
• Des phrases utiles pour le konbini, le restaurant, les transports et l'hôtel, comme « Puis-je payer par carte ? » ou « L'addition, s'il vous plaît ».
• Écrites en kana, pour les lire avec ce que vous avez appris.

DEUX MODES D'ENTRAÎNEMENT
• Lire : vous voyez les kana et tapez leur lecture en romaji.
• Écrire : vous voyez le romaji et tapez les kana avec le clavier japonais.

PENSÉ POUR APPRENDRE
• Des séries courtes de 10.
• Ce que vous ratez revient plus souvent.
• Écoutez la prononciation avec la voix japonaise de votre appareil.
• Accepte les variantes de romaji comme shi/si ou tsu/tu.
• Des statistiques montrent les caractères et les mots les plus difficiles pour vous.

TEMPS D'ÉTUDE
• Le temps passé à pratiquer dans l'app est enregistré automatiquement.
• Ajoutez ce que vous étudiez ailleurs avec un chrono ou à la main : cours, lecture, écoute et vos propres catégories.
• Objectif quotidien, graphique jour par jour et répartition par catégorie.

RESTEZ MOTIVÉ
• Série de jours et rappel quotidien facultatif, uniquement les jours où vous n'avez pas encore pratiqué.
• 30 succès à débloquer : séries, régularité, heures d'étude, vocabulaire et plus.

SANS DISTRACTION
• Fonctionne hors ligne.
• Sans compte, sans publicité et sans collecte de données.
• Votre progression reste sur votre appareil.

Disponible en français, anglais, espagnol, portugais, allemand et italien.
```

**Mots-clés :**
```
japonais,kana,romaji,apprendre,alphabet,vocabulaire,japon,écriture,débutant,voyage,phrases
```

### German

**Nombre:** `WordGana: Hiragana + Katakana`

**Untertitel:**
```
Kana lernen mit echten Wörtern
```

**Werbetext:**
```
Lerne Hiragana und Katakana Reihe für Reihe mit echten Wörtern und nutze sie mit Reisesätzen für Konbini, Zug und Hotel.
```

**Beschreibung:**
```
WordGana hilft dir, Hiragana und Katakana Schritt für Schritt zu lernen – mit echten japanischen Wörtern.

Hake die Kana-Reihen ab, die du schon kennst, und WordGana stellt Runden nur aus dem zusammen, was du lesen kannst. Mit jeder neuen Reihe kommen neue Wörter dazu.

VOM ZEICHEN ZUM SATZ
• Zeichen: Übe die einzelnen Kana jeder neuen Reihe.
• Wörter: fast 450 in Hiragana und fast 150 in Katakana, jeweils mit Bedeutung.
• Sätze: Wenn du alle Reihen abgeschlossen hast, werden einfache Sätze freigeschaltet.

JAPANISCH FÜR DEINE REISE
• Nützliche Sätze für Konbini, Restaurant, Verkehrsmittel und Hotel, zum Beispiel „Kann ich mit Karte zahlen?“ oder „Die Rechnung, bitte“.
• In Kana geschrieben, damit du sie mit dem Gelernten lesen kannst.

ZWEI ÜBUNGSMODI
• Lesen: Du siehst Kana und tippst die Lesung in Romaji.
• Schreiben: Du siehst Romaji und tippst Kana mit der japanischen Tastatur.

ZUM LERNEN GEMACHT
• Kurze Runden mit 10 Aufgaben.
• Was du falsch machst, kommt öfter wieder.
• Hör dir die Aussprache mit der japanischen Stimme deines Geräts an.
• Akzeptiert Romaji-Varianten wie shi/si und tsu/tu.
• Statistiken zeigen, welche Zeichen und Wörter dir am schwersten fallen.

LERNZEIT
• Die Übungszeit in der App wird automatisch erfasst.
• Füge hinzu, was du anderswo lernst, mit Timer oder von Hand: Unterricht, Lesen, Hören und eigene Kategorien.
• Tagesziel, Tagesdiagramm und Aufteilung nach Kategorie.

BLEIB MOTIVIERT
• Tägliche Serie und optionale Erinnerung, nur an Tagen, an denen du noch nicht geübt hast.
• 30 Erfolge zum Freischalten: Runden, Serien, Lernstunden, Wortschatz und mehr.

OHNE ABLENKUNG
• Funktioniert offline.
• Kein Konto, keine Werbung, keine Datenerfassung.
• Dein Fortschritt bleibt auf deinem Gerät.

Verfügbar auf Deutsch, Englisch, Spanisch, Portugiesisch, Französisch und Italienisch.
```

**Schlüsselwörter:**
```
japanisch,kana,romaji,lernen,alphabet,vokabeln,japan,schreiben,lesen,anfänger,reise,sätze
```

### Portuguese (Brazil)

**Nombre:** `WordGana: Hiragana e Katakana`

**Subtítulo:**
```
Aprenda kana com palavras
```

**Texto promocional:**
```
Aprenda hiragana e katakana linha por linha com palavras reais e use tudo com frases de viagem para o konbini, o trem e o hotel.
```

**Descrição:**
```
O WordGana ajuda você a aprender hiragana e katakana passo a passo, com palavras japonesas reais.

Marque as linhas de kana que você já conhece e o WordGana monta rodadas só com o que você já consegue ler. A cada nova linha, aparecem palavras novas.

DA LETRA À FRASE
• Letras: pratique os kana de cada nova linha.
• Palavras: cerca de 450 em hiragana e quase 150 em katakana, cada uma com seu significado.
• Frases: ao completar todas as linhas, frases simples são desbloqueadas.

JAPONÊS PARA A SUA VIAGEM
• Frases úteis para o konbini, restaurantes, transporte e hotéis, como "Posso pagar com cartão?" ou "A conta, por favor".
• Escritas em kana, para você ler com o que já aprendeu.

DOIS MODOS DE PRÁTICA
• Ler: você vê o kana e escreve a leitura em romaji.
• Escrever: você vê o romaji e escreve em kana com o teclado japonês.

FEITO PARA APRENDER
• Rodadas curtas de 10.
• O que você erra volta com mais frequência.
• Ouça a pronúncia com a voz japonesa do seu dispositivo.
• Aceita variantes de romaji como shi/si ou tsu/tu.
• Estatísticas mostram as letras e palavras mais difíceis para você.

TEMPO DE ESTUDO
• O tempo que você pratica no app é registrado automaticamente.
• Some o que você estuda fora do app com cronômetro ou à mão: aulas, leitura, escuta e suas próprias categorias.
• Meta diária, gráfico dia a dia e divisão por categoria.

MOTIVAÇÃO PARA CONTINUAR
• Sequência de dias e lembrete diário opcional, só nos dias em que você ainda não praticou.
• 30 conquistas para desbloquear: rodadas, sequência, horas de estudo, vocabulário e mais.

SEM DISTRAÇÕES
• Funciona sem internet.
• Sem conta, sem anúncios e sem coleta de dados.
• Seu progresso fica salvo no seu dispositivo.

Disponível em português, inglês, espanhol, francês, alemão e italiano.
```

**Palavras-chave:**
```
japonês,kana,romaji,aprender,alfabeto,vocabulário,japão,escrita,leitura,iniciante,viagem,frases
```

### Italian

**Nombre:** `WordGana – Hiragana e Katakana`

**Sottotitolo:**
```
Impara i kana con parole vere
```

**Testo promozionale:**
```
Impara hiragana e katakana riga per riga con parole vere e usali con frasi di viaggio per il konbini, il treno e l'albergo.
```

**Descrizione:**
```
WordGana ti aiuta a imparare hiragana e katakana passo dopo passo, con vere parole giapponesi.

Seleziona le righe di kana che conosci già e WordGana crea serie solo con ciò che sai leggere. A ogni nuova riga si sbloccano nuove parole.

DAL CARATTERE ALLA FRASE
• Caratteri: esercitati con i kana di ogni nuova riga.
• Parole: quasi 450 in hiragana e quasi 150 in katakana, ognuna con il suo significato.
• Frasi: completa tutte le righe per sbloccare frasi semplici.

GIAPPONESE PER IL TUO VIAGGIO
• Frasi utili per il konbini, il ristorante, i trasporti e l'albergo, come "Posso pagare con la carta?" o "Il conto, per favore".
• Scritte in kana, per leggerle con quello che hai imparato.

DUE MODALITÀ DI PRATICA
• Leggere: vedi i kana e scrivi la lettura in romaji.
• Scrivere: vedi il romaji e scrivi in kana con la tastiera giapponese.

PENSATA PER IMPARARE
• Serie brevi da 10.
• Ciò che sbagli torna più spesso.
• Ascolta la pronuncia con la voce giapponese del tuo dispositivo.
• Accetta varianti di romaji come shi/si o tsu/tu.
• Le statistiche mostrano i caratteri e le parole più difficili per te.

TEMPO DI STUDIO
• Il tempo di pratica nell'app viene registrato automaticamente.
• Aggiungi ciò che studi altrove con il cronometro o a mano: lezioni, lettura, ascolto e categorie personalizzate.
• Obiettivo giornaliero, grafico giorno per giorno e ripartizione per categoria.

RESTA MOTIVATO
• Serie di giorni e promemoria giornaliero facoltativo, solo nei giorni in cui non hai ancora praticato.
• 30 traguardi da sbloccare: serie, costanza, ore di studio, vocabolario e altro.

SENZA DISTRAZIONI
• Funziona offline.
• Nessun account, nessuna pubblicità e nessuna raccolta di dati.
• I tuoi progressi restano sul tuo dispositivo.

Disponibile in italiano, inglese, spagnolo, francese, tedesco e portoghese.
```

**Parole chiave:**
```
giapponese,kana,romaji,imparare,alfabeto,vocabolario,giappone,scrittura,principiante,viaggio
```

## 5. Capturas de pantalla

Se cargan por tamaño de pantalla. Si subís el tamaño más grande, Apple lo reduce para el resto.

| Dispositivo | Tamaño en píxeles | Obligatorio |
| --- | --- | --- |
| iPhone con Dynamic Island (pantalla mediana, 6,1" o 6,3") | 1206 × 2622 | Sí: es la casilla que pide App Store Connect desde fines de 2026 |
| iPhone 6,9" (por ejemplo, iPhone 17 Pro Max) | 1320 × 2868 | No, si cargás la mediana |
| iPad 13" (por ejemplo, iPad Pro 13") | 2064 × 2752 | Sí, porque la app también es para iPad |

Cargá entre 3 y 10 capturas por dispositivo.

Las capturas ya están en `docs/app-store-screenshots/`, en español (`es`) e inglés (`en`), con una
carpeta para iPhone de 6,9" (`iphone`), otra para la pantalla mediana (`iphone-mediano`, escaladas desde las de
6,9") y otra para iPad. Ya tienen el tamaño correcto. Subí las de `en` en English (U.S.) y las
de `es` en las dos fichas de español. Portugués, francés, alemán e italiano pueden quedar sin capturas propias: en ese caso Apple
muestra las del idioma principal. Subilas en este orden: inicio, leer, correcto (con el botón de audio), escribir, resultados (con un
logro desbloqueado), logros, estadísticas y tiempo de estudio.

Son de la app real con progreso de ejemplo, renderizadas con WebKit, el mismo motor que usa la app en iOS.
Si cambiás la interfaz, podés regenerarlas así o sacar nuevas en el simulador de Xcode con **⌘S**.

Si no querés mantener la versión para iPad, cambiá **Supported Destinations** en Xcode para que quede solo
iPhone. En ese caso no hacen falta capturas de iPad.

## 6. Subir la build

1. Ejecutá:
   ```bash
   npm test
   npm run ios:sync
   npm run ios:open
   ```
2. En el selector de destino de Xcode, elegí **Any iOS Device (arm64)**.
3. Elegí **Product → Archive**. Al terminar se abre el **Organizer**.
4. Seleccioná el archivo, tocá **Distribute App** → **App Store Connect** → **Upload** y aceptá las opciones por defecto.
5. Esperá el mail de Apple que confirma que la build se procesó. Puede tardar entre 10 y 30 minutos.

Cada build que subas tiene que tener un **Build** mayor que la anterior: 1, 2, 3, etc. Lo cambiás en
**TARGETS → App → General**. Cuando publiques una actualización, subí también **Version**, por ejemplo de 1.0 a 1.1.

## 7. Probar con TestFlight (opcional)

En App Store Connect, abrí la pestaña **TestFlight**, agregate como tester interno e instalá la build desde
la app TestFlight en el iPhone. Sirve para comprobar que la versión que va a la tienda funciona antes de enviarla.

## 8. Enviar a revisión

1. En la pestaña de la app, abrí la versión 1.0 y en **Build** elegí la que subiste.
2. En **Información para la revisión**, desmarcá **Inicio de sesión requerido** y agregá esta nota:
   ```
   No account is required. The app works fully offline. To try it, select one or more kana rows on the home screen, pick Read or Write mode and start a round. Write mode uses the Japanese (Kana) keyboard; Read mode uses the standard keyboard. The optional daily reminder (Settings) uses local notifications only; nothing is sent to a server.
   ```
3. En **Lanzamiento de la versión**, elegí si se publica automáticamente al aprobarse o manualmente.
4. Tocá **Agregar para revisión** y después **Enviar a revisión de la app**.

La respuesta suele llegar en 1 o 2 días. Si la rechazan, el mensaje dice qué regla no se cumple. Corregí
eso, subí una build nueva y reenviala.

## Referencias oficiales

- [Apple Developer Program](https://developer.apple.com/programs/)
- [Subir builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds)
- [Especificaciones de capturas](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
- [Pautas de revisión de la App Store](https://developer.apple.com/app-store/review/guidelines/)
- [Detalles de privacidad de la app](https://developer.apple.com/app-store/app-privacy-details/)

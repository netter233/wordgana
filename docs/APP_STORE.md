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
   - **Nombre:** `WordGana: hiragana y katakana`. Debe ser único en toda la App Store. Si ya está tomado, probá otra variante.
   - **Idioma principal:** Español (México). Es la variante de español que se usa para Latinoamérica.
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

### Textos en español

**Subtítulo** (máximo 30 caracteres):
```
Practicá kana con palabras
```

**Texto promocional** (máximo 170 caracteres):
```
Aprendé hiragana y katakana fila por fila, practicando solo con palabras reales que ya podés leer.
```

**Descripción:**
```
WordGana te ayuda a aprender hiragana y katakana de forma progresiva, con palabras japonesas reales.

Marcá las filas del silabario que ya conocés y WordGana arma rondas usando solo palabras formadas con esas letras. A medida que sumás filas, aparecen palabras nuevas.

DOS MODOS DE PRÁCTICA
• Leer: ves la palabra en kana y escribís cómo se lee en romaji.
• Escribir: ves el romaji y escribís la palabra en kana con el teclado japonés.

PENSADA PARA APRENDER
• Rondas cortas de 10 palabras.
• Prioriza las palabras en las que más te equivocás.
• Acepta variantes de romaji como shi/si o tsu/tu.
• Cada palabra viene con su significado.
• Al completar todas las filas se desbloquean rondas de oraciones simples.

SIN DISTRACCIONES
• Funciona sin conexión.
• Sin cuentas, sin publicidad y sin recolección de datos.
• Tu progreso y tu racha quedan guardados en tu dispositivo.

Disponible en español, inglés, francés y alemán.
```

**Palabras clave** (máximo 100 caracteres, separadas por coma y sin espacios):
```
japonés,kana,romaji,aprender,silabario,vocabulario,japón,idioma,escritura,lectura,principiante
```

No repitas en las palabras clave las que ya están en el nombre (hiragana, katakana): Apple ya las indexa.

### Textos en inglés (opcional, recomendado)

Agregá la localización **English (U.S.)** con estos textos:

**Nombre:** `WordGana: Learn Kana`

**Subtítulo:**
```
Hiragana & katakana practice
```

**Texto promocional:**
```
Learn hiragana and katakana row by row, practicing only with real words you can already read.
```

**Descripción:**
```
WordGana helps you learn hiragana and katakana step by step, using real Japanese words.

Check off the kana rows you already know, and WordGana builds rounds using only words made from those characters. As you add rows, new words unlock.

TWO PRACTICE MODES
• Read: see the word in kana and type its reading in romaji.
• Write: see the romaji and type the word in kana with the Japanese keyboard.

BUILT FOR LEARNING
• Short rounds of 10 words.
• Words you miss come back more often.
• Accepts romaji variants like shi/si and tsu/tu.
• Every word comes with its meaning.
• Complete every row to unlock rounds of simple sentences.

NO DISTRACTIONS
• Works offline.
• No accounts, no ads, no data collection.
• Your progress and streak are saved on your device.

Available in English, Spanish, French and German.
```

**Palabras clave:**
```
japanese,hiragana,katakana,romaji,learn,alphabet,vocabulary,writing,reading,beginner,jlpt,nihongo
```

## 5. Capturas de pantalla

Se cargan por tamaño de pantalla. Si subís el tamaño más grande, Apple lo reduce para el resto.

| Dispositivo | Tamaño en píxeles | Obligatorio |
| --- | --- | --- |
| iPhone 6,9" (por ejemplo, iPhone 17 Pro Max) | 1320 × 2868 | Sí |
| iPad 13" (por ejemplo, iPad Pro 13") | 2064 × 2752 | Sí, porque la app también es para iPad |

Cargá entre 3 y 10 capturas por dispositivo. Por ejemplo: elegir filas, elegir modo, practicar en Leer,
practicar en Escribir y resultados.

Para sacarlas, corré la app en el simulador de ese modelo desde Xcode y presioná **⌘S**. La captura queda
en el escritorio con el tamaño correcto.

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
   No account is required. The app works fully offline. To try it, select one or more kana rows on the home screen, pick Read or Write mode and start a round. Write mode uses the Japanese (Kana) keyboard; Read mode uses the standard keyboard.
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

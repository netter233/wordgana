# Decisiones

Registro de decisiones tomadas con el usuario (Bruno) y su porqué. Agregar una entrada por decisión nueva.

## 2026-09-20 — Progreso recuperable y práctica más directa

**Decisión:** un ítem queda "afianzado" después de dos respuestas correctas consecutivas en la misma
combinación de silabario, Palabras/Oraciones y Leer/Escribir. Un error reinicia esa racha corta y prioriza
el ítem en rondas siguientes; dos nuevos aciertos permiten recuperarlo.

**Por qué:** el criterio anterior exigía no haber fallado nunca, por lo que una palabra quedaba fuera de
"dominadas" para siempre. También mezclaba comprensión y producción. El nuevo criterio comunica mejor el
estado actual y permite que el progreso refleje aprendizaje posterior sin introducir todavía un SRS completo.

**UX:** la selección de filas queda resumida detrás de Editar/Listo cuando ya está configurada. La práctica
agrega "No me acuerdo", corrección alineada para omisiones, textarea para oraciones y repaso directo de los
ítems fallados desde el resultado.

## 2026-09-20 — Hiragana/Katakana y oraciones avanzadas

**Decisión:** agregar un selector Hiragana/Katakana arriba de las estadísticas, con Hiragana a la izquierda.
Cada silabario conserva por separado sus filas, modo Leer/Escribir y tipo Palabras/Oraciones; la racha y las
rondas diarias siguen siendo globales. Katakana suma el alargador ー como fila especial además de ッ.

**Avanzado:** Oraciones se desbloquea al seleccionar todas las filas del silabario activo. Es una elección
separada de Leer/Escribir y no se activa automáticamente. Las rondas tienen 5 oraciones para compensar su
longitud. El romaji de las oraciones se guarda explícitamente porque las partículas は, へ y を no tienen siempre
su lectura literal.

**Katakana en oraciones:** se presupone que quien completó katakana ya aprendió hiragana, siguiendo el orden
de aprendizaje recomendado. Por eso las oraciones usan katakana para préstamos y nombres, e hiragana para
partículas y flexiones, sin ayudas ni transliteración parcial.

## 2026-09-20 — Proyecto iOS local con Capacitor

**Decisión:** agregar Capacitor y un proyecto Xcode con el identificador
`com.brunokupferberg.wordgana` para instalar WordGana directamente en un iPhone desde una Mac.
**Por qué:** permite ejecutar la app como una aplicación local independiente del servidor de desarrollo y
conserva el mismo código React/PWA. La firma queda gestionada por Xcode con el Apple ID del usuario.

## 2026-09-17 — Plataforma: PWA web, no app nativa

**Decisión:** React + Vite + TypeScript como PWA instalable.
**Por qué:** un solo código para iOS, Android y navegador. Se instala desde Safari/Chrome sin App Store,
sin Mac ni Xcode. Funciona offline.
**App Store después:** posible envolviendo el mismo build con Capacitor en un proyecto Xcode. Requiere Mac
y cuenta Apple Developer. Queda como Etapa 7 (futuro). Nada del diseño actual lo impide.

## 2026-09-17 — Significados en español, lista curada a mano

**Decisión:** `src/data/words.ts` con ~500 palabras `{ kana, es }` escritas a mano.
**Por qué:** el usuario habla español. Una lista curada garantiza palabras comunes, cortas y con muchas
combinables con pocas filas (vocales + K). Se descartó extraer JMdict (glosas en inglés, miles de palabras
raras, sin control).
**Futuro posible:** script que importe JMdict y traduzca, si la lista queda corta.

## 2026-09-17 — Rondas de 10 palabras

**Decisión:** sesiones de 10 con resumen (aciertos, falladas) y botón "Otra ronda".
**Por qué:** elegido por el usuario frente a modo infinito. Si hay menos de 10 palabras elegibles, la ronda
usa las que haya (mínimo 3).

## 2026-09-17 — Selección de modo con dos tarjetas, no un toggle de teclado

**Decisión:** en la pantalla inicial hay dos tarjetas: "Leer" (ejemplo en hiragana arriba, `___` abajo) y
"Escribir" (ejemplo en romaji arriba, `___` abajo). No hay un toggle aparte de "tengo teclado japonés".
**Por qué:** la tarjeta ya muestra qué vas a ver y qué vas a escribir; un toggle separado duplicaba la idea.
En modo Leer se acepta romaji **o** hiragana, así funciona también con un teclado IME sin configurar nada.

## 2026-09-17 — El romaji se genera, no se guarda

**Decisión:** las palabras solo guardan kana y significado. `toRomaji` produce Hepburn canónico y
`matchesRomaji` acepta variantes (shi/si, chi/ti, tsu/tu, fu/hu, ji/zi, o/wo, nn/n' para ん, macrones).
**Por qué:** una sola fuente de verdad; evita inconsistencias en 500 entradas escritas a mano.

## 2026-09-17 — Salir de la ronda en cualquier momento

**Decisión:** barra superior fija (`TopBar`) con una ✕ a la izquierda en las pantallas de práctica y
resultado, que vuelve a la configuración.
**Por qué:** el usuario quedaba atrapado: para salir de una ronda había que contestar las 10 palabras.
No pide confirmación porque cada respuesta ya se guardó en stats cuando se contestó: salir no pierde nada.

## 2026-09-17 — Aspecto de app móvil (barra, tarjetas, CTA fija)

**Decisión:** barra superior sticky con marca あ y título; secciones de la configuración dentro de
tarjetas blancas con sombra y títulos numerados ("1. ¿Qué filas ya sabés?"); chips seleccionados con
relleno de acento; botón principal en mayúsculas por CSS y fijo abajo (sticky) en la configuración;
barra de progreso en la práctica.
**Por qué:** el usuario pidió que se parezca más a una app móvil y pasó capturas de Kana Challenge como
referencia (barra superior, tarjetas, chips rellenos, CTA grande en mayúsculas). El texto en el código
sigue en minúsculas rioplatense; las mayúsculas son solo `text-transform`. La CTA fija resuelve además
que con muchas filas activas el botón quedaba lejos, al final de un scroll largo.

## 2026-09-17 — Emoji opcional por palabra en el feedback

**Decisión:** `Word` gana un campo `emoji?: string`, puesto a mano solo en las palabras donde hay un
emoji que representa el significado sin ambigüedad (alrededor de 150 de ~370). Se muestra al final de
la línea de feedback ("¡Bien! みず · mizu · agua 💧") al comprobar una respuesta, tanto si acertaste
como si no. Test que valida que cuando existe sea un único emoji (sin texto) y que haya una cantidad
razonable con emoji.
**Por qué:** pedido del usuario como "bonus" visual, con el ejemplo de いき (respiración) → 😮‍💨.
Explícitamente solo para palabras con un emoji claro, no forzarlo en todas: un emoji ambiguo o forzado
(p. ej. para "razón" o "sociedad") resta más de lo que suma. Se deja afuera de `toRomaji`/`checkAnswer`:
es puramente decorativo, no entra en la lógica de validación.

## 2026-09-17 — Racha, rondas de hoy y palabras dominadas (sin programa de días)

**Decisión:** tira de stats arriba del home: dos tiles (🔥 racha de días seguidos, 🎯 rondas de hoy) y
una barra "palabras dominadas" (contestadas al menos una vez y nunca falladas) sobre el total elegible
con las filas activas. Nueva clave `wordgana:progress:v1` con `{ lastDay, streak, roundsToday }`;
`countMastered` en `session.ts` sale de las stats por palabra que ya existían.
**Por qué:** el usuario quiso algo tipo Kana Challenge (racha, tiempo de estudio, "4 / 30 días"). Se
descartó copiar la barra de programa de 30 días porque WordGana no tiene currícula: no habría con qué
llenarla. El progreso real acá son las palabras dominadas, y el denominador son las palabras elegibles
con tus filas, así que la barra baja al activar filas nuevas — es honesto y empuja a practicarlas.
También se descartó el "tiempo de estudio": medir minutos en una PWA que se cierra sola es poco
confiable y no dice nada sobre lo aprendido.
**Detalles:** la racha solo cuenta rondas **terminadas** (salir con la ✕ no cuenta), el día se define
con la hora local del teléfono (medianoche, sin corte a las 4am), y si la última ronda fue ayer la
racha sigue viva sin sumar hasta que termines una hoy. No es punitiva: nunca avisa que la perdiste.

## 2026-09-17 — Filas de kana como unidades de selección

**Decisión:** básicas (あ か さ た な は ま や ら わ ん), dakuten/handakuten (が ざ だ ば ぱ), combinaciones
ゃゅょ (きゃ しゃ ちゃ にゃ ひゃ みゃ りゃ ぎゃ じゃ びゃ ぴゃ) y っ como toggle propio.
**Por qué:** refleja el orden en que los libros de texto enseñan hiragana. Una palabra es elegible solo si
todas sus unidades (tras tokenizar) pertenecen a filas activas.

## 2026-10-07 — Preparación para la App Store

**Decisión:** publicar la app de Capacitor en la App Store con una cuenta paga del Apple Developer Program.
En `Info.plist` se reemplazó `armv7` por `arm64` en `UIRequiredDeviceCapabilities` y se agregó
`ITSAppUsesNonExemptEncryption = false`. La política de privacidad vive en `docs/PRIVACY.md` y los pasos y
textos de la ficha en `docs/APP_STORE.md`.
**Por qué:** la firma gratuita vence cada 7 días y no permite distribuir la app a otras personas. `armv7` es
una arquitectura de 32 bits que iOS 15 ya no soporta; `arm64` describe correctamente los dispositivos
compatibles. La app solo usa el cifrado que trae iOS (HTTPS del sistema, aunque no hace pedidos de red), así
que queda exenta de la declaración de exportación y no hace falta responderla en cada build. La política de
privacidad se publica desde el repo público para no depender de un hosting aparte.

## 2026-10-07 — Letras sueltas como tercer tipo de práctica

**Decisión:** "Letras" es un `PracticeKind` más (`kana`), al lado de Palabras y Oraciones, con ítems generados
desde las filas activas (`letterItems`) en vez de una lista aparte. Las letras no tienen significado: el
feedback y el repaso muestran solo kana y romaji. El tipo por defecto sigue siendo Palabras.
**Por qué:** reutiliza ronda, validación (`checkAnswer` acepta variantes también para una sola letra) y progreso
por ítem sin código nuevo. Palabras sigue como default porque es la propuesta central de la app; Letras
queda primera en el selector porque es el orden natural de aprendizaje de una fila nueva.

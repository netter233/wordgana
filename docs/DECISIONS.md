# Decisiones

Registro de decisiones tomadas con el usuario (Bruno) y su porqué. Agregar una entrada por decisión nueva.

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

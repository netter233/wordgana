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

## 2026-09-17 — Filas de kana como unidades de selección

**Decisión:** básicas (あ か さ た な は ま や ら わ ん), dakuten/handakuten (が ざ だ ば ぱ), combinaciones
ゃゅょ (きゃ しゃ ちゃ にゃ ひゃ みゃ りゃ ぎゃ じゃ びゃ ぴゃ) y っ como toggle propio.
**Por qué:** refleja el orden en que los libros de texto enseñan hiragana. Una palabra es elegible solo si
todas sus unidades (tras tokenizar) pertenecen a filas activas.

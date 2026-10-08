# WordGana — plan de implementación

## Contexto

No existe una app para practicar hiragana de forma incremental: marcar las filas del silabario ya aprendidas
(por ejemplo vocales + fila K) y practicar solo con palabras reales formadas por esas letras, en dos sentidos
(leer hiragana → escribir romaji, o leer romaji → escribir hiragana con teclado japonés).
El directorio `C:\WordGana` está vacío: es un proyecto desde cero.

Decisiones ya tomadas con el usuario:
- **PWA web** (React + Vite + TypeScript). Instalable en iOS/Android desde el navegador, offline. Un solo código.
- **Significados en español**, lista curada a mano dentro del repo.
- **Rondas de 10 palabras** con resumen al final.
- Idioma de la interfaz: español.

Sobre publicar en App Store después: sí. El mismo build se envuelve con **Capacitor** en un proyecto Xcode
(necesita Mac + cuenta Apple Developer). Queda fuera de esta primera versión; el plan no hace nada que lo impida.

## Stack

- Vite + React 18 + TypeScript, `vite-plugin-pwa` (manifest + service worker para offline).
- CSS plano con variables (light/dark según sistema). Sin librería de UI.
- Vitest para la lógica de kana (tokenización, validación de romaji, elegibilidad).
- Deploy futuro: GitHub Pages o Vercel (fuera de alcance, solo `npm run build` debe funcionar).

## Modelo de datos

### Filas de kana (`src/data/kana.ts`)
Cada fila: `{ id, label, kana: string[] }`. Agrupadas en tres secciones:
1. **Básicas**: あ, か, さ, た, な, は, ま, や (やゆよ), ら, わ (わを), ん.
2. **Dakuten / handakuten**: が, ざ, だ, ば, ぱ.
3. **Combinaciones (ゃゅょ)**: きゃ, しゃ, ちゃ, にゃ, ひゃ, みゃ, りゃ, ぎゃ, じゃ, びゃ, ぴゃ.
4. **Especial**: っ (consonante doble) como toggle propio.

Tabla kana → romaji con **variantes aceptadas**: し `shi|si`, ち `chi|ti`, つ `tsu|tu`, ふ `fu|hu`, じ `ji|zi`,
ぢ `ji|di`, づ `zu|du`, を `o|wo`, しゃ `sha|sya`, ちゃ `cha|tya`, じゃ `ja|jya|zya`, ん `n|nn|n'`,
っ = consonante siguiente duplicada. Romaji canónico mostrado: Hepburn.

### Palabras (`src/data/words.ts`)
`{ kana: "みず", es: "agua" }` — ~500 palabras comunes. El romaji **no se guarda**: se genera desde el kana
(evita inconsistencias). Criterio de curado: muchas palabras cortas que se puedan formar con pocas filas
(あい, いえ, うえ, あお, あか, いけ, こえ, かお, きく, えき…) para que el modo "solo vocales + K" ya tenga
material, más vocabulario básico de libro de texto (Genki/Minna) para el resto.

## Lógica (`src/lib/`)

- `kana.ts`
  - `tokenize(kana)`: divide en unidades (`き`, `きゃ`, `っ`, `ん`). Base para todo lo demás.
  - `toRomaji(kana)`: Hepburn canónico (maneja っ y ん).
  - `matchesRomaji(input, kana)`: matcher con backtracking unidad por unidad aceptando todas las variantes;
    normaliza minúsculas, espacios, macrones (ō→ou/oo). Evita generar el producto cartesiano de variantes.
  - `normalizeHiragana(input)`: trim, katakana→hiragana, NFKC.
  - `isEligible(kana, enabledRowIds)`: todas las unidades pertenecen a filas activas.
  - `checkAnswer(input, word, mode)`: en modo Leer acepta romaji **o** hiragana (para teclados con IME);
    en modo Escribir solo hiragana.
- `session.ts`: `pickRound(words, n=10, stats)` sin repetidos; palabras falladas antes pesan ×3.
- `storage.ts`: localStorage con try/catch para filas activas, modo y stats por palabra.

## UI

### Pantalla 1: Configuración (home)
Una sola pantalla con scroll, en este orden:
1. **"¿Qué filas ya sabés?"** — chips por fila, agrupadas en las 3 secciones + っ. Cada chip muestra la
   etiqueta (K) y los kana chicos (か き く け こ). Botones "Todas" / "Ninguna".
   Debajo, contador en vivo: "N palabras disponibles".
2. **"¿Cómo querés practicar?"** — dos tarjetas lado a lado, exactamente como propuso el usuario:
   - Tarjeta **Leer**: arriba una palabra de ejemplo en hiragana (`みず`), abajo `___`.
     Subtítulo: "Te muestro hiragana, escribís en romaji".
   - Tarjeta **Escribir**: arriba `mizu`, abajo `___`. Subtítulo: "Te muestro romaji, escribís en hiragana.
     Necesitás teclado japonés".
   La palabra de ejemplo se toma de las palabras elegibles con las filas actuales (cambia al tocar chips).
   La tarjeta elegida se marca con borde de acento. Esto reemplaza el "toggle de teclado": la tarjeta ya
   dice qué se escribe.
3. Botón grande **"Empezar ronda"**. Deshabilitado con menos de 3 palabras elegibles; entre 3 y 9 la ronda
   usa las que haya.

### Pantalla 2: Práctica
- Progreso "3 / 10" arriba.
- Palabra grande (hiragana o romaji según modo). Input único con `lang="ja"` en modo Escribir,
  `autocapitalize=off autocorrect=off` en modo Leer. Enter o botón "Comprobar".
- Feedback inline: verde "¡Bien! みず · mizu · agua"; rojo "Era: みず · mizu · agua". Botón "Siguiente"
  (Enter también avanza). Foco vuelve al input.

### Pantalla 3: Resultado
- "8 / 10". Lista de falladas con kana · romaji · significado.
- Botones "Otra ronda" (mismas filas y modo) y "Cambiar filas".

Diseño: mobile-first, gutter 16px, tipografía grande para kana, `viewport-fit=cover`, colores por tokens
en `:root` con dark mode.

## Archivos a crear

```
package.json, vite.config.ts, tsconfig.json, index.html
public/manifest icons (192/512 png generados simples)
src/main.tsx, src/App.tsx (estado: screen | rows | mode | round), src/styles.css
src/data/kana.ts, src/data/words.ts
src/lib/kana.ts, src/lib/session.ts, src/lib/storage.ts
src/lib/kana.test.ts
src/components/RowPicker.tsx, ModeCards.tsx, Practice.tsx, Results.tsx
README.md (cómo correr, cómo instalar como PWA en iPhone, nota sobre Capacitor)
```

## Etapas (secuenciales, cada una deja el repo funcionando)

Marcar cada etapa como hecha en `docs/PLAN.md` al terminarla. Cualquier modelo (Opus/Sonnet) debe poder
abrir el repo, leer `CLAUDE.md` y continuar desde la primera etapa sin tildar.

- [x] **Etapa 0 — Documentación en el repo.** Crear `CLAUDE.md` (qué es la app, stack, comandos, convenciones,
      "leé docs/PLAN.md y seguí la primera etapa sin tildar"), `docs/PLAN.md` (copia de este plan con la lista
      de etapas) y `docs/DECISIONS.md` (las decisiones tomadas con el usuario y su porqué). `git init` + primer commit.
- [x] **Etapa 1 — Scaffold.** Vite + React + TS, `vite-plugin-pwa`, Vitest, `styles.css` con tokens y dark mode,
      `index.html` con viewport móvil. `npm run dev`, `npm test` y `npm run build` funcionan con una pantalla vacía.
- [x] **Etapa 2 — Datos y lógica de kana (con tests).** `src/data/kana.ts` (filas, tabla romaji con variantes),
      `src/lib/kana.ts` (`tokenize`, `toRomaji`, `matchesRomaji`, `normalizeHiragana`, `isEligible`, `checkAnswer`)
      y `src/lib/kana.test.ts` con los casos de la sección Verificación. Todo verde antes de seguir.
- [x] **Etapa 3 — Lista de palabras.** `src/data/words.ts` con ~500 palabras `{ kana, es }`. Test que valida
      que cada palabra sea hiragana puro y tokenizable, sin duplicados, y que con solo あ+か haya ≥ 10 palabras.
- [x] **Etapa 4 — Pantalla de configuración.** `RowPicker` (chips por sección, Todas/Ninguna, contador en vivo)
      y `ModeCards` (dos tarjetas con ejemplo dinámico). Persistencia en localStorage (`storage.ts`). Botón Empezar.
- [x] **Etapa 5 — Práctica y resultados.** `session.ts` (`pickRound` con peso ×3 a falladas), `Practice`
      (input, comprobar, feedback, siguiente, manejo de foco y Enter) y `Results` (score, falladas, Otra ronda /
      Cambiar filas). Stats por palabra guardadas.
- [x] **Etapa 6 — PWA y pulido móvil.** Manifest, íconos 192/512, service worker offline, `lang="ja"` en el input
      de modo Escribir, prueba real en iPhone por LAN (`npm run dev -- --host`). README con instalación en iOS.
- [x] **Etapa 7 — Proyecto iOS local.** Capacitor + Xcode configurados para compilar e instalar la app
      directamente en un iPhone desde una Mac. La publicación en App Store sigue fuera de alcance.
- [x] **Etapa 8 — Katakana.** Selector Hiragana/Katakana, filas y preferencias independientes, vocabulario
      propio, soporte de ッ y ー, y rondas de lectura/escritura reutilizando el flujo existente.
- [x] **Etapa 9 — Oraciones avanzadas.** Desbloqueo al seleccionar todas las filas, selector Palabras/Oraciones,
      rondas de 5 frases simples, traducciones y lecturas de partículas correctas. Las oraciones de katakana
      combinan katakana con hiragana gramatical y asumen que el usuario ya aprendió hiragana.
- [x] **Etapa 10 — UX de práctica y progreso.** Progreso recuperable con dos aciertos consecutivos y separado
      por modo, filas colapsables, corrección de texto alineada, "No me acuerdo", textarea compatible con IME
      y repaso inmediato de los errores de una ronda.
- [x] **Etapa 11 — Más vocabulario.** Completar las filas con pocas palabras (ぱ, combinaciones ゃゅょ, ざ/だ/わ
      en hiragana; は/や/わ y combinaciones en katakana) con traducciones a los cuatro idiomas. Test que exige un
      mínimo de palabras por fila para que activar una fila nueva siempre sume material.
- [x] **Etapa 12 — Letras sueltas.** Tercer tipo de práctica "Letras": rondas con los kana individuales de las
      filas activas, en Leer y Escribir, con el mismo progreso por ítem que las palabras. Pensado para el primer
      contacto con una fila nueva.
- [x] **Etapa 13 — Audio.** Pronunciación con la voz japonesa del sistema (`speechSynthesis`), sin red. Botón de
      escuchar en el feedback y en la lista de repaso, nunca antes de responder. Opción en configuración para
      reproducir automáticamente al responder. Se oculta si el dispositivo no tiene voz japonesa.
- [x] **Etapa 14 — Estadísticas.** Pantalla accesible desde el home con totales históricos (rondas, respuestas,
      precisión, mejor racha), precisión por modo, letras que más cuestan (agregando las respuestas de las
      palabras que las contienen) y palabras que más cuestan. Registro histórico en localStorage.
- [x] **Etapa 15 — Recordatorio diario.** Notificación local con `@capacitor/local-notifications`, solo en la app
      nativa. Activación y hora en configuración, permiso pedido al activarla, y sin aviso si ya practicaste ese día.
- [x] **Etapa 16 — Logros.** Logros por rondas completadas, palabras aprendidas, racha, rondas perfectas, letras
      dominadas y variedad de práctica. Se evalúan al terminar cada ronda y se celebran en Resultados. Pantalla
      de logros con progreso hacia los bloqueados.
- [x] **Etapa 17 — Ficha de la tienda.** Actualizar descripción y capturas de `docs/APP_STORE.md` con las
      funciones nuevas.
- [x] **Etapa 18 — Tiempo de estudio automático.** Modelo `StudyEntry` en `src/lib/studyTime.ts` (registros por
      día y categoría en localStorage). Cada respuesta suma el tiempo activo de la práctica (tope de 90 s por
      pregunta, pausa en segundo plano) a la categoría `practice:script:kind`.
- [x] **Etapa 19 — Pantalla de tiempo de estudio y meta diaria.** Hoy, gráfico semanal/4 semanas, reparto por
      categoría y totales. Meta diaria opcional en configuración, tile "Hoy" con progreso y mención en el
      recordatorio.
- [x] **Etapa 20 — Cronómetro, carga manual y categorías.** Cronómetro que sobrevive a cerrar la app, formulario
      compartido de carga, categorías fijas (escucha, lectura, clase…) y personalizadas archivables.
- [ ] **Etapa 21 — Historial editable.** Registros agrupados por día; editar o borrar los manuales y de
      cronómetro, borrar los automáticos.
- [ ] **Etapa 22 — Logros por horas y cierre.** Logros de 1 a 1000 horas y de meta cumplida 7/30 días; README,
      CLAUDE.md, ficha de la tienda y capturas.

## Verificación

1. `npm test` — casos: tokenización de きゃ/っ/ん; `matchesRomaji("shi", "し")` y `("si","し")` true;
   `("kitte","きって")` true; `("sensei","せんせい")` y `("sennsei", …)` true; `isEligible("かき", [a,k])` true,
   `isEligible("さけ", [a,k])` false; `toRomaji("がっこう") === "gakkou"`.
2. `npm run dev -- --host` y abrir desde el iPhone en la misma red: probar modo Leer con teclado inglés y
   con teclado japonés (ambos deben aceptar), y modo Escribir con teclado japonés.
3. Con solo あ + か activas, confirmar que el contador da >0 y que ninguna palabra de la ronda usa otras filas.
4. `npm run build && npm run preview`: la app carga offline tras la primera visita y muestra "Agregar a
   pantalla de inicio" en Safari (manifest válido).

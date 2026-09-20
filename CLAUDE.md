# WordGana

App web (PWA) para practicar hiragana y katakana de forma incremental: el usuario marca las filas del
silabario que ya sabe y practica con palabras reales formadas solo por esas letras, en modo Leer (kana →
romaji) o Escribir (romaji → kana con teclado japonés). Al completar todas las filas se desbloquean rondas
de 5 oraciones simples; las rondas de palabras son de 10. Interfaz en español.

## Cómo continuar el trabajo

1. Leé `docs/PLAN.md`. Tiene el diseño completo y una lista de etapas con checkboxes.
2. Seguí la **primera etapa sin tildar**. No saltees etapas: cada una deja el repo funcionando.
3. Al terminar una etapa: `npm test` y `npm run build` en verde, tildar la etapa en `docs/PLAN.md`, commit.
4. Si tomás una decisión de diseño que no está en el plan, anotala en `docs/DECISIONS.md` con el porqué.

## Stack

- Vite + React 18 + TypeScript. `vite-plugin-pwa` para manifest y service worker.
- CSS plano en `src/styles.css` con variables en `:root` y dark mode por `prefers-color-scheme`.
- Vitest para tests de lógica (`src/lib/*.test.ts`).
- Sin librerías de UI ni de estado. Sin backend. Persistencia en localStorage.

## Comandos

```
npm install
npm run dev            # servidor local
npm run dev -- --host  # para abrir desde el celular en la misma red
npm test               # vitest
npm run build          # build de producción en dist/
npm run preview        # sirve dist/ (para probar PWA/offline)
```

## Estructura

```
src/data/kana.ts      filas de hiragana/katakana y tabla kana → romaji con variantes aceptadas
src/data/words.ts     lista curada de palabras en hiragana { kana, es }
src/data/katakanaWords.ts vocabulario curado que se escribe normalmente en katakana
src/data/sentences.ts oraciones avanzadas con romaji explícito por las lecturas de partículas
src/lib/kana.ts       tokenize, toRomaji, matchesRomaji, normalizeHiragana, isEligible, checkAnswer
src/lib/session.ts    pickRound: arma la ronda de 10 sin repetidos, pesa ×3 las falladas; countMastered
src/lib/storage.ts    localStorage (filas activas, modo, stats por palabra, racha), siempre con try/catch
src/components/       TopBar, StatsStrip, RowPicker, ModeCards, Practice, Results
src/App.tsx           estado global: pantalla, filas, modo, ronda
```

## Convenciones

- El romaji nunca se guarda en datos: se genera desde el kana con `toRomaji`. Una sola fuente de verdad.
- Toda validación de respuestas pasa por `checkAnswer`. Acepta variantes (shi/si, tsu/tu, nn para ん, etc.).
- Las palabras de `words.ts` son hiragana puro. Hay un test que lo verifica; no lo desactives.
- Mobile-first: gutter de 16px, tipografía grande para kana, sin scroll horizontal, `viewport-fit=cover`.
- Textos de la interfaz en español rioplatense (vos), sin mayúsculas innecesarias.
- No agregar dependencias sin anotarlo en `docs/DECISIONS.md`.

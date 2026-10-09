# WordGana

App (PWA y app de iPhone con Capacitor) para practicar hiragana y katakana de forma incremental: el usuario
marca las filas del silabario que ya sabe y practica con letras sueltas o palabras reales formadas solo por esas
letras, en modo Leer (kana → romaji) o Escribir (romaji → kana con teclado japonés). Al completar todas las filas
se desbloquean rondas de 5 oraciones simples; las de letras y palabras son de 10. Incluye audio, estadísticas,
logros, tiempo de estudio y recordatorio diario. Interfaz en español, inglés, portugués de Brasil, francés,
alemán e italiano.

## Cómo continuar el trabajo

1. Leé `docs/PLAN.md`. Tiene el diseño completo y una lista de etapas con checkboxes.
2. Seguí la **primera etapa sin tildar**. No saltees etapas: cada una deja el repo funcionando.
3. Al terminar una etapa: `npm test` y `npm run build` en verde, tildar la etapa en `docs/PLAN.md`, commit.
4. Si tomás una decisión de diseño que no está en el plan, anotala en `docs/DECISIONS.md` con el porqué.

## Stack

- Vite + React 18 + TypeScript. `vite-plugin-pwa` para manifest y service worker.
- Capacitor 8 para la app de iOS (`ios/`), con `@capacitor/local-notifications` para el recordatorio.
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
src/data/kana.ts         filas de hiragana/katakana y tabla kana → romaji con variantes aceptadas
src/data/words.ts        lista curada de palabras en hiragana { kana, es }
src/data/katakanaWords.ts vocabulario curado que se escribe normalmente en katakana
src/data/sentences.ts    oraciones avanzadas con romaji explícito; tipo PracticeKind (kana | words | sentences)
src/data/translations.ts significados en inglés, francés y alemán, indexados por el texto en español
src/data/translationsPtIt.ts significados en portugués (Brasil) e italiano, con la misma clave
src/data/achievements.ts definición de logros (métrica, meta y título en los seis idiomas)
src/lib/kana.ts          tokenize, toRomaji, matchesRomaji, normalizeHiragana, isEligible, checkAnswer
src/lib/letters.ts       letras sueltas de las filas activas como ítems de práctica
src/lib/session.ts       arma rondas sin repetidos y prioriza ítems que necesitan repaso; countMastered
src/lib/storage.ts       localStorage (filas, modo, stats por ítem, racha, historial), siempre con try/catch
src/lib/insights.ts      estadísticas derivadas: totales, aciertos por modo, letras y palabras difíciles
src/lib/achievements.ts  métricas, evaluación y persistencia de logros
src/lib/speech.ts        pronunciación con speechSynthesis (voz japonesa del sistema)
src/lib/reminders.ts     recordatorio diario con @capacitor/local-notifications (solo app nativa)
src/lib/studyTime.ts     tiempo de estudio: registros por día, cronómetro, meta, totales y racha de metas
src/lib/studyCategories.ts categorías de estudio (práctica, fijas y personalizadas) y formato de duraciones
src/i18n.tsx             textos de la interfaz en es/en/pt/fr/de/it
src/components/          pantallas y piezas de UI (Practice, Results, StatsScreen, AchievementsScreen,
                         StudyArea con tiempo de estudio, cronómetro, carga e historial…)
src/App.tsx              estado global: pantalla, filas, modo, ronda, stats, historial y logros
```

## Convenciones

- El romaji nunca se guarda en datos: se genera desde el kana con `toRomaji`. Una sola fuente de verdad.
- Toda validación de respuestas pasa por `checkAnswer`. Acepta variantes (shi/si, tsu/tu, nn para ん, etc.).
- Las palabras de `words.ts` son hiragana puro. Hay un test que lo verifica; no lo desactives.
- Mobile-first: gutter de 16px, tipografía grande para kana, sin scroll horizontal, `viewport-fit=cover`.
- Textos de la interfaz en español rioplatense (vos), sin mayúsculas innecesarias.
- No agregar dependencias sin anotarlo en `docs/DECISIONS.md`.

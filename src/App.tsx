import { useEffect, useMemo, useState } from 'react';
import { RowPicker } from './components/RowPicker';
import { ModeCards } from './components/ModeCards';
import { WORDS } from './data/words';
import { isEligible, type PracticeMode } from './lib/kana';
import { loadSettings, saveSettings } from './lib/storage';

const MIN_WORDS_TO_START = 3;

type Screen = 'setup' | 'practice' | 'results';

export function App() {
  const initial = useMemo(loadSettings, []);
  const [screen, setScreen] = useState<Screen>('setup');
  const [enabledRowIds, setEnabledRowIds] = useState<string[]>(initial.enabledRowIds);
  const [mode, setMode] = useState<PracticeMode>(initial.mode);

  useEffect(() => {
    saveSettings({ enabledRowIds, mode });
  }, [enabledRowIds, mode]);

  const enabledSet = useMemo(() => new Set(enabledRowIds), [enabledRowIds]);

  const eligibleWords = useMemo(
    () => WORDS.filter((w) => isEligible(w.kana, enabledSet)),
    [enabledSet],
  );

  const exampleWord = eligibleWords.length > 0 ? eligibleWords[Math.floor(eligibleWords.length / 2)] : null;

  function toggleRow(rowId: string) {
    setEnabledRowIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId],
    );
  }

  const canStart = eligibleWords.length >= MIN_WORDS_TO_START;

  if (screen === 'practice' || screen === 'results') {
    // Se completa en la próxima etapa (Práctica y resultados).
    return (
      <main className="app">
        <h1>WordGana</h1>
        <p>Ronda en construcción — se termina en la próxima etapa.</p>
        <button type="button" className="primary-btn" onClick={() => setScreen('setup')}>
          Volver a filas
        </button>
      </main>
    );
  }

  return (
    <main className="app">
      <h1>WordGana</h1>
      <p className="tagline">Practicá hiragana con palabras reales, fila por fila.</p>

      <RowPicker
        enabledRowIds={enabledSet}
        onToggle={toggleRow}
        onSetAll={setEnabledRowIds}
        eligibleCount={eligibleWords.length}
      />

      <ModeCards mode={mode} onSelect={setMode} example={exampleWord} />

      <button
        type="button"
        className="primary-btn"
        disabled={!canStart}
        onClick={() => setScreen('practice')}
      >
        Empezar ronda
      </button>
      {!canStart && (
        <p className="hint hint--center">
          Activá más filas: hacen falta al menos {MIN_WORDS_TO_START} palabras disponibles.
        </p>
      )}
    </main>
  );
}

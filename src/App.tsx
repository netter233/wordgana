import { useEffect, useMemo, useState } from 'react';
import { RowPicker } from './components/RowPicker';
import { ModeCards } from './components/ModeCards';
import { Practice } from './components/Practice';
import { Results } from './components/Results';
import { TopBar } from './components/TopBar';
import { WORDS, type Word } from './data/words';
import { isEligible, type PracticeMode } from './lib/kana';
import { pickRound } from './lib/session';
import { loadSettings, saveSettings, loadStats, saveStats, recordAnswer, type StatsMap } from './lib/storage';

const MIN_WORDS_TO_START = 3;
const ROUND_SIZE = 10;

type Screen = 'setup' | 'practice' | 'results';

interface RoundSummary {
  correctCount: number;
  missed: Word[];
}

export function App() {
  const initial = useMemo(loadSettings, []);
  const [screen, setScreen] = useState<Screen>('setup');
  const [enabledRowIds, setEnabledRowIds] = useState<string[]>(initial.enabledRowIds);
  const [mode, setMode] = useState<PracticeMode>(initial.mode);
  const [stats, setStats] = useState<StatsMap>(loadStats);
  const [round, setRound] = useState<Word[]>([]);
  const [summary, setSummary] = useState<RoundSummary | null>(null);

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

  function startRound() {
    setRound(pickRound(eligibleWords, ROUND_SIZE, stats));
    setSummary(null);
    setScreen('practice');
  }

  function handleAnswer(word: Word, correct: boolean) {
    setStats((prev) => {
      const next = recordAnswer(prev, word.kana, correct);
      saveStats(next);
      return next;
    });
  }

  function handleFinish(roundSummary: RoundSummary) {
    setSummary(roundSummary);
    setScreen('results');
  }

  const canStart = eligibleWords.length >= MIN_WORDS_TO_START;

  if (screen === 'practice') {
    return (
      <main className="app">
        <TopBar title="Ronda de práctica" onClose={() => setScreen('setup')} />
        <Practice words={round} mode={mode} onAnswer={handleAnswer} onFinish={handleFinish} />
      </main>
    );
  }

  if (screen === 'results' && summary) {
    return (
      <main className="app">
        <TopBar title="Resultado" onClose={() => setScreen('setup')} />
        <Results
          total={round.length}
          correctCount={summary.correctCount}
          missed={summary.missed}
          onRestartSameRound={startRound}
          onChangeRows={() => setScreen('setup')}
        />
      </main>
    );
  }

  return (
    <main className="app app--setup">
      <TopBar title="WordGana" />
      <p className="tagline">Practicá hiragana con palabras reales, fila por fila.</p>

      <RowPicker
        enabledRowIds={enabledSet}
        onToggle={toggleRow}
        onSetAll={setEnabledRowIds}
        eligibleCount={eligibleWords.length}
      />

      <ModeCards mode={mode} onSelect={setMode} example={exampleWord} />

      <div className="cta-bar">
        <button type="button" className="primary-btn" disabled={!canStart} onClick={startRound}>
          Empezar ronda
        </button>
        {!canStart && (
          <p className="hint hint--center">
            Activá más filas: hacen falta al menos {MIN_WORDS_TO_START} palabras disponibles.
          </p>
        )}
      </div>
    </main>
  );
}

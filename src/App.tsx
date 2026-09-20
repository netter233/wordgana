import { useEffect, useMemo, useState } from 'react';
import { ContentCards } from './components/ContentCards';
import { LanguagePicker } from './components/LanguagePicker';
import { ModeCards } from './components/ModeCards';
import { Practice } from './components/Practice';
import { Results } from './components/Results';
import { RowPicker } from './components/RowPicker';
import { ScriptSwitch } from './components/ScriptSwitch';
import { StatsStrip } from './components/StatsStrip';
import { TopBar } from './components/TopBar';
import { KATAKANA_WORDS } from './data/katakanaWords';
import { rowsForScript, type KanaScript } from './data/kana';
import { sentencesForScript, type PracticeKind } from './data/sentences';
import { WORDS, type Word } from './data/words';
import { isEligible, type PracticeMode } from './lib/kana';
import { useI18n } from './i18n';
import { countMastered, pickRound } from './lib/session';
import {
  loadProgress,
  loadSettings,
  loadStats,
  recordAnswer,
  recordRound,
  saveProgress,
  saveSettings,
  saveStats,
  type StatsMap,
} from './lib/storage';

const MIN_WORDS_TO_START = 3;
const WORD_ROUND_SIZE = 10;
const SENTENCE_ROUND_SIZE = 5;

type Screen = 'setup' | 'practice' | 'results' | 'settings';

interface RoundSummary {
  correctCount: number;
  missed: Word[];
}

export function App() {
  const { messages } = useI18n();
  const initial = useMemo(loadSettings, []);
  const [screen, setScreen] = useState<Screen>('setup');
  const [activeScript, setActiveScript] = useState<KanaScript>(initial.activeScript);
  const [enabledRows, setEnabledRows] = useState(initial.enabledRowIds);
  const [modes, setModes] = useState(initial.mode);
  const [practiceKinds, setPracticeKinds] = useState(initial.practiceKind);
  const [stats, setStats] = useState<StatsMap>(loadStats);
  const [progress, setProgress] = useState(loadProgress);
  const [round, setRound] = useState<Word[]>([]);
  const [summary, setSummary] = useState<RoundSummary | null>(null);
  const [rowsExpanded, setRowsExpanded] = useState<Record<KanaScript, boolean>>({
    hiragana: initial.enabledRowIds.hiragana.length <= 1,
    katakana: initial.enabledRowIds.katakana.length <= 1,
  });

  const rows = rowsForScript(activeScript);
  const enabledRowIds = enabledRows[activeScript];
  const enabledSet = useMemo(() => new Set(enabledRowIds), [enabledRowIds]);
  const allRowsSelected = rows.every((row) => enabledSet.has(row.id));
  const missingRows = rows.filter((row) => !enabledSet.has(row.id)).length;
  const mode = modes[activeScript];
  const practiceKind = practiceKinds[activeScript];

  useEffect(() => {
    saveSettings({
      activeScript,
      enabledRowIds: enabledRows,
      mode: modes,
      practiceKind: practiceKinds,
    });
  }, [activeScript, enabledRows, modes, practiceKinds]);

  useEffect(() => {
    if (practiceKinds[activeScript] === 'sentences' && !allRowsSelected) {
      setPracticeKinds((previous) => ({ ...previous, [activeScript]: 'words' }));
    }
  }, [activeScript, allRowsSelected, practiceKinds]);

  const eligibleWords = useMemo(() => {
    const words = activeScript === 'hiragana' ? WORDS : KATAKANA_WORDS;
    return words.filter((word) => isEligible(word.kana, enabledSet));
  }, [activeScript, enabledSet]);

  const eligibleItems = practiceKind === 'sentences' && allRowsSelected
    ? sentencesForScript(activeScript)
    : eligibleWords;
  const example = eligibleItems.length > 0 ? eligibleItems[Math.floor(eligibleItems.length / 2)] : null;
  const statKey = (item: Word) => `${activeScript}:${practiceKind}:${mode}:${item.kana}`;

  function toggleRow(rowId: string) {
    setEnabledRows((previous) => {
      const current = previous[activeScript];
      const next = current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...current, rowId];
      return { ...previous, [activeScript]: next };
    });
  }

  function setAllRows(rowIds: string[]) {
    setEnabledRows((previous) => ({ ...previous, [activeScript]: rowIds }));
  }

  function setMode(modeValue: PracticeMode) {
    setModes((previous) => ({ ...previous, [activeScript]: modeValue }));
  }

  function setPracticeKind(kind: PracticeKind) {
    if (kind === 'sentences' && !allRowsSelected) return;
    setPracticeKinds((previous) => ({ ...previous, [activeScript]: kind }));
  }

  function startRound() {
    const size = practiceKind === 'sentences' ? SENTENCE_ROUND_SIZE : WORD_ROUND_SIZE;
    setRound(pickRound(eligibleItems, size, stats));
    setSummary(null);
    setScreen('practice');
  }

  function reviewMissed() {
    if (!summary || summary.missed.length === 0) return;
    setRound(summary.missed);
    setSummary(null);
    setScreen('practice');
  }

  function handleAnswer(item: Word, correct: boolean) {
    setStats((previous) => {
      const next = recordAnswer(previous, statKey(item), correct);
      saveStats(next);
      return next;
    });
  }

  function handleFinish(roundSummary: RoundSummary) {
    setProgress((previous) => {
      const next = recordRound(previous);
      saveProgress(next);
      return next;
    });
    setSummary(roundSummary);
    setScreen('results');
  }

  const minimum = practiceKind === 'sentences' ? 1 : MIN_WORDS_TO_START;
  const canStart = eligibleItems.length >= minimum;
  const nextRoundCount = Math.min(
    practiceKind === 'sentences' ? SENTENCE_ROUND_SIZE : WORD_ROUND_SIZE,
    eligibleItems.length,
  );
  const scriptName = activeScript === 'hiragana' ? 'Hiragana' : 'Katakana';
  const kindName = practiceKind === 'words' ? messages.words : messages.sentences;
  const mark = activeScript === 'hiragana' ? 'あ' : 'ア';

  if (screen === 'practice') {
    return (
      <main className="app">
        <TopBar title={`${kindName} · ${scriptName}`} mark={mark} onClose={() => setScreen('setup')} />
        <Practice
          words={round}
          mode={mode}
          script={activeScript}
          practiceKind={practiceKind}
          onAnswer={handleAnswer}
          onFinish={handleFinish}
        />
      </main>
    );
  }

  if (screen === 'results' && summary) {
    return (
      <main className="app">
        <TopBar title={messages.result} mark={mark} onClose={() => setScreen('setup')} />
        <Results
          total={round.length}
          correctCount={summary.correctCount}
          missed={summary.missed}
          onRestartSameRound={startRound}
          onReviewMissed={reviewMissed}
          onChangeRows={() => setScreen('setup')}
        />
      </main>
    );
  }

  if (screen === 'settings') {
    return (
      <main className="app">
        <TopBar title={messages.settings} mark={mark} onClose={() => setScreen('setup')} />
        <LanguagePicker />
      </main>
    );
  }

  return (
    <main className="app app--setup">
      <TopBar title="WordGana" mark={mark} onSettings={() => setScreen('settings')} />
      <p className="tagline">{messages.tagline}</p>

      <ScriptSwitch value={activeScript} onChange={setActiveScript} />

      <RowPicker
        rows={rows}
        enabledRowIds={enabledSet}
        onToggle={toggleRow}
        onSetAll={setAllRows}
        eligibleCount={eligibleWords.length}
        script={activeScript}
        expanded={rowsExpanded[activeScript]}
        onToggleExpanded={() => setRowsExpanded((previous) => ({
          ...previous,
          [activeScript]: !previous[activeScript],
        }))}
      />

      <ContentCards
        value={practiceKind}
        unlocked={allRowsSelected}
        missingRows={missingRows}
        script={activeScript}
        onChange={setPracticeKind}
      />
      {activeScript === 'katakana' && practiceKind === 'sentences' && (
        <p className="advanced-assumption">
          {messages.katakanaSentenceNote}
        </p>
      )}
      <ModeCards
        mode={mode}
        onSelect={setMode}
        example={example}
        script={activeScript}
        practiceKind={practiceKind}
      />

      <StatsStrip
        streak={progress.streak}
        roundsToday={progress.roundsToday}
        mastered={countMastered(eligibleItems, stats, statKey)}
        total={eligibleItems.length}
        itemLabel={practiceKind === 'words' ? messages.words : messages.sentences}
      />

      <div className="cta-bar">
        <button type="button" className="primary-btn" disabled={!canStart} onClick={startRound}>
          {!canStart
            ? messages.chooseMoreRows
            : practiceKind === 'sentences'
              ? messages.practiceItems(nextRoundCount, 'sentences')
              : messages.practiceItems(nextRoundCount, 'words')}
        </button>
        {!canStart && (
          <p className="hint hint--center">
            {messages.minimumHint(MIN_WORDS_TO_START)}
          </p>
        )}
      </div>
    </main>
  );
}

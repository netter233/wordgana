import { useEffect, useMemo, useState } from 'react';
import { ContentCards } from './components/ContentCards';
import { AudioSettings } from './components/AudioSettings';
import { LanguagePicker } from './components/LanguagePicker';
import { ModeCards } from './components/ModeCards';
import { ReminderSettings } from './components/ReminderSettings';
import { Practice } from './components/Practice';
import { Results } from './components/Results';
import { RowPicker } from './components/RowPicker';
import { ScriptSwitch } from './components/ScriptSwitch';
import { StatsScreen } from './components/StatsScreen';
import { StatsStrip } from './components/StatsStrip';
import { TopBar } from './components/TopBar';
import { KATAKANA_WORDS } from './data/katakanaWords';
import { rowsForScript, type KanaScript } from './data/kana';
import { sentencesForScript, type PracticeKind } from './data/sentences';
import { WORDS, type Word } from './data/words';
import { isEligible, type PracticeMode } from './lib/kana';
import { useI18n } from './i18n';
import { letterItems } from './lib/letters';
import { loadReminder, syncReminders, type ReminderTexts } from './lib/reminders';
import { countMastered, pickRound } from './lib/session';
import {
  dayKey,
  loadLifetime,
  loadProgress,
  loadSettings,
  loadStats,
  recordAnswer,
  recordLifetimeRound,
  recordRound,
  saveLifetime,
  saveProgress,
  saveSettings,
  saveStats,
  type StatsMap,
} from './lib/storage';

const MIN_WORDS_TO_START = 3;
const WORD_ROUND_SIZE = 10;
const SENTENCE_ROUND_SIZE = 5;

type Screen = 'setup' | 'practice' | 'results' | 'settings' | 'stats';

interface RoundSummary {
  correctCount: number;
  missed: Word[];
}

export function App() {
  const { language, messages } = useI18n();
  const initial = useMemo(loadSettings, []);
  const [screen, setScreen] = useState<Screen>('setup');
  const [activeScript, setActiveScript] = useState<KanaScript>(initial.activeScript);
  const [enabledRows, setEnabledRows] = useState(initial.enabledRowIds);
  const [modes, setModes] = useState(initial.mode);
  const [practiceKinds, setPracticeKinds] = useState(initial.practiceKind);
  const [stats, setStats] = useState<StatsMap>(loadStats);
  const [progress, setProgress] = useState(loadProgress);
  const [lifetime, setLifetime] = useState(loadLifetime);
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

  const practicedToday = progress.lastDay === dayKey(new Date());
  const reminderTexts: ReminderTexts = {
    title: 'WordGana',
    first: progress.streak > 0 ? messages.notificationStreak(progress.streak) : messages.notificationGeneric,
    later: messages.notificationGeneric,
  };

  useEffect(() => {
    // Reprograma los avisos al abrir la app y cada vez que cambia si ya practicaste hoy.
    void syncReminders(loadReminder(), practicedToday, reminderTexts);
  }, [practicedToday, progress.streak, language]);

  const eligibleWords = useMemo(() => {
    const words = activeScript === 'hiragana' ? WORDS : KATAKANA_WORDS;
    return words.filter((word) => isEligible(word.kana, enabledSet));
  }, [activeScript, enabledSet]);

  const eligibleLetters = useMemo(() => letterItems(rows, enabledSet), [rows, enabledSet]);

  const eligibleItems = practiceKind === 'sentences' && allRowsSelected
    ? sentencesForScript(activeScript)
    : practiceKind === 'kana'
      ? eligibleLetters
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
    const nextProgress = recordRound(progress);
    setProgress(nextProgress);
    saveProgress(nextProgress);
    const nextLifetime = recordLifetimeRound(lifetime, {
      script: activeScript,
      kind: practiceKind,
      mode,
      total: round.length,
      correct: roundSummary.correctCount,
      streak: nextProgress.streak,
    });
    setLifetime(nextLifetime);
    saveLifetime(nextLifetime);
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
  const kindNames: Record<PracticeKind, string> = {
    kana: messages.letters,
    words: messages.words,
    sentences: messages.sentences,
  };
  const kindName = kindNames[practiceKind];
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

  if (screen === 'stats') {
    return (
      <main className="app">
        <TopBar title={messages.statsTitle} mark={mark} onBack={() => setScreen('setup')} />
        <StatsScreen
          stats={stats}
          lifetime={lifetime}
          currentStreak={progress.streak}
          initialScript={activeScript}
        />
      </main>
    );
  }

  if (screen === 'settings') {
    return (
      <main className="app">
        <TopBar title={messages.settings} mark={mark} onBack={() => setScreen('setup')} />
        <LanguagePicker />
        <AudioSettings />
        <ReminderSettings practicedToday={practicedToday} texts={reminderTexts} />
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
        links={[{ icon: '📊', label: messages.statsTitle, onClick: () => setScreen('stats') }]}
        streak={progress.streak}
        roundsToday={progress.roundsToday}
        mastered={countMastered(eligibleItems, stats, statKey)}
        total={eligibleItems.length}
        itemLabel={kindName}
      />

      <div className="cta-bar">
        <button type="button" className="primary-btn" disabled={!canStart} onClick={startRound}>
          {canStart ? messages.practiceItems(nextRoundCount, practiceKind) : messages.chooseMoreRows}
        </button>
        {!canStart && (
          <p className="hint hint--center">
            {messages.minimumHint(MIN_WORDS_TO_START, practiceKind)}
          </p>
        )}
      </div>
    </main>
  );
}

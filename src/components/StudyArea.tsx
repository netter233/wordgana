import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import {
  addCustomCategory,
  removeCustomCategory,
  renameCustomCategory,
  type CustomCategory,
} from '../lib/studyCategories';
import { dayKey } from '../lib/storage';
import {
  LONG_TIMER_SECONDS,
  addEntry,
  timerElapsed,
  type EntryInput,
  type RunningTimer,
  type StudyEntry,
} from '../lib/studyTime';
import { CategoryPicker } from './CategoryPicker';
import { StudyCategoriesScreen } from './StudyCategoriesScreen';
import { StudyEntryForm } from './StudyEntryForm';
import { StudyTimeScreen } from './StudyTimeScreen';
import { TimerBanner } from './TimerBanner';
import { TopBar } from './TopBar';

export type StudyView = 'overview' | 'add' | 'timer-start' | 'timer-stop' | 'categories';

interface StudyAreaProps {
  initialView: StudyView;
  entries: StudyEntry[];
  onEntriesChange: (entries: StudyEntry[]) => void;
  goalMinutes: number;
  customCategories: CustomCategory[];
  onCustomCategoriesChange: (categories: CustomCategory[]) => void;
  timer: RunningTimer | null;
  onTimerChange: (timer: RunningTimer | null) => void;
  /** Celebración de logros recién desbloqueados al guardar tiempo (etapa de logros). */
  celebration?: ReactNode;
  mark: string;
  onExit: () => void;
}

/** Pantallas de tiempo de estudio: resumen, carga manual, cronómetro y categorías. */
export function StudyArea({
  initialView,
  entries,
  onEntriesChange,
  goalMinutes,
  customCategories,
  onCustomCategoriesChange,
  timer,
  onTimerChange,
  celebration,
  mark,
  onExit,
}: StudyAreaProps) {
  const { messages } = useI18n();
  const [requestedView, setView] = useState<StudyView>(initialView);
  // Sin cronómetro en marcha no hay nada que detener.
  const view: StudyView = requestedView === 'timer-stop' && !timer ? 'overview' : requestedView;
  const [timerCategory, setTimerCategory] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  function createCategory(name: string, icon: string): string {
    const next = addCustomCategory(customCategories, name, icon);
    onCustomCategoriesChange(next);
    return next[next.length - 1]?.id ?? '';
  }

  function saveEntry(input: EntryInput, source: 'manual' | 'timer') {
    onEntriesChange(addEntry(entries, input, source));
    if (source === 'timer') onTimerChange(null);
    setView('overview');
  }

  const back = () => (view === 'overview' ? onExit() : setView('overview'));
  const titles: Record<StudyView, string> = {
    overview: messages.studyTimeTitle,
    add: messages.addTimeTitle,
    'timer-start': messages.startTimer,
    'timer-stop': messages.stopTimerTitle,
    categories: messages.categoriesTitle,
  };

  let content: ReactNode;
  if (view === 'add') {
    content = (
      <StudyEntryForm
        initial={{ categoryId: '', day: dayKey(new Date()), minutes: 30 }}
        customCategories={customCategories}
        onCreateCategory={createCategory}
        onSave={(input) => saveEntry(input, 'manual')}
      />
    );
  } else if (view === 'timer-start') {
    content = (
      <>
        <section className="card">
          <h2>{messages.chooseCategory}</h2>
          <CategoryPicker
            value={timerCategory}
            onChange={setTimerCategory}
            customCategories={customCategories}
            onCreateCategory={createCategory}
          />
          <p className="hint">{messages.timerPausesAuto}</p>
        </section>
        <div className="cta-bar">
          <button
            type="button"
            className="primary-btn"
            disabled={!timerCategory}
            onClick={() => {
              onTimerChange({ categoryId: timerCategory, startedAt: new Date().toISOString() });
              setView('overview');
            }}
          >
            {messages.startTimerAction}
          </button>
        </div>
      </>
    );
  } else if (view === 'timer-stop' && timer) {
    const elapsed = timerElapsed(timer);
    content = (
      <StudyEntryForm
        initial={{
          categoryId: timer.categoryId,
          day: dayKey(new Date(timer.startedAt)),
          minutes: Math.min(720, Math.max(1, Math.round(elapsed / 60))),
        }}
        customCategories={customCategories}
        onCreateCategory={createCategory}
        warning={elapsed > LONG_TIMER_SECONDS ? messages.longTimerWarning : undefined}
        onSave={(input) => saveEntry(input, 'timer')}
        extraActions={(
          <button
            type="button"
            className="reveal-btn"
            onClick={() => {
              onTimerChange(null);
              setView('overview');
            }}
          >
            {messages.discardTimer}
          </button>
        )}
      />
    );
  } else if (view === 'categories') {
    const used = new Set(entries.map((entry) => entry.categoryId));
    content = (
      <StudyCategoriesScreen
        customCategories={customCategories}
        onCreate={(name, icon) => onCustomCategoriesChange(addCustomCategory(customCategories, name, icon))}
        onRename={(id, name) => onCustomCategoriesChange(renameCustomCategory(customCategories, id, name))}
        onRemove={(id) => onCustomCategoriesChange(removeCustomCategory(customCategories, id, used))}
      />
    );
  } else {
    content = (
      <StudyTimeScreen
        entries={entries}
        goalMinutes={goalMinutes}
        customCategories={customCategories}
        header={(
          <>
            {celebration}
            {timer && (
              <TimerBanner timer={timer} customCategories={customCategories} onStop={() => setView('timer-stop')} />
            )}
          </>
        )}
        actions={(
          <div className="study-actions">
            {!timer && (
              <button type="button" className="secondary-btn" onClick={() => setView('timer-start')}>
                ⏱️ {messages.timerShort}
              </button>
            )}
            <button type="button" className="secondary-btn" onClick={() => setView('add')}>
              ＋ {messages.addTime}
            </button>
          </div>
        )}
        footer={(
          <div className="nav-list">
            <button type="button" className="nav-row" onClick={() => setView('categories')}>
              <span className="nav-row-icon" aria-hidden="true">🏷️</span>
              <span className="nav-row-label">{messages.categoriesTitle}</span>
              <Chevron />
            </button>
          </div>
        )}
      />
    );
  }

  return (
    <main className={view === 'overview' || view === 'categories' ? 'app' : 'app app--setup'}>
      <TopBar title={titles[view]} mark={mark} onBack={back} />
      {content}
    </main>
  );
}

export function Chevron() {
  return (
    <svg
      className="nav-row-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

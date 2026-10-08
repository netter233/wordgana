import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import {
  addCustomCategory,
  categoryInfo,
  formatDuration,
  removeCustomCategory,
  renameCustomCategory,
  type CustomCategory,
} from '../lib/studyCategories';
import { dayKey } from '../lib/storage';
import {
  LONG_TIMER_SECONDS,
  addEntry,
  deleteEntry,
  updateEntry,
  timerElapsed,
  type EntryInput,
  type RunningTimer,
  type StudyEntry,
} from '../lib/studyTime';
import { CategoryPicker } from './CategoryPicker';
import { Chevron } from './Chevron';
import { StudyCategoriesScreen } from './StudyCategoriesScreen';
import { StudyEntryForm } from './StudyEntryForm';
import { StudyHistory } from './StudyHistory';
import { StudyTimeScreen } from './StudyTimeScreen';
import { TimerBanner } from './TimerBanner';
import { TopBar } from './TopBar';

export type StudyView = 'overview' | 'add' | 'timer-start' | 'timer-stop' | 'categories' | 'history' | 'edit';

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
  const [timerCategory, setTimerCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = entries.find((entry) => entry.id === editingId && entry.source !== 'auto') ?? null;
  // Sin cronómetro en marcha no hay nada que detener, y sin registro elegido no hay nada que editar.
  const view: StudyView = requestedView === 'timer-stop' && !timer ? 'overview'
    : requestedView === 'edit' && !editing ? 'history'
    : requestedView;

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

  const back = () => {
    if (view === 'overview') onExit();
    else setView(view === 'edit' ? 'history' : 'overview');
  };
  const titles: Record<StudyView, string> = {
    overview: messages.studyTimeTitle,
    add: messages.addTimeTitle,
    'timer-start': messages.startTimer,
    'timer-stop': messages.stopTimerTitle,
    categories: messages.categoriesTitle,
    history: messages.historyTitle,
    edit: messages.editEntryTitle,
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
  } else if (view === 'history') {
    content = (
      <StudyHistory
        entries={entries}
        customCategories={customCategories}
        onEdit={(entry) => {
          setEditingId(entry.id);
          setView('edit');
        }}
        onDelete={(entry) => onEntriesChange(deleteEntry(entries, entry.id))}
        onAdd={() => setView('add')}
      />
    );
  } else if (view === 'edit' && editing) {
    const info = categoryInfo(editing.categoryId, messages, customCategories);
    const duration = formatDuration(editing.seconds, messages);
    content = (
      <StudyEntryForm
        key={editing.id}
        initial={{
          categoryId: editing.categoryId,
          day: editing.day,
          minutes: Math.round(editing.seconds / 60),
          note: editing.note,
        }}
        customCategories={customCategories}
        onCreateCategory={createCategory}
        onSave={(input) => {
          onEntriesChange(updateEntry(entries, editing.id, input));
          setView('history');
        }}
        extraActions={(
          <button
            type="button"
            className="reveal-btn reveal-btn--danger"
            onClick={() => {
              if (!window.confirm(messages.confirmDeleteEntry(info.label, duration))) return;
              onEntriesChange(deleteEntry(entries, editing.id));
              setView('history');
            }}
          >
            {messages.deleteEntry}
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
            <button type="button" className="nav-row" onClick={() => setView('history')}>
              <span className="nav-row-icon" aria-hidden="true">🗓️</span>
              <span className="nav-row-label">{messages.historyTitle}</span>
              <Chevron />
            </button>
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
    <main className={['overview', 'categories', 'history'].includes(view) ? 'app' : 'app app--setup'}>
      <TopBar title={titles[view]} mark={mark} onBack={back} />
      {content}
    </main>
  );
}

import { useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import type { CustomCategory } from '../lib/studyCategories';
import { dayKey } from '../lib/storage';
import { validateEntry, type EntryError, type EntryInput } from '../lib/studyTime';
import { CategoryPicker } from './CategoryPicker';

interface StudyEntryFormProps {
  initial: EntryInput;
  customCategories: CustomCategory[];
  onCreateCategory: (name: string, icon: string) => string;
  onSave: (input: EntryInput) => void;
  /** Aviso arriba del formulario (por ejemplo, un cronómetro que quedó andando horas). */
  warning?: string;
  /** Acciones secundarias debajo de Guardar (descartar cronómetro, borrar registro). */
  extraActions?: ReactNode;
}

const PRESETS = [15, 30, 45, 60];

type DayChoice = 'today' | 'yesterday' | 'other';

function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return dayKey(date);
}

export function StudyEntryForm({ initial, customCategories, onCreateCategory, onSave, warning, extraActions }: StudyEntryFormProps) {
  const { messages } = useI18n();
  const today = dayKey(new Date());
  const yesterday = yesterdayKey();
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [minutes, setMinutes] = useState(String(initial.minutes || ''));
  const [day, setDay] = useState(initial.day);
  const [dayChoice, setDayChoice] = useState<DayChoice>(
    initial.day === today ? 'today' : initial.day === yesterday ? 'yesterday' : 'other',
  );
  const [note, setNote] = useState(initial.note ?? '');
  const [error, setError] = useState<EntryError | null>(null);

  const errorText: Record<EntryError, string> = {
    duration: messages.invalidDuration,
    day: messages.invalidDay,
    category: messages.invalidCategory,
  };

  function chooseDay(choice: DayChoice) {
    setDayChoice(choice);
    if (choice === 'today') setDay(today);
    if (choice === 'yesterday') setDay(yesterday);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const input = { categoryId, day, minutes: Number(minutes), note };
    const problem = validateEntry(input);
    setError(problem);
    if (!problem) onSave(input);
  }

  return (
    <form onSubmit={submit} noValidate>
      {warning && <p className="settings-warning form-warning">{warning}</p>}

      <section className="card">
        <h2>{messages.categoryLabel}</h2>
        <CategoryPicker
          value={categoryId}
          onChange={setCategoryId}
          customCategories={customCategories}
          onCreateCategory={onCreateCategory}
        />
      </section>

      <section className="card">
        <h2 id="duration-label">{messages.durationLabel}</h2>
        <div className="preset-row">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={Number(minutes) === preset ? 'preset-chip preset-chip--selected' : 'preset-chip'}
              aria-pressed={Number(minutes) === preset}
              onClick={() => setMinutes(String(preset))}
            >
              {messages.durationM(preset)}
            </button>
          ))}
        </div>
        <label className="minutes-field">
          <input
            className="text-input minutes-input"
            type="number"
            inputMode="numeric"
            min={1}
            max={720}
            value={minutes}
            aria-labelledby="duration-label"
            onChange={(event) => setMinutes(event.target.value)}
          />
          <span>{messages.minutesUnit}</span>
        </label>
      </section>

      <section className="card">
        <h2>{messages.dayLabel}</h2>
        <div className="preset-row">
          {([['today', messages.today], ['yesterday', messages.yesterday], ['other', messages.otherDay]] as const).map(([choice, label]) => (
            <button
              key={choice}
              type="button"
              className={dayChoice === choice ? 'preset-chip preset-chip--selected' : 'preset-chip'}
              aria-pressed={dayChoice === choice}
              onClick={() => chooseDay(choice)}
            >
              {label}
            </button>
          ))}
        </div>
        {dayChoice === 'other' && (
          <input
            className="text-input date-input"
            type="date"
            max={today}
            value={day}
            aria-label={messages.dayLabel}
            onChange={(event) => setDay(event.target.value)}
          />
        )}
      </section>

      <section className="card">
        <label className="field">
          <span className="field-label field-label--title">{messages.noteLabel}</span>
          <input
            className="text-input"
            value={note}
            maxLength={120}
            placeholder={messages.notePlaceholder}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
      </section>

      <div className="cta-bar">
        {error && <p className="form-error" role="alert">{errorText[error]}</p>}
        <button type="submit" className="primary-btn">{messages.save}</button>
        {extraActions}
      </div>
    </form>
  );
}

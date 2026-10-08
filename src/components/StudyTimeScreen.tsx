import { useMemo, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { categoryInfo, chartSeriesFor, formatDuration, type CustomCategory } from '../lib/studyCategories';
import { dayKey } from '../lib/storage';
import {
  breakdownByDay,
  goalStreak,
  rangeStart,
  secondsOnDay,
  totalSeconds,
  totalsByCategory,
  totalsByDay,
  type StudyEntry,
} from '../lib/studyTime';
import { DayChart } from './DayChart';

interface StudyTimeScreenProps {
  entries: StudyEntry[];
  goalMinutes: number;
  customCategories: CustomCategory[];
  /** Contenido extra arriba de todo (cronómetro, logros recién desbloqueados). */
  header?: ReactNode;
  /** Acciones de la tarjeta de hoy (iniciar cronómetro, agregar tiempo). */
  actions?: ReactNode;
  /** Filas de navegación al final (historial, categorías). */
  footer?: ReactNode;
}

type ChartRange = 7 | 28;
type CategoryRange = 'week' | 'all';

export function StudyTimeScreen({ entries, goalMinutes, customCategories, header, actions, footer }: StudyTimeScreenProps) {
  const { messages } = useI18n();
  const [chartRange, setChartRange] = useState<ChartRange>(7);
  const [categoryRange, setCategoryRange] = useState<CategoryRange>('week');
  const today = dayKey(new Date());
  const todaySeconds = secondsOnDay(entries, today);
  const todayMinutes = Math.floor(todaySeconds / 60);
  const days = useMemo(() => breakdownByDay(entries, chartRange, chartSeriesFor), [entries, chartRange]);
  const week = useMemo(() => totalsByDay(entries, 7), [entries]);
  const weekSeconds = week.reduce((sum, day) => sum + day.seconds, 0);
  const categories = useMemo(
    () => totalsByCategory(entries, categoryRange === 'week' ? rangeStart(7) : null),
    [entries, categoryRange],
  );
  const maxCategory = categories[0]?.seconds ?? 0;
  const streak = goalStreak(entries, goalMinutes);
  const goalPercent = goalMinutes > 0 ? Math.min(100, (todaySeconds / (goalMinutes * 60)) * 100) : 0;
  const goalMet = goalMinutes > 0 && todaySeconds >= goalMinutes * 60;

  return (
    <section>
      {header}

      <div className="card study-today">
        <p className="stat-label">{messages.today}</p>
        <p className="study-today-value">{formatDuration(todaySeconds, messages)}</p>
        {goalMinutes > 0 ? (
          <>
            <div className="progress-row">
              <span className={goalMet ? 'study-goal-status study-goal-status--met' : 'study-goal-status'}>
                {goalMet ? `✓ ${messages.goalReached}` : messages.goalRemaining(goalMinutes - todayMinutes)}
              </span>
              <span>{messages.goalProgress(Math.min(todayMinutes, 999), goalMinutes)}</span>
            </div>
            <div className="progress-track progress-track--compact study-goal-track">
              <div className="progress-fill" style={{ width: `${goalPercent}%` }} />
            </div>
            <p className="hint">🎯 {messages.goalStreakLabel}: {messages.days(streak)}</p>
          </>
        ) : (
          <p className="hint">{messages.noGoalHint}</p>
        )}
        {actions}
      </div>

      <div className="card">
        <div className="section-head">
          <h2>{messages.lastDaysTitle}</h2>
          <Segmented
            value={chartRange}
            options={[[7, messages.range7], [28, messages.range28]]}
            onChange={setChartRange}
          />
        </div>
        <DayChart key={chartRange} days={days} goalMinutes={goalMinutes} />
      </div>

      <div className="card">
        <div className="section-head">
          <h2>{messages.byCategoryTitle}</h2>
          <Segmented
            value={categoryRange}
            options={[['week', messages.range7], ['all', messages.rangeAll]]}
            onChange={setCategoryRange}
          />
        </div>
        {categories.length === 0 ? (
          <p className="empty-note">{messages.noStudyYet}</p>
        ) : (
          <ul className="category-bars">
            {categories.map((entry) => {
              const info = categoryInfo(entry.categoryId, messages, customCategories);
              return (
                <li key={entry.categoryId}>
                  <div className="category-bar-head">
                    <span className="category-bar-icon ja" aria-hidden="true">{info.icon}</span>
                    <span className="category-bar-label">{info.label}</span>
                    <span className="category-bar-value">{formatDuration(entry.seconds, messages)}</span>
                  </div>
                  <span className="category-bar-track" aria-hidden="true">
                    <span
                      className={`series-${chartSeriesFor(entry.categoryId)}`}
                      style={{ width: `${(entry.seconds / maxCategory) * 100}%` }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="card">
        <dl className="totals-list">
          {[
            { label: messages.totalLabel, value: formatDuration(totalSeconds(entries), messages) },
            { label: messages.thisWeekLabel, value: formatDuration(weekSeconds, messages) },
            { label: messages.dailyAverageLabel, value: formatDuration(weekSeconds / 7, messages) },
          ].map((row) => (
            <div className="totals-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        {footer}
      </div>
    </section>
  );
}

interface SegmentedProps<T extends string | number> {
  value: T;
  options: Array<[T, string]>;
  onChange: (value: T) => void;
}

function Segmented<T extends string | number>({ value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="segmented" role="group">
      {options.map(([option, label]) => (
        <button
          key={String(option)}
          type="button"
          className={option === value ? 'segmented-btn segmented-btn--selected' : 'segmented-btn'}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

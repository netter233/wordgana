import { useState } from 'react';
import { useI18n } from '../i18n';
import { formatDuration } from '../lib/studyCategories';

interface DayChartProps {
  days: Array<{ day: string; seconds: number }>;
  goalMinutes: number;
}

const NICE_STEPS = [10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480];

function parseDay(day: string): Date {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date);
}

/**
 * Columnas de minutos por día con la línea de la meta. Una sola serie: un color, sin leyenda. Cada columna
 * es un botón; tocarla muestra su valor arriba (en el celular no hay hover).
 */
export function DayChart({ days, goalMinutes }: DayChartProps) {
  const { language, messages } = useI18n();
  const [selected, setSelected] = useState(days.length - 1);
  const maxMinutes = Math.max(goalMinutes * 1.15, ...days.map((d) => d.seconds / 60), 1);
  const scale = NICE_STEPS.find((step) => step >= maxMinutes) ?? Math.ceil(maxMinutes / 60) * 60;
  const dense = days.length > 10;
  const longDate = new Intl.DateTimeFormat(language, { weekday: 'long', day: 'numeric', month: 'short' });
  const narrowWeekday = new Intl.DateTimeFormat(language, { weekday: 'narrow' });
  const shortDate = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short' });
  const current = days[Math.min(selected, days.length - 1)];

  return (
    <div className="day-chart">
      <p className="day-chart-readout" aria-live="polite">
        {messages.dayDetail(longDate.format(parseDay(current.day)), formatDuration(current.seconds, messages))}
      </p>
      <div className="day-chart-plot">
        <span className="day-chart-max">{messages.durationM(scale)}</span>
        {goalMinutes > 0 && (
          <div className="day-chart-goal" style={{ bottom: `${(goalMinutes / scale) * 100}%` }} />
        )}
        <div className={dense ? 'day-chart-columns day-chart-columns--dense' : 'day-chart-columns'}>
          {days.map((entry, index) => (
            <button
              key={entry.day}
              type="button"
              className={index === selected ? 'day-chart-col day-chart-col--selected' : 'day-chart-col'}
              aria-pressed={index === selected}
              aria-label={messages.dayDetail(longDate.format(parseDay(entry.day)), formatDuration(entry.seconds, messages))}
              onClick={() => setSelected(index)}
            >
              <span
                className={entry.seconds > 0 ? 'day-chart-bar' : 'day-chart-bar day-chart-bar--empty'}
                style={{ height: entry.seconds > 0 ? `${Math.max(2, (entry.seconds / 60 / scale) * 100)}%` : undefined }}
              />
            </button>
          ))}
        </div>
      </div>
      <div className={dense ? 'day-chart-labels day-chart-labels--dense' : 'day-chart-labels'} aria-hidden="true">
        {days.map((entry, index) => (
          <span key={entry.day}>
            {dense
              ? (index % 7 === 0 ? shortDate.format(parseDay(entry.day)) : '')
              : narrowWeekday.format(parseDay(entry.day))}
          </span>
        ))}
      </div>
      {goalMinutes > 0 && (
        <p className="day-chart-key">
          <span className="day-chart-key-line" aria-hidden="true" />
          {messages.goalLine(goalMinutes)}
        </p>
      )}
    </div>
  );
}

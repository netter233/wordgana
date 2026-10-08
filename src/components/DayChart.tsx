import { useState } from 'react';
import { useI18n } from '../i18n';
import { CHART_SERIES, chartSeriesLabel, formatDuration, type ChartSeries } from '../lib/studyCategories';
import type { DayBreakdown } from '../lib/studyTime';

interface DayChartProps {
  days: DayBreakdown[];
  goalMinutes: number;
}

const NICE_STEPS = [10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480];

function parseDay(day: string): Date {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date);
}

/**
 * Columnas apiladas de minutos por día, una serie de color por grupo de categorías, con la línea de la
 * meta. Cada columna es un botón: al tocarla se muestra el detalle del día con cada categoría en texto,
 * que además es la vía accesible para los colores de poco contraste.
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
  const seriesInRange = CHART_SERIES.filter((series) => days.some((day) => day.parts[series]));
  const partsOf = (day: DayBreakdown) => CHART_SERIES.filter((series) => day.parts[series]);
  const describe = (day: DayBreakdown) => [
    messages.dayDetail(longDate.format(parseDay(day.day)), formatDuration(day.seconds, messages)),
    ...partsOf(day).map((series) => `${chartSeriesLabel(series, messages)} ${formatDuration(day.parts[series], messages)}`),
  ].join(', ');

  return (
    <div className="day-chart">
      <div className="day-chart-detail" aria-live="polite">
        <p className="day-chart-readout">
          {messages.dayDetail(longDate.format(parseDay(current.day)), formatDuration(current.seconds, messages))}
        </p>
        {partsOf(current).length > 0 && (
          <ul className="day-chart-breakdown">
            {partsOf(current).map((series) => (
              <li key={series}>
                <Swatch series={series} />
                <span>{chartSeriesLabel(series, messages)}</span>
                <span className="day-chart-breakdown-value">{formatDuration(current.parts[series], messages)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
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
              aria-label={describe(entry)}
              onClick={() => setSelected(index)}
            >
              {entry.seconds > 0 ? (
                <span className="day-chart-stack" style={{ height: `${Math.max(2, (entry.seconds / 60 / scale) * 100)}%` }}>
                  {partsOf(entry).map((series) => (
                    <span
                      key={series}
                      className={`day-chart-segment series-${series}`}
                      style={{ flexGrow: entry.parts[series] }}
                    />
                  ))}
                </span>
              ) : (
                <span className="day-chart-stack day-chart-stack--empty" />
              )}
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
      {(seriesInRange.length > 0 || goalMinutes > 0) && (
        <ul className="day-chart-legend">
          {seriesInRange.map((series) => (
            <li key={series}>
              <Swatch series={series} />
              {chartSeriesLabel(series, messages)}
            </li>
          ))}
          {goalMinutes > 0 && (
            <li>
              <span className="day-chart-key-line" aria-hidden="true" />
              {messages.goalLine(goalMinutes)}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export function Swatch({ series }: { series: ChartSeries }) {
  return <span className={`series-swatch series-${series}`} aria-hidden="true" />;
}

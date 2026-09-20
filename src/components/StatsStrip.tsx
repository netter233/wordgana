import { useI18n } from '../i18n';

interface StatsStripProps {
  streak: number;
  roundsToday: number;
  mastered: number;
  total: number;
  itemLabel: string;
}

export function StatsStrip({ streak, roundsToday, mastered, total, itemLabel }: StatsStripProps) {
  const { messages } = useI18n();
  const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <section className="card">
      <div className="stat-tiles">
        <div className="stat-tile">
          <span className="stat-icon" aria-hidden="true">
            🔥
          </span>
          <div>
            <p className="stat-label">{messages.streak}</p>
            <p className="stat-value">{messages.days(streak)}</p>
          </div>
        </div>
        <div className="stat-tile">
          <span className="stat-icon" aria-hidden="true">
            🎯
          </span>
          <div>
            <p className="stat-label">{messages.today}</p>
            <p className="stat-value">{messages.rounds(roundsToday)}</p>
          </div>
        </div>
      </div>

      <div className="progress-row">
        <span>{messages.mastered(itemLabel)}</span>
        <span>
          {mastered} / {total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="hint">
        {total === 0
          ? messages.emptyContent
          : messages.masteryHint(percent)}
      </p>
    </section>
  );
}

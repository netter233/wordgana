import { useI18n } from '../i18n';

export interface StatsLink {
  icon: string;
  label: string;
  detail?: string;
  onClick: () => void;
}

interface StatsStripProps {
  links: StatsLink[];
  streak: number;
  roundsToday: number;
  mastered: number;
  total: number;
  itemLabel: string;
}

export function StatsStrip({ links, streak, roundsToday, mastered, total, itemLabel }: StatsStripProps) {
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

      <div className="nav-list">
        {links.map((link) => (
          <button type="button" className="nav-row" key={link.label} onClick={link.onClick}>
            <span className="nav-row-icon" aria-hidden="true">{link.icon}</span>
            <span className="nav-row-label">{link.label}</span>
            {link.detail && <span className="nav-row-detail">{link.detail}</span>}
            <svg
              className="nav-row-chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}

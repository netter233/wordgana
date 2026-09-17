interface StatsStripProps {
  streak: number;
  roundsToday: number;
  mastered: number;
  total: number;
}

export function StatsStrip({ streak, roundsToday, mastered, total }: StatsStripProps) {
  const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <section className="card">
      <div className="stat-tiles">
        <div className="stat-tile">
          <span className="stat-icon" aria-hidden="true">
            🔥
          </span>
          <div>
            <p className="stat-label">Racha</p>
            <p className="stat-value">{streak === 1 ? '1 día' : `${streak} días`}</p>
          </div>
        </div>
        <div className="stat-tile">
          <span className="stat-icon" aria-hidden="true">
            🎯
          </span>
          <div>
            <p className="stat-label">Hoy</p>
            <p className="stat-value">{roundsToday === 1 ? '1 ronda' : `${roundsToday} rondas`}</p>
          </div>
        </div>
      </div>

      <div className="progress-row">
        <span>Palabras dominadas</span>
        <span>
          {mastered} / {total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="hint">
        {total === 0
          ? 'Activá filas para tener palabras con las que practicar.'
          : `${percent}% dominado con las filas que tenés activas.`}
      </p>
    </section>
  );
}

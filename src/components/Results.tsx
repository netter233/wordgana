import type { Word } from '../data/words';
import { readingFor } from '../lib/study';

interface ResultsProps {
  total: number;
  correctCount: number;
  missed: Word[];
  onRestartSameRound: () => void;
  onReviewMissed: () => void;
  onChangeRows: () => void;
}

export function Results({
  total,
  correctCount,
  missed,
  onRestartSameRound,
  onReviewMissed,
  onChangeRows,
}: ResultsProps) {
  return (
    <section>
      <div className="card score-card">
        <p className="score">
          {correctCount} / {total}
        </p>
        <p className="score-sub">
          {missed.length === 0 ? '¡Ronda perfecta!' : `${missed.length} para repasar`}
        </p>
      </div>

      {missed.length > 0 && (
        <div className="card missed-list">
          <h3 className="row-section-title">Para repasar</h3>
          <ul>
            {missed.map((w) => (
              <li key={w.kana}>
                <span className="ja">{w.kana}</span> · {readingFor(w)} · {w.es}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="results-actions">
        {missed.length > 0 ? (
          <>
            <button type="button" className="primary-btn" onClick={onReviewMissed}>
              {missed.length === 1 ? 'Repasar la que costó' : `Repasar las ${missed.length} que costaron`}
            </button>
            <button type="button" className="secondary-btn" onClick={onRestartSameRound}>
              Otra ronda
            </button>
          </>
        ) : (
          <button type="button" className="primary-btn" onClick={onRestartSameRound}>
            Otra ronda
          </button>
        )}
        <button type="button" className="secondary-btn" onClick={onChangeRows}>
          Volver al inicio
        </button>
      </div>
    </section>
  );
}

import { toRomaji } from '../lib/kana';
import type { Word } from '../data/words';

interface ResultsProps {
  total: number;
  correctCount: number;
  missed: Word[];
  onRestartSameRound: () => void;
  onChangeRows: () => void;
}

export function Results({ total, correctCount, missed, onRestartSameRound, onChangeRows }: ResultsProps) {
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
                <span className="ja">{w.kana}</span> · {toRomaji(w.kana)} · {w.es}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="results-actions">
        <button type="button" className="primary-btn" onClick={onRestartSameRound}>
          Otra ronda
        </button>
        <button type="button" className="secondary-btn" onClick={onChangeRows}>
          Cambiar filas
        </button>
      </div>
    </section>
  );
}

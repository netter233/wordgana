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
      <h2 className="score">
        {correctCount} / {total}
      </h2>

      {missed.length > 0 && (
        <div className="missed-list">
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

      <button type="button" className="primary-btn" onClick={onRestartSameRound}>
        Otra ronda
      </button>
      <button type="button" className="secondary-btn" onClick={onChangeRows}>
        Cambiar filas
      </button>
    </section>
  );
}

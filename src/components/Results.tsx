import type { Word } from '../data/words';
import { readingFor } from '../lib/study';
import { localizedMeaning } from '../data/translations';
import { useI18n } from '../i18n';
import { useJapaneseSpeech } from '../lib/speech';
import { SpeakButton } from './SpeakButton';

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
  const { language, messages } = useI18n();
  const canSpeak = useJapaneseSpeech();
  return (
    <section>
      <div className="card score-card">
        <p className="score">
          {correctCount} / {total}
        </p>
        <p className="score-sub">
          {missed.length === 0 ? messages.perfectRound : messages.toReview(missed.length)}
        </p>
      </div>

      {missed.length > 0 && (
        <div className="card missed-list">
          <h3 className="row-section-title">{messages.reviewTitle}</h3>
          <ul>
            {missed.map((w) => (
              <li key={w.kana}>
                <span className="missed-text">
                  <span className="ja">{w.kana}</span> · {readingFor(w)}
                  {w.es && ` · ${localizedMeaning(w, language)}`}
                </span>
                {canSpeak && <SpeakButton text={w.kana} small />}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="results-actions">
        {missed.length > 0 ? (
          <>
            <button type="button" className="primary-btn" onClick={onReviewMissed}>
              {messages.reviewMissed(missed.length)}
            </button>
            <button type="button" className="secondary-btn" onClick={onRestartSameRound}>
              {messages.anotherRound}
            </button>
          </>
        ) : (
          <button type="button" className="primary-btn" onClick={onRestartSameRound}>
            {messages.anotherRound}
          </button>
        )}
        <button type="button" className="secondary-btn" onClick={onChangeRows}>
          {messages.backHome}
        </button>
      </div>
    </section>
  );
}

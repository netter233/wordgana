import type { PracticeKind } from '../data/sentences';
import type { KanaScript } from '../data/kana';
import { useI18n } from '../i18n';

interface ContentCardsProps {
  value: PracticeKind;
  unlocked: boolean;
  missingRows: number;
  script: KanaScript;
  onChange: (kind: PracticeKind) => void;
}

export function ContentCards({ value, unlocked, missingRows, script, onChange }: ContentCardsProps) {
  const { messages } = useI18n();
  const choiceClass = (kind: PracticeKind) => (value === kind ? 'choice-card choice-card--selected' : 'choice-card');
  return (
    <section className="card">
      <h2>{messages.contentTitle}</h2>
      <div className="choice-grid choice-grid--three">
        <button
          type="button"
          className={choiceClass('kana')}
          aria-pressed={value === 'kana'}
          onClick={() => onChange('kana')}
        >
          <span className="choice-icon" aria-hidden="true">{script === 'hiragana' ? 'あ' : 'ア'}</span>
          <strong>{messages.letters}</strong>
          <span>{messages.roundsOf(10)}</span>
        </button>
        <button
          type="button"
          className={choiceClass('words')}
          aria-pressed={value === 'words'}
          onClick={() => onChange('words')}
        >
          <span className="choice-icon" aria-hidden="true">{script === 'hiragana' ? 'ねこ' : 'パン'}</span>
          <strong>{messages.words}</strong>
          <span>{messages.roundsOf(10)}</span>
        </button>
        <button
          type="button"
          className={choiceClass('sentences')}
          aria-pressed={value === 'sentences'}
          disabled={!unlocked}
          onClick={() => onChange('sentences')}
        >
          <span className="choice-icon" aria-hidden="true">{unlocked ? '文' : '🔒'}</span>
          <strong>{messages.sentences}</strong>
          <span>{messages.advancedRounds(5)}</span>
        </button>
      </div>
      <p className={unlocked ? 'unlock-note unlock-note--ready' : 'unlock-note'}>
        {unlocked
          ? messages.advancedUnlocked
          : missingRows === 1
            ? messages.oneRowMissing
            : messages.rowsMissing(missingRows)}
      </p>
    </section>
  );
}

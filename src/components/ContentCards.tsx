import type { PracticeKind } from '../data/sentences';
import type { KanaScript } from '../data/kana';

interface ContentCardsProps {
  value: PracticeKind;
  unlocked: boolean;
  missingRows: number;
  script: KanaScript;
  onChange: (kind: PracticeKind) => void;
}

export function ContentCards({ value, unlocked, missingRows, script, onChange }: ContentCardsProps) {
  return (
    <section className="card">
      <h2>2. ¿Qué querés practicar?</h2>
      <div className="choice-grid">
        <button
          type="button"
          className={value === 'words' ? 'choice-card choice-card--selected' : 'choice-card'}
          aria-pressed={value === 'words'}
          onClick={() => onChange('words')}
        >
          <span className="choice-icon" aria-hidden="true">{script === 'hiragana' ? 'あ' : 'ア'}</span>
          <strong>Palabras</strong>
          <span>Rondas de 10</span>
        </button>
        <button
          type="button"
          className={value === 'sentences' ? 'choice-card choice-card--selected' : 'choice-card'}
          aria-pressed={value === 'sentences'}
          disabled={!unlocked}
          onClick={() => onChange('sentences')}
        >
          <span className="choice-icon" aria-hidden="true">{unlocked ? '文' : '🔒'}</span>
          <strong>Oraciones</strong>
          <span>Avanzado · rondas de 5</span>
        </button>
      </div>
      <p className={unlocked ? 'unlock-note unlock-note--ready' : 'unlock-note'}>
        {unlocked
          ? '¡Modo avanzado desbloqueado! Ya podés practicar oraciones.'
          : missingRows === 1
            ? 'Te falta 1 fila para desbloquear Oraciones.'
            : `Te faltan ${missingRows} filas para desbloquear Oraciones.`}
      </p>
    </section>
  );
}

import type { PracticeKind } from '../data/sentences';

interface ContentCardsProps {
  value: PracticeKind;
  unlocked: boolean;
  onChange: (kind: PracticeKind) => void;
}

export function ContentCards({ value, unlocked, onChange }: ContentCardsProps) {
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
          <span className="choice-icon" aria-hidden="true">あ</span>
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
          : 'Seleccioná todas las filas para desbloquear Oraciones.'}
      </p>
    </section>
  );
}

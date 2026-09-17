import { toRomaji, type PracticeMode } from '../lib/kana';
import type { Word } from '../data/words';

interface ModeCardsProps {
  mode: PracticeMode;
  onSelect: (mode: PracticeMode) => void;
  example: Word | null;
}

export function ModeCards({ mode, onSelect, example }: ModeCardsProps) {
  const exampleKana = example?.kana ?? '';
  const exampleRomaji = example ? toRomaji(example.kana) : '';

  return (
    <section>
      <h2>¿Cómo querés practicar?</h2>
      <div className="mode-grid">
        <button
          type="button"
          className={mode === 'read' ? 'mode-card mode-card--selected' : 'mode-card'}
          aria-pressed={mode === 'read'}
          onClick={() => onSelect('read')}
        >
          <h3>Leer</h3>
          <p className="sub">Te muestro hiragana, escribís en romaji</p>
          <div className="example-top ja">{exampleKana || '…'}</div>
          <div className="example-blank">___</div>
        </button>

        <button
          type="button"
          className={mode === 'write' ? 'mode-card mode-card--selected' : 'mode-card'}
          aria-pressed={mode === 'write'}
          onClick={() => onSelect('write')}
        >
          <h3>Escribir</h3>
          <p className="sub">Te muestro romaji, escribís en hiragana (necesitás teclado japonés)</p>
          <div className="example-top">{exampleRomaji || '…'}</div>
          <div className="example-blank">___</div>
        </button>
      </div>
      {!example && (
        <p className="hint">Activá alguna fila para ver un ejemplo real acá.</p>
      )}
    </section>
  );
}

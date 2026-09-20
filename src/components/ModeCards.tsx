import { type PracticeMode } from '../lib/kana';
import type { Word } from '../data/words';
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';
import { readingFor } from '../lib/study';

interface ModeCardsProps {
  mode: PracticeMode;
  onSelect: (mode: PracticeMode) => void;
  example: Word | null;
  script: KanaScript;
  practiceKind: PracticeKind;
  sectionNumber?: number;
}

export function ModeCards({ mode, onSelect, example, script, practiceKind, sectionNumber = 3 }: ModeCardsProps) {
  const exampleKana = example?.kana ?? '';
  const exampleRomaji = example ? readingFor(example) : '';
  const scriptName = script === 'hiragana' ? 'hiragana' : 'katakana';
  const readDescription = practiceKind === 'sentences'
    ? 'Te muestro una oración, escribís en romaji'
    : `Te muestro ${scriptName}, escribís en romaji`;
  const writeDescription = practiceKind === 'sentences'
    ? 'Te muestro romaji, escribís la oración en kana'
    : `Te muestro romaji, escribís en ${scriptName} (necesitás teclado japonés)`;

  return (
    <section className="card">
      <h2>{sectionNumber}. ¿Cómo querés practicar?</h2>
      <div className="mode-grid">
        <button
          type="button"
          className={mode === 'read' ? 'mode-card mode-card--selected' : 'mode-card'}
          aria-pressed={mode === 'read'}
          onClick={() => onSelect('read')}
        >
          <h3>Leer</h3>
          <p className="sub">{readDescription}</p>
          <div className={practiceKind === 'sentences' ? 'example-top example-top--sentence ja' : 'example-top ja'}>
            {exampleKana || '…'}
          </div>
          <div className="example-blank">___</div>
        </button>

        <button
          type="button"
          className={mode === 'write' ? 'mode-card mode-card--selected' : 'mode-card'}
          aria-pressed={mode === 'write'}
          onClick={() => onSelect('write')}
        >
          <h3>Escribir</h3>
          <p className="sub">{writeDescription}</p>
          <div className={practiceKind === 'sentences' ? 'example-top example-top--sentence' : 'example-top'}>
            {exampleRomaji || '…'}
          </div>
          <div className="example-blank">___</div>
        </button>
      </div>
      {!example && (
        <p className="hint">Activá alguna fila para ver un ejemplo real acá.</p>
      )}
    </section>
  );
}

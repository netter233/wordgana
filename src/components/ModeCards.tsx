import { type PracticeMode } from '../lib/kana';
import type { Word } from '../data/words';
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';
import { readingFor } from '../lib/study';
import { useI18n } from '../i18n';

interface ModeCardsProps {
  mode: PracticeMode;
  onSelect: (mode: PracticeMode) => void;
  example: Word | null;
  script: KanaScript;
  practiceKind: PracticeKind;
  sectionNumber?: number;
}

export function ModeCards({ mode, onSelect, example, script, practiceKind, sectionNumber = 3 }: ModeCardsProps) {
  const { messages } = useI18n();
  const exampleKana = example?.kana ?? '';
  const exampleRomaji = example ? readingFor(example) : '';
  const scriptName = script === 'hiragana' ? 'hiragana' : 'katakana';
  const readDescription = practiceKind === 'sentences'
    ? messages.readSentenceDescription
    : messages.readScriptDescription(scriptName);
  const writeDescription = practiceKind === 'sentences'
    ? messages.writeSentenceDescription
    : messages.writeScriptDescription(scriptName);

  return (
    <section className="card">
      <h2>{sectionNumber === 3 ? messages.practiceStyleTitle : `${sectionNumber}. ${messages.practiceStyleTitle.replace(/^3\.\s*/, '')}`}</h2>
      <div className="mode-grid">
        <button
          type="button"
          className={mode === 'read' ? 'mode-card mode-card--selected' : 'mode-card'}
          aria-pressed={mode === 'read'}
          onClick={() => onSelect('read')}
        >
          <h3>{messages.read}</h3>
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
          <h3>{messages.write}</h3>
          <p className="sub">{writeDescription}</p>
          <div className={practiceKind === 'sentences' ? 'example-top example-top--sentence' : 'example-top'}>
            {exampleRomaji || '…'}
          </div>
          <div className="example-blank">___</div>
        </button>
      </div>
      {!example && (
        <p className="hint">{messages.exampleHint}</p>
      )}
    </section>
  );
}

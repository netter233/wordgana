import { useEffect, useRef, useState } from 'react';
import type { Word } from '../data/words';
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';
import { checkAnswer, type PracticeMode } from '../lib/kana';
import { readingFor } from '../lib/study';

interface PracticeProps {
  words: Word[];
  mode: PracticeMode;
  script: KanaScript;
  practiceKind: PracticeKind;
  onAnswer: (word: Word, correct: boolean) => void;
  onFinish: (summary: { correctCount: number; missed: Word[] }) => void;
}

export function Practice({ words, mode, script, practiceKind, onAnswer, onFinish }: PracticeProps) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const word = words[index];

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  if (!word) return null;

  const reading = readingFor(word);
  const prompt = mode === 'read' ? word.kana : reading;
  const promptClass = `${mode === 'read' ? 'prompt-word ja' : 'prompt-word'}${practiceKind === 'sentences' ? ' prompt-word--sentence' : ''}`;
  const expectedAnswer = mode === 'read' ? reading : word.kana;
  const compactValue = value.trim().replace(/[\s、。,.!?\-]/g, '');
  const compactExpected = expectedAnswer.trim().replace(/[\s、。,.!?\-]/g, '').toLowerCase();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (correct === null) {
      const ok = checkAnswer(value, word.kana, mode, script, word.romaji);
      setCorrect(ok);
      onAnswer(word, ok);
      if (ok) setCorrectCount((c) => c + 1);
      else setMissed((m) => [...m, word]);
      return;
    }

    if (index + 1 >= words.length) {
      onFinish({ correctCount, missed });
      return;
    }
    setIndex((i) => i + 1);
    setValue('');
    setCorrect(null);
  }

  return (
    <section>
      <div className="progress-row">
        <span>
          {index + 1} / {words.length}
        </span>
        <span>
          {mode === 'read'
            ? 'escribí en romaji'
            : practiceKind === 'sentences'
              ? 'escribí la oración en kana'
              : `escribí en ${script === 'hiragana' ? 'hiragana' : 'katakana'}`}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((index + 1) / words.length) * 100}%` }} />
      </div>
      <div className={promptClass}>{prompt}</div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="answer-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          lang={mode === 'write' ? 'ja' : undefined}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={correct !== null}
          placeholder={mode === 'write'
            ? practiceKind === 'sentences'
              ? 'かなで…'
              : script === 'hiragana' ? 'ひらがなで…' : 'カタカナで…'
            : 'romaji…'}
        />
        <button type="submit" className="primary-btn">
          {correct === null ? 'Comprobar' : index + 1 >= words.length ? 'Ver resultados' : 'Siguiente'}
        </button>
      </form>

      {correct !== null && (
        <p className={correct ? 'feedback feedback--ok' : 'feedback feedback--bad'}>
          {correct ? '¡Bien! ' : 'Era: '}
          <span className="ja">{word.kana}</span> · {reading} · {word.es}
          {word.emoji && <span className="feedback-emoji"> {word.emoji}</span>}
          {!correct && practiceKind === 'sentences' && (
            <span className="answer-diff">
              Tu respuesta:{' '}
              {compactValue.length === 0
                ? '(vacía)'
                : [...compactValue].map((character, characterIndex) => (
                  <span
                    // La posición alcanza como clave: una respuesta puede repetir el mismo carácter.
                    key={characterIndex}
                    className={character.toLowerCase() === compactExpected[characterIndex] ? undefined : 'answer-diff-error'}
                  >
                    {character}
                  </span>
                ))}
            </span>
          )}
        </p>
      )}
    </section>
  );
}

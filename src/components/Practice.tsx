import { useEffect, useRef, useState } from 'react';
import type { Word } from '../data/words';
import { checkAnswer, toRomaji, type PracticeMode } from '../lib/kana';

interface PracticeProps {
  words: Word[];
  mode: PracticeMode;
  onAnswer: (word: Word, correct: boolean) => void;
  onFinish: (summary: { correctCount: number; missed: Word[] }) => void;
}

export function Practice({ words, mode, onAnswer, onFinish }: PracticeProps) {
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

  const prompt = mode === 'read' ? word.kana : toRomaji(word.kana);
  const promptClass = mode === 'read' ? 'prompt-word ja' : 'prompt-word';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (correct === null) {
      const ok = checkAnswer(value, word.kana, mode);
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

  const romaji = toRomaji(word.kana);

  return (
    <section>
      <div className="progress-row">
        <span>
          {index + 1} / {words.length}
        </span>
        <span>{mode === 'read' ? 'escribí en romaji' : 'escribí en hiragana'}</span>
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
          placeholder={mode === 'write' ? 'ひらがなで…' : 'romaji…'}
        />
        <button type="submit" className="primary-btn">
          {correct === null ? 'Comprobar' : index + 1 >= words.length ? 'Ver resultados' : 'Siguiente'}
        </button>
      </form>

      {correct !== null && (
        <p className={correct ? 'feedback feedback--ok' : 'feedback feedback--bad'}>
          {correct ? '¡Bien! ' : 'Era: '}
          <span className="ja">{word.kana}</span> · {romaji} · {word.es}
        </p>
      )}
    </section>
  );
}

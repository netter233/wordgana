import { useEffect, useMemo, useRef, useState } from 'react';
import type { Word } from '../data/words';
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';
import { checkAnswer, type PracticeMode } from '../lib/kana';
import { alignAnswer } from '../lib/answerDiff';
import { readingFor } from '../lib/study';
import { speakJapanese, useJapaneseSpeech } from '../lib/speech';
import { loadAutoSpeak } from '../lib/storage';
import { SpeakButton } from './SpeakButton';
import { localizedMeaning } from '../data/translations';
import { useI18n } from '../i18n';

interface PracticeProps {
  words: Word[];
  mode: PracticeMode;
  script: KanaScript;
  practiceKind: PracticeKind;
  onAnswer: (word: Word, correct: boolean) => void;
  onFinish: (summary: { correctCount: number; missed: Word[] }) => void;
}

export function Practice({ words, mode, script, practiceKind, onAnswer, onFinish }: PracticeProps) {
  const { language, messages } = useI18n();
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const sentenceInputRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const canSpeak = useJapaneseSpeech();
  const autoSpeak = useMemo(loadAutoSpeak, []);

  const word = words[index];

  useEffect(() => {
    if (practiceKind === 'sentences') sentenceInputRef.current?.focus();
    else wordInputRef.current?.focus();
  }, [index, practiceKind]);

  if (!word) return null;

  const reading = readingFor(word);
  const meaning = localizedMeaning(word, language);
  const prompt = mode === 'read' ? word.kana : reading;
  const promptClass = `${mode === 'read' ? 'prompt-word ja' : 'prompt-word'}${practiceKind === 'sentences' ? ' prompt-word--sentence' : ''}`;
  const expectedAnswer = mode === 'read' ? reading : word.kana;
  const compactValue = value.trim().replace(/[\s、。,.!?\-]/g, '');
  const compactExpected = expectedAnswer.trim().replace(/[\s、。,.!?\-]/g, '').toLowerCase();
  const answerDiff = alignAnswer(compactValue, compactExpected);

  function gradeAnswer(ok: boolean) {
    setCorrect(ok);
    onAnswer(word, ok);
    if (canSpeak && autoSpeak) speakJapanese(word.kana);
    if (ok) setCorrectCount((count) => count + 1);
    else setMissed((items) => [...items, word]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (correct === null) {
      if (composingRef.current || !value.trim()) return;
      const ok = checkAnswer(value, word.kana, mode, script, word.romaji);
      gradeAnswer(ok);
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

  function handleReveal() {
    if (correct === null) gradeAnswer(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.key !== 'Enter') return;
    if (event.nativeEvent.isComposing || composingRef.current) {
      event.preventDefault();
      return;
    }
    if (practiceKind === 'sentences' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const sharedInputProps = {
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(event.target.value),
    onCompositionStart: () => { composingRef.current = true; },
    onCompositionEnd: () => { composingRef.current = false; },
    onKeyDown: handleKeyDown,
    lang: mode === 'write' ? 'ja' : undefined,
    autoCapitalize: 'off' as const,
    autoCorrect: 'off' as const,
    autoComplete: 'off',
    enterKeyHint: 'done' as const,
    spellCheck: false,
    disabled: correct !== null,
    'aria-label': mode === 'read' ? messages.answerRomaji : messages.answerKana,
  };

  return (
    <section>
      <div className="progress-row">
        <span>
          {index + 1} / {words.length}
        </span>
        <span>
          {mode === 'read'
            ? messages.instructionRomaji
            : practiceKind === 'sentences'
              ? messages.instructionSentenceKana
              : messages.instructionScript(script === 'hiragana' ? 'hiragana' : 'katakana')}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((index + 1) / words.length) * 100}%` }} />
      </div>
      <div className={promptClass}>{prompt}</div>

      <form onSubmit={handleSubmit}>
        {practiceKind === 'sentences' ? (
          <textarea
            {...sharedInputProps}
            ref={sentenceInputRef}
            className="answer-input answer-input--sentence"
            rows={2}
            placeholder={mode === 'write' ? 'かなで…' : 'romaji…'}
          />
        ) : (
          <input
            {...sharedInputProps}
            ref={wordInputRef}
            className="answer-input"
            type="text"
            placeholder={mode === 'write'
              ? script === 'hiragana' ? 'ひらがなで…' : 'カタカナで…'
              : 'romaji…'}
          />
        )}
        <button type="submit" className="primary-btn" disabled={correct === null && !value.trim()}>
          {correct === null ? messages.check : index + 1 >= words.length ? messages.viewResults : messages.next}
        </button>
        {correct === null && (
          <button type="button" className="reveal-btn" onClick={handleReveal}>
            {messages.dontRemember}
          </button>
        )}
      </form>

      {correct !== null && (
        <div className={correct ? 'feedback feedback--ok' : 'feedback feedback--bad'}>
          <p className="feedback-text" role="status" aria-live="polite" aria-atomic="true">
            {correct ? messages.correct : messages.expected}
            <span className="ja">{word.kana}</span> · {reading}
            {meaning && ` · ${meaning}`}
            {word.emoji && <span className="feedback-emoji"> {word.emoji}</span>}
            {!correct && practiceKind === 'sentences' && (
              <span className="answer-diff">
                {messages.yourAnswer}
                {compactValue.length === 0
                  ? messages.emptyAnswer
                  : answerDiff.map((part, characterIndex) => (
                    <span
                      key={characterIndex}
                      className={part.correct ? undefined : 'answer-diff-error'}
                    >
                      {part.value}
                    </span>
                  ))}
              </span>
            )}
          </p>
          {canSpeak && <SpeakButton text={word.kana} />}
        </div>
      )}
    </section>
  );
}

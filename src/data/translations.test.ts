import { describe, expect, it } from 'vitest';
import { KATAKANA_WORDS } from './katakanaWords';
import { HIRAGANA_SENTENCES, KATAKANA_SENTENCES } from './sentences';
import { hasCompleteTranslation, localizedMeaning } from './translations';
import { WORDS } from './words';

const ALL_CONTENT = [...WORDS, ...KATAKANA_WORDS, ...HIRAGANA_SENTENCES, ...KATAKANA_SENTENCES];

describe('content translations', () => {
  it('has English, French, and German for every word and sentence', () => {
    const missing = ALL_CONTENT.filter((word) => !hasCompleteTranslation(word)).map((word) => `${word.kana}: ${word.es}`);
    expect(missing).toEqual([]);
  });

  it('keeps Spanish as the original curated gloss', () => {
    for (const word of ALL_CONTENT) {
      expect(localizedMeaning(word, 'es')).toBe(word.es);
    }
  });
});

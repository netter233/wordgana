import { describe, expect, it } from 'vitest';
import { KATAKANA_WORDS } from './katakanaWords';
import { HIRAGANA_SENTENCES, KATAKANA_SENTENCES } from './sentences';
import { hasCompleteTranslation, localizedMeaning } from './translations';
import { WORDS } from './words';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { PT_IT } from './translationsPtIt';

const ALL_CONTENT = [...WORDS, ...KATAKANA_WORDS, ...HIRAGANA_SENTENCES, ...KATAKANA_SENTENCES];

describe('content translations', () => {
  it('has English, French, German, Portuguese, and Italian for every word and sentence', () => {
    const missing = ALL_CONTENT.filter((word) => !hasCompleteTranslation(word)).map((word) => `${word.kana}: ${word.es}`);
    expect(missing).toEqual([]);
  });

  it('keeps Spanish as the original curated gloss', () => {
    for (const word of ALL_CONTENT) {
      expect(localizedMeaning(word, 'es')).toBe(word.es);
    }
  });

  it.each(SUPPORTED_LANGUAGES)('returns a nonempty meaning for every word and sentence in %s', (language) => {
    for (const word of ALL_CONTENT) {
      expect(localizedMeaning(word, language).trim(), `${language}: ${word.kana}`).not.toBe('');
    }
  });

  it('uses English when a Portuguese or Italian meaning is missing or blank', () => {
    const original = PT_IT.agua;
    const water = { kana: 'みず', es: 'agua' };
    try {
      delete PT_IT.agua;
      expect(hasCompleteTranslation(water)).toBe(false);
      expect(localizedMeaning(water, 'pt')).toBe('water');
      expect(localizedMeaning(water, 'it')).toBe('water');
      PT_IT.agua = ['  ', ''];
      expect(hasCompleteTranslation(water)).toBe(false);
      expect(localizedMeaning(water, 'pt')).toBe('water');
      expect(localizedMeaning(water, 'it')).toBe('water');
    } finally {
      PT_IT.agua = original;
    }
  });

  it('leaves isolated kana without an invented meaning in every language', () => {
    for (const language of SUPPORTED_LANGUAGES) {
      expect(localizedMeaning({ kana: 'あ', es: '' }, language)).toBe('');
    }
  });
});

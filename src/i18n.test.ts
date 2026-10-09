import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ACHIEVEMENTS } from './data/achievements';
import { CATEGORY_ICONS } from './lib/studyCategories';
import { MESSAGES, SUPPORTED_LANGUAGES, resolveLanguage, type Messages } from './i18n';

describe('resolveLanguage', () => {
  it('matches supported regional locales to their base language', () => {
    expect(resolveLanguage(['es-AR'])).toBe('es');
    expect(resolveLanguage(['fr-CA'])).toBe('fr');
    expect(resolveLanguage(['de-DE'])).toBe('de');
    expect(resolveLanguage(['en-US'])).toBe('en');
    expect(resolveLanguage(['pt-BR'])).toBe('pt');
    expect(resolveLanguage(['pt-PT'])).toBe('pt');
    expect(resolveLanguage(['it-IT'])).toBe('it');
  });

  it('uses the first supported preference and falls back to English', () => {
    expect(resolveLanguage(['ja-JP', 'it-IT', 'fr-FR'])).toBe('it');
    expect(resolveLanguage(['ja-JP', 'ko-KR'])).toBe('en');
    expect(resolveLanguage([])).toBe('en');
  });
});

// Exercise interpolated messages as well as static labels: TypeScript alone cannot catch
// empty translations or missing placeholders at runtime.
const TEXT_ARGUMENTS: Partial<Record<keyof Messages, unknown[]>> = {
  autoLanguage: ['Français'], rowsTitle: ['hiragana'], mastered: ['Characters'],
  readScriptDescription: ['hiragana'], writeScriptDescription: ['katakana'],
  instructionScript: ['hiragana'], unlockedOn: ['DATE'], achBasic: ['katakana'],
  practiceItems: [2, 'words'], minimumHint: [2, 'sentences'],
  dayDetail: ['DATE', 'DURATION'], confirmRemoveCategory: ['CATEGORY'],
  confirmDeleteEntry: ['CATEGORY', 'DURATION'],
};

describe('interface translation coverage', () => {
  it.each(SUPPORTED_LANGUAGES)('covers every message and nested label in %s', (language) => {
    const messages = MESSAGES[language];
    expect(Object.keys(messages).sort()).toEqual(Object.keys(MESSAGES.en).sort());
    for (const key of Object.keys(MESSAGES.en) as Array<keyof Messages>) {
      const value = messages[key];
      expect(typeof value, `${language}.${key}`).toBe(typeof MESSAGES.en[key]);
      if (typeof value === 'object') {
        expect(Object.keys(value).sort()).toEqual(Object.keys(MESSAGES.en[key]).sort());
        for (const label of Object.values(value)) expect(label.trim()).not.toBe('');
      } else {
        const rendered = typeof value === 'function'
          ? (value as (...args: unknown[]) => string)(...(TEXT_ARGUMENTS[key] ?? [2, 4, 7]))
          : value;
        expect(rendered.trim(), `${language}.${key}`).not.toBe('');
        expect(rendered, `${language}.${key}`).not.toMatch(/undefined|NaN|\[object Object\]/);
      }
    }
    expect(Object.keys(messages.categoryIconNames).sort()).toEqual([...CATEGORY_ICONS].sort());
  });

  it.each(SUPPORTED_LANGUAGES)('has a title for every achievement in %s', (language) => {
    for (const achievement of ACHIEVEMENTS) {
      expect(Object.keys(achievement.title).sort()).toEqual([...SUPPORTED_LANGUAGES].sort());
      expect(achievement.title[language].trim(), achievement.id).not.toBe('');
    }
  });

  it('registers every shipped language with iOS', () => {
    const plist = readFileSync(new URL('../ios/App/App/Info.plist', import.meta.url), 'utf8');
    const localizations = plist.match(/<key>CFBundleLocalizations<\/key>\s*<array>([\s\S]*?)<\/array>/)?.[1] ?? '';
    for (const language of SUPPORTED_LANGUAGES) {
      expect(localizations).toContain(`<string>${language === 'pt' ? 'pt-BR' : language}</string>`);
    }
  });
});

describe('counted practice labels', () => {
  const nouns = {
    en: [['character', 'characters'], ['word', 'words'], ['sentence', 'sentences']],
    es: [['letra', 'letras'], ['palabra', 'palabras'], ['oración', 'oraciones']],
    fr: [['caractère', 'caractères'], ['mot', 'mots'], ['phrase', 'phrases']],
    de: [['Zeichen', 'Zeichen'], ['Wort', 'Wörter'], ['Satz', 'Sätze']],
    pt: [['letra', 'letras'], ['palavra', 'palavras'], ['frase', 'frases']],
    it: [['carattere', 'caratteri'], ['parola', 'parole'], ['frase', 'frasi']],
  };

  it.each(SUPPORTED_LANGUAGES)('uses singular and plural nouns in %s', (language) => {
    for (const [index, kind] of (['kana', 'words', 'sentences'] as const).entries()) {
      for (const count of [0, 1, 2]) {
        const noun = nouns[language][index][count === 1 ? 0 : 1];
        expect(MESSAGES[language].practiceItems(count, kind)).toContain(`${count} ${noun}`);
        expect(MESSAGES[language].minimumHint(count, kind)).toContain(`${count} ${noun}`);
      }
    }
    expect(MESSAGES[language].rowsSummary(1, 20, 1)).toContain(`1 ${nouns[language][1][0]}`);
  });
});

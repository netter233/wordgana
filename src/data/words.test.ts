import { describe, expect, it } from 'vitest';
import { isEligible, tryTokenize } from '../lib/kana';
import { WORDS } from './words';

describe('WORDS', () => {
  it('tiene una cantidad razonable de entradas', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(300);
  });

  it('cada palabra es hiragana puro y tokenizable', () => {
    const invalid = WORDS.filter((w) => tryTokenize(w.kana) === null);
    expect(invalid).toEqual([]);
  });

  it('cada palabra tiene significado en español', () => {
    const withoutMeaning = WORDS.filter((w) => !w.es || !w.es.trim());
    expect(withoutMeaning).toEqual([]);
  });

  it('no hay palabras duplicadas', () => {
    const seen = new Map<string, number>();
    for (const w of WORDS) seen.set(w.kana, (seen.get(w.kana) ?? 0) + 1);
    const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([kana]) => kana);
    expect(duplicates).toEqual([]);
  });

  it('hay al menos 10 palabras formadas solo con las filas あ y か', () => {
    const eligible = WORDS.filter((w) => isEligible(w.kana, ['a', 'ka']));
    expect(eligible.length).toBeGreaterThanOrEqual(10);
  });

  it('con todas las filas activas, todas las palabras son elegibles', () => {
    const allRowIds = [
      'a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n',
      'ga', 'za', 'da', 'ba', 'pa',
      'kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya',
      'sokuon',
    ];
    const ineligible = WORDS.filter((w) => !isEligible(w.kana, allRowIds));
    expect(ineligible).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { isEligible, tokenize, tryTokenize } from '../lib/kana';
import { HIRAGANA_ROWS } from './kana';
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

  it('los emojis, cuando están, son un emoji solo y sin texto', () => {
    const invalid = WORDS.filter((w) => {
      if (w.emoji === undefined) return false;
      const codePoints = [...w.emoji];
      return codePoints.length === 0 || codePoints.length > 8 || /[a-zA-Z\s]/.test(w.emoji);
    });
    expect(invalid).toEqual([]);
  });

  it('hay una cantidad razonable de palabras con emoji', () => {
    const withEmoji = WORDS.filter((w) => w.emoji);
    expect(withEmoji.length).toBeGreaterThanOrEqual(100);
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

  it('cada fila tiene al menos 4 palabras, así activar una fila nueva siempre suma material', () => {
    const counts = new Map<string, number>();
    for (const w of WORDS) {
      const rowIds = new Set(tokenize(w.kana).map((t) => (t.type === 'unit' ? t.unit.rowId : 'sokuon')));
      for (const id of rowIds) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    const thin = HIRAGANA_ROWS.filter((row) => (counts.get(row.id) ?? 0) < 4).map((row) => row.id);
    expect(thin).toEqual([]);
  });
});

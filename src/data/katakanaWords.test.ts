import { describe, expect, it } from 'vitest';
import { KATAKANA_WORDS } from './katakanaWords';
import { KATAKANA_ROWS } from './kana';
import { HIRAGANA_SENTENCES, KATAKANA_SENTENCES } from './sentences';
import { isEligible, tryTokenize } from '../lib/kana';

describe('KATAKANA_WORDS', () => {
  it('tiene vocabulario suficiente para rondas variadas', () => {
    expect(KATAKANA_WORDS.length).toBeGreaterThanOrEqual(90);
  });

  it('todas las palabras son tokenizables y elegibles con todas las filas', () => {
    const rowIds = KATAKANA_ROWS.map((row) => row.id);
    expect(KATAKANA_WORDS.filter((word) => tryTokenize(word.kana) === null)).toEqual([]);
    expect(KATAKANA_WORDS.filter((word) => !isEligible(word.kana, rowIds))).toEqual([]);
  });

  it('no tiene palabras duplicadas y todas tienen significado', () => {
    expect(new Set(KATAKANA_WORDS.map((word) => word.kana)).size).toBe(KATAKANA_WORDS.length);
    expect(KATAKANA_WORDS.every((word) => word.es.trim().length > 0)).toBe(true);
  });
});

describe('oraciones avanzadas', () => {
  it('ofrece suficientes rondas en ambos silabarios', () => {
    expect(HIRAGANA_SENTENCES.length).toBeGreaterThanOrEqual(15);
    expect(KATAKANA_SENTENCES.length).toBeGreaterThanOrEqual(15);
  });

  it('cada oración tiene lectura explícita y traducción', () => {
    const sentences = [...HIRAGANA_SENTENCES, ...KATAKANA_SENTENCES];
    expect(sentences.every((sentence) => sentence.kana && sentence.romaji && sentence.es)).toBe(true);
  });

  it('las oraciones de katakana mezclan katakana e hiragana', () => {
    expect(KATAKANA_SENTENCES.every((sentence) => /[ァ-ヶ]/.test(sentence.kana))).toBe(true);
    expect(KATAKANA_SENTENCES.every((sentence) => /[ぁ-ゖ]/.test(sentence.kana))).toBe(true);
  });
});

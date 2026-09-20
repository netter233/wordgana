import { describe, expect, it } from 'vitest';
import { countMastered, pickRound } from './session';
import type { Word } from '../data/words';

const words: Word[] = [
  { kana: 'あい', es: 'amor' },
  { kana: 'いえ', es: 'casa' },
  { kana: 'うえ', es: 'arriba' },
  { kana: 'かお', es: 'cara' },
];

function fakeRandom(values: number[]): () => number {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
}

describe('pickRound', () => {
  it('devuelve como máximo `count` palabras, sin repetidos', () => {
    const round = pickRound(words, 2, {}, fakeRandom([0.1, 0.9]));
    expect(round).toHaveLength(2);
    expect(new Set(round.map((w) => w.kana)).size).toBe(2);
  });

  it('si count supera el pool, devuelve todas las palabras sin repetir', () => {
    const round = pickRound(words, 100, {}, fakeRandom([0.5]));
    expect(round).toHaveLength(words.length);
    expect(new Set(round.map((w) => w.kana)).size).toBe(words.length);
  });

  it('con pool vacío devuelve una ronda vacía', () => {
    expect(pickRound([], 10)).toEqual([]);
  });

  it('prioriza palabras falladas recientemente', () => {
    const stats = { あい: { seen: 1, missed: 1 } };
    const round = pickRound(words, 1, stats, fakeRandom([0]));
    expect(round[0].kana).toBe('あい');
  });

  it('con random en un punto medio elige una palabra de peso base, no la fallada', () => {
    // pesos [4,1,1,1] = total 7. random()=0.7 cae fuera de la primera palabra.
    const stats = { あい: { seen: 1, missed: 1 } };
    const round = pickRound(words, 1, stats, fakeRandom([0.7]));
    expect(round[0].kana).toBe('いえ');
  });

  it('usa la clave contextual para separar modos de práctica', () => {
    const stats = { 'read:あい': { seen: 1, missed: 1, correctStreak: 0 } };
    const round = pickRound(words, 1, stats, fakeRandom([0]), (word) => `read:${word.kana}`);
    expect(round[0].kana).toBe('あい');
  });

  it('no muta el array de palabras recibido', () => {
    const copy = [...words];
    pickRound(words, 2);
    expect(words).toEqual(copy);
  });
});

describe('countMastered', () => {
  it('considera afianzada una palabra después de dos aciertos consecutivos', () => {
    const stats = {
      あい: { seen: 3, missed: 1, correctStreak: 2 },
      いえ: { seen: 2, missed: 1, correctStreak: 0 },
      うえ: { seen: 1, missed: 0, correctStreak: 1 },
    };
    expect(countMastered(words, stats)).toBe(1);
  });

  it('no cuenta palabras sin estadísticas ni palabras nunca contestadas', () => {
    expect(countMastered(words, {})).toBe(0);
    expect(countMastered(words, { あい: { seen: 0, missed: 0 } })).toBe(0);
  });

  it('solo cuenta las palabras recibidas, no todas las del historial', () => {
    const stats = { あい: { seen: 2, missed: 0 }, みず: { seen: 2, missed: 0 } };
    expect(countMastered([{ kana: 'あい', es: 'amor' }], stats)).toBe(1);
  });

  it('permite recuperar una palabra que se había fallado', () => {
    const stats = { あい: { seen: 5, missed: 2, correctStreak: 2 } };
    expect(countMastered([{ kana: 'あい', es: 'amor' }], stats)).toBe(1);
  });
});

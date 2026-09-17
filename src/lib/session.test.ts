import { describe, expect, it } from 'vitest';
import { pickRound } from './session';
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

  it('con random en 0 elige siempre la primera palabra restante con más peso', () => {
    // あい tiene peso 3 (fallada), el resto peso 1 → total 6. random()=0 → r=0, cae en el primer
    // elemento de mayor peso acumulado, que es あい.
    const stats = { あい: { seen: 1, missed: 1 } };
    const round = pickRound(words, 1, stats, fakeRandom([0]));
    expect(round[0].kana).toBe('あい');
  });

  it('con random en un punto medio elige una palabra de peso base, no la fallada', () => {
    // pesos [3,1,1,1] = total 6. random()=0.6 → r=3.6, se consume el primer peso (3, あい)
    // y cae en el segundo elemento (いえ, peso 1).
    const stats = { あい: { seen: 1, missed: 1 } };
    const round = pickRound(words, 1, stats, fakeRandom([0.6]));
    expect(round[0].kana).toBe('いえ');
  });

  it('no muta el array de palabras recibido', () => {
    const copy = [...words];
    pickRound(words, 2);
    expect(words).toEqual(copy);
  });
});

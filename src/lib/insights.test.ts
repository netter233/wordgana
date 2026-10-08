import { describe, expect, it } from 'vitest';
import {
  accuracy,
  hardestLetters,
  hardestWords,
  parseStatKey,
  tallyByMode,
  totalTally,
} from './insights';
import type { StatsMap } from './storage';

const stats: StatsMap = {
  'hiragana:words:read:さかな': { seen: 4, missed: 2 },
  'hiragana:words:write:さかな': { seen: 2, missed: 1 },
  'hiragana:words:read:かお': { seen: 4, missed: 0 },
  'hiragana:kana:read:し': { seen: 3, missed: 3 },
  'hiragana:sentences:read:みずを のみます。': { seen: 1, missed: 1 },
  'katakana:words:read:パン': { seen: 5, missed: 1 },
  'read:あい': { seen: 10, missed: 10 },
};

describe('parseStatKey', () => {
  it('lee claves nuevas e ignora las antiguas', () => {
    expect(parseStatKey('katakana:kana:write:ア')).toEqual({ script: 'katakana', kind: 'kana', mode: 'write', kana: 'ア' });
    expect(parseStatKey('read:あい')).toBeNull();
    expect(parseStatKey('あい')).toBeNull();
  });
});

describe('totales', () => {
  it('suma respuestas y aciertos de ambos silabarios sin claves antiguas', () => {
    expect(totalTally(stats)).toEqual({ answers: 19, correct: 11 });
    expect(accuracy({ answers: 19, correct: 11 })).toBe(58);
    expect(accuracy({ answers: 0, correct: 0 })).toBe(0);
  });

  it('separa por modo dentro de un silabario', () => {
    expect(tallyByMode(stats, 'hiragana')).toEqual({
      read: { answers: 12, correct: 6 },
      write: { answers: 2, correct: 1 },
    });
  });
});

describe('hardestLetters', () => {
  it('reparte las respuestas de cada palabra entre sus letras', () => {
    const letters = hardestLetters(stats, 'hiragana');
    expect(letters[0]).toEqual({ kana: 'し', seen: 3, missed: 3, errorRate: 100 });
    const sa = letters.find((letter) => letter.kana === 'さ');
    expect(sa).toEqual({ kana: 'さ', seen: 6, missed: 3, errorRate: 50 });
    const ka = letters.find((letter) => letter.kana === 'か');
    expect(ka).toEqual({ kana: 'か', seen: 10, missed: 3, errorRate: 30 });
  });

  it('exige un mínimo de respuestas y omite letras sin errores', () => {
    const letters = hardestLetters(stats, 'hiragana');
    expect(letters.some((letter) => letter.kana === 'お')).toBe(false);
    expect(letters.some((letter) => letter.kana === 'み')).toBe(false);
  });
});

describe('hardestWords', () => {
  it('suma Leer y Escribir y ordena por porcentaje de error', () => {
    expect(hardestWords(stats, 'hiragana')).toEqual([
      { kana: 'さかな', seen: 6, missed: 3, errorRate: 50 },
    ]);
    expect(hardestWords(stats, 'katakana')[0].kana).toBe('パン');
  });
});

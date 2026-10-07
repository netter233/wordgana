import { describe, expect, it } from 'vitest';
import { HIRAGANA_ROWS, KATAKANA_ROWS } from '../data/kana';
import { checkAnswer } from './kana';
import { letterItems } from './letters';

describe('letterItems', () => {
  it('devuelve solo las letras de las filas activas, en orden', () => {
    const items = letterItems(HIRAGANA_ROWS, new Set(['a', 'kya']));
    expect(items.map((item) => item.kana)).toEqual(['あ', 'い', 'う', 'え', 'お', 'きゃ', 'きゅ', 'きょ']);
  });

  it('ignora っ y ー porque no tienen letras propias', () => {
    expect(letterItems(KATAKANA_ROWS, new Set(['sokuon', 'choon']))).toEqual([]);
  });

  it('las letras se pueden responder con checkAnswer, incluidas las variantes', () => {
    const [shi] = letterItems(HIRAGANA_ROWS, new Set(['sa'])).filter((item) => item.kana === 'し');
    expect(checkAnswer('si', shi.kana, 'read', 'hiragana')).toBe(true);
    expect(checkAnswer('し', shi.kana, 'write', 'hiragana')).toBe(true);
    const [tsu] = letterItems(KATAKANA_ROWS, new Set(['ta'])).filter((item) => item.kana === 'ツ');
    expect(checkAnswer('tu', tsu.kana, 'read', 'katakana')).toBe(true);
  });
});

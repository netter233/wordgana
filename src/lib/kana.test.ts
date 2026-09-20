import { describe, expect, it } from 'vitest';
import {
  checkAnswer,
  isEligible,
  matchesRomaji,
  normalizeHiragana,
  toRomaji,
  tryTokenize,
} from './kana';

describe('tryTokenize', () => {
  it('separa yōon como una sola unidad', () => {
    const tokens = tryTokenize('きゃく')!;
    expect(tokens).toEqual([
      { type: 'unit', unit: expect.objectContaining({ kana: 'きゃ', rowId: 'kya' }) },
      { type: 'unit', unit: expect.objectContaining({ kana: 'く', rowId: 'ka' }) },
    ]);
  });

  it('reconoce っ como token propio', () => {
    const tokens = tryTokenize('がっこう')!;
    expect(tokens.map((t) => t.type)).toEqual(['unit', 'sokuon', 'unit', 'unit']);
  });

  it('reconoce ん como unidad propia', () => {
    const tokens = tryTokenize('せんせい')!;
    expect(tokens.map((t) => t.type)).toEqual(['unit', 'unit', 'unit', 'unit']);
  });

  it('tokeniza katakana y devuelve null ante caracteres desconocidos', () => {
    expect(tryTokenize('カタカナ')).toHaveLength(4);
    expect(tryTokenize('abc')).toBeNull();
    expect(tryTokenize('')).toEqual([]);
  });
});

describe('toRomaji', () => {
  it('がっこう -> gakkou (sokuon dobla la consonante siguiente)', () => {
    expect(toRomaji('がっこう')).toBe('gakkou');
  });

  it('きって -> kitte', () => {
    expect(toRomaji('きって')).toBe('kitte');
  });

  it('せんせい -> sensei', () => {
    expect(toRomaji('せんせい')).toBe('sensei');
  });

  it('まっちゃ -> matcha (excepción de Hepburn: tch, no cch)', () => {
    expect(toRomaji('まっちゃ')).toBe('matcha');
  });

  it('みず -> mizu', () => {
    expect(toRomaji('みず')).toBe('mizu');
  });

  it('コーヒー -> koohii (soporta el alargador de katakana)', () => {
    expect(toRomaji('コーヒー')).toBe('koohii');
  });
});

describe('matchesRomaji', () => {
  it('acepta shi y si para し', () => {
    expect(matchesRomaji('shi', 'し')).toBe(true);
    expect(matchesRomaji('si', 'し')).toBe(true);
  });

  it('acepta kitte para きって', () => {
    expect(matchesRomaji('kitte', 'きって')).toBe(true);
  });

  it('acepta sensei y sennsei para せんせい', () => {
    expect(matchesRomaji('sensei', 'せんせい')).toBe(true);
    expect(matchesRomaji('sennsei', 'せんせい')).toBe(true);
  });

  it('acepta variantes de yōon (sya/sha, tya/cha, zya/jya/ja)', () => {
    expect(matchesRomaji('sha', 'しゃ')).toBe(true);
    expect(matchesRomaji('sya', 'しゃ')).toBe(true);
    expect(matchesRomaji('cha', 'ちゃ')).toBe(true);
    expect(matchesRomaji('tya', 'ちゃ')).toBe(true);
    expect(matchesRomaji('ja', 'じゃ')).toBe(true);
    expect(matchesRomaji('jya', 'じゃ')).toBe(true);
    expect(matchesRomaji('zya', 'じゃ')).toBe(true);
  });

  it('rechaza romaji incorrecto o incompleto', () => {
    expect(matchesRomaji('mizo', 'みず')).toBe(false);
    expect(matchesRomaji('miz', 'みず')).toBe(false);
    expect(matchesRomaji('mizuu', 'みず')).toBe(false);
    expect(matchesRomaji('', 'みず')).toBe(false);
  });

  it('ignora mayúsculas y espacios', () => {
    expect(matchesRomaji('  MiZu  ', 'みず')).toBe(true);
  });
});

describe('normalizeHiragana', () => {
  it('convierte katakana a hiragana', () => {
    expect(normalizeHiragana('ミズ')).toBe('みず');
  });

  it('recorta espacios', () => {
    expect(normalizeHiragana('  みず  ')).toBe('みず');
  });
});

describe('isEligible', () => {
  const vowelsAndK = ['a', 'ka'];

  it('acepta palabras formadas solo por filas activas', () => {
    expect(isEligible('かき', vowelsAndK)).toBe(true);
    expect(isEligible('あい', vowelsAndK)).toBe(true);
  });

  it('rechaza palabras con filas no activas', () => {
    expect(isEligible('さけ', vowelsAndK)).toBe(false);
  });

  it('exige la fila sokuon activa para palabras con っ', () => {
    expect(isEligible('がっこう', ['a', 'ka', 'ga'])).toBe(false);
    expect(isEligible('がっこう', ['a', 'ka', 'ga', 'sokuon'])).toBe(true);
  });

  it('devuelve false para palabras no tokenizables', () => {
    expect(isEligible('カタカナ', vowelsAndK)).toBe(false);
  });
});

describe('checkAnswer', () => {
  it('modo read acepta romaji correcto', () => {
    expect(checkAnswer('mizu', 'みず', 'read')).toBe(true);
    expect(checkAnswer('shi', 'し', 'read')).toBe(true);
  });

  it('modo read también acepta hiragana (teclado con IME)', () => {
    expect(checkAnswer('みず', 'みず', 'read')).toBe(true);
  });

  it('modo read rechaza romaji incorrecto', () => {
    expect(checkAnswer('mizo', 'みず', 'read')).toBe(false);
  });

  it('modo write solo acepta hiragana', () => {
    expect(checkAnswer('みず', 'みず', 'write')).toBe(true);
    expect(checkAnswer('mizu', 'みず', 'write')).toBe(false);
  });

  it('modo write exige el silabario seleccionado', () => {
    expect(checkAnswer('ミズ', 'みず', 'write', 'hiragana')).toBe(false);
    expect(checkAnswer('ミズ', 'ミズ', 'write', 'katakana')).toBe(true);
    expect(checkAnswer('みず', 'ミズ', 'write', 'katakana')).toBe(false);
  });

  it('valida lectura y oraciones con romaji explícito', () => {
    expect(checkAnswer('koohii', 'コーヒー', 'read', 'katakana')).toBe(true);
    expect(checkAnswer('mizu o nomimasu', 'みずを のみます。', 'read', 'hiragana', 'mizu o nomimasu')).toBe(true);
    expect(checkAnswer('みずをのみます', 'みずを のみます。', 'write', 'hiragana')).toBe(true);
    expect(checkAnswer('Mizu o nomimasu.', 'みずを のみます。', 'read', 'hiragana', 'mizu o nomimasu')).toBe(true);
  });

  it('rechaza respuesta vacía', () => {
    expect(checkAnswer('   ', 'みず', 'read')).toBe(false);
  });
});

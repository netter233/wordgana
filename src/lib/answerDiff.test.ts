import { describe, expect, it } from 'vitest';
import { alignAnswer } from './answerDiff';

describe('alignAnswer', () => {
  it('marca una omisión sin desplazar el resto de la respuesta', () => {
    const diff = alignAnswer('kite', 'kitte');
    expect(diff.filter((part) => !part.correct)).toEqual([
      { value: '＿', correct: false, missing: true },
    ]);
    expect(diff.map((part) => part.value).join('')).toBe('ki＿te');
  });

  it('marca una sustitución puntual', () => {
    const diff = alignAnswer('mizo', 'mizu');
    expect(diff.filter((part) => !part.correct)).toEqual([{ value: 'o', correct: false }]);
  });

  it('deja intacta una respuesta correcta', () => {
    expect(alignAnswer('みず', 'みず').every((part) => part.correct)).toBe(true);
    expect(alignAnswer('MIZU', 'mizu').every((part) => part.correct)).toBe(true);
  });
});

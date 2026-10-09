import { describe, expect, it } from 'vitest';
import { textScaleFor } from './textSize';

describe('textScaleFor', () => {
  it('no cambia nada con el tamaño estándar de iOS', () => {
    expect(textScaleFor(17)).toBe(1);
  });

  it('sigue al tamaño del sistema en proporción', () => {
    expect(textScaleFor(23)).toBeCloseTo(23 / 17);
    expect(textScaleFor(14)).toBeCloseTo(14 / 17);
  });

  it('limita los extremos para que la práctica siga entrando en pantalla', () => {
    expect(textScaleFor(53)).toBe(2);
    expect(textScaleFor(8)).toBe(0.8);
  });

  it('ignora valores inválidos', () => {
    expect(textScaleFor(Number.NaN)).toBe(1);
    expect(textScaleFor(0)).toBe(1);
  });
});

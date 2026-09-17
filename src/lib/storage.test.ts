import { describe, expect, it } from 'vitest';
import { EMPTY_PROGRESS, dayKey, normalizeProgress, recordRound, type Progress } from './storage';

const today = new Date(2026, 8, 17, 10, 0);
const yesterday = new Date(2026, 8, 16, 10, 0);
const twoDaysAgo = new Date(2026, 8, 15, 10, 0);

describe('dayKey', () => {
  it('usa la fecha local, no UTC', () => {
    // 23:30 local del 17 sigue siendo el día 17, aunque en UTC ya sea el 18.
    expect(dayKey(new Date(2026, 8, 17, 23, 30))).toBe('2026-09-17');
    expect(dayKey(new Date(2026, 0, 5, 0, 15))).toBe('2026-01-05');
  });
});

describe('recordRound', () => {
  it('arranca la racha en 1 la primera vez', () => {
    expect(recordRound(EMPTY_PROGRESS, today)).toEqual({
      lastDay: '2026-09-17',
      streak: 1,
      roundsToday: 1,
    });
  });

  it('suma rondas del mismo día sin tocar la racha', () => {
    const progress: Progress = { lastDay: dayKey(today), streak: 4, roundsToday: 2 };
    expect(recordRound(progress, today)).toEqual({
      lastDay: '2026-09-17',
      streak: 4,
      roundsToday: 3,
    });
  });

  it('extiende la racha si la última ronda fue ayer', () => {
    const progress: Progress = { lastDay: dayKey(yesterday), streak: 4, roundsToday: 5 };
    expect(recordRound(progress, today)).toEqual({
      lastDay: '2026-09-17',
      streak: 5,
      roundsToday: 1,
    });
  });

  it('reinicia la racha si pasó más de un día', () => {
    const progress: Progress = { lastDay: dayKey(twoDaysAgo), streak: 9, roundsToday: 1 };
    expect(recordRound(progress, today)).toEqual({
      lastDay: '2026-09-17',
      streak: 1,
      roundsToday: 1,
    });
  });
});

describe('normalizeProgress', () => {
  it('deja intacto el progreso de hoy', () => {
    const progress: Progress = { lastDay: dayKey(today), streak: 3, roundsToday: 2 };
    expect(normalizeProgress(progress, today)).toEqual(progress);
  });

  it('mantiene viva la racha de ayer pero resetea las rondas del día', () => {
    const progress: Progress = { lastDay: dayKey(yesterday), streak: 3, roundsToday: 2 };
    expect(normalizeProgress(progress, today)).toEqual({
      lastDay: dayKey(yesterday),
      streak: 3,
      roundsToday: 0,
    });
  });

  it('borra la racha si la última ronda fue hace más de un día', () => {
    const progress: Progress = { lastDay: dayKey(twoDaysAgo), streak: 3, roundsToday: 2 };
    expect(normalizeProgress(progress, today)).toEqual(EMPTY_PROGRESS);
  });
});

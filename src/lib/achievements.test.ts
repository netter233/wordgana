import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, BASIC_LETTER_COUNT } from '../data/achievements';
import { HIRAGANA_ROWS, KATAKANA_ROWS } from '../data/kana';
import {
  achievementProgress,
  computeMetrics,
  evaluateAchievements,
  nextAchievement,
  type AchievementMetrics,
} from './achievements';
import { EMPTY_LIFETIME, type StatsMap } from './storage';

const mastered = { seen: 2, missed: 0, correctStreak: 2 };
const learning = { seen: 1, missed: 1, correctStreak: 0 };

const zero: AchievementMetrics = {
  rounds: 0,
  bestStreak: 0,
  wordsLearned: 0,
  perfectRounds: 0,
  hiraganaBasic: 0,
  katakanaBasic: 0,
  modesPracticed: 0,
  scriptsPracticed: 0,
  sentenceRounds: 0,
  studyMinutes: 0,
  goalStreak: 0,
};

describe('ACHIEVEMENTS', () => {
  it('tiene ids únicos y títulos en los cuatro idiomas', () => {
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
    for (const achievement of ACHIEVEMENTS) {
      expect(Object.values(achievement.title).every((title) => title.trim().length > 0)).toBe(true);
    }
  });

  it('la meta de letras básicas coincide con las filas básicas de cada silabario', () => {
    for (const rows of [HIRAGANA_ROWS, KATAKANA_ROWS]) {
      const count = rows.filter((row) => row.section === 'basic').flatMap((row) => row.units).length;
      expect(count).toBe(BASIC_LETTER_COUNT);
    }
  });
});

describe('computeMetrics', () => {
  it('cuenta palabras afianzadas una sola vez aunque estén en ambos modos', () => {
    const stats: StatsMap = {
      'hiragana:words:read:ねこ': mastered,
      'hiragana:words:write:ねこ': mastered,
      'katakana:words:read:パン': mastered,
      'hiragana:words:read:いぬ': learning,
      'ねこ': mastered,
    };
    expect(computeMetrics(EMPTY_LIFETIME, stats).wordsLearned).toBe(2);
  });

  it('cuenta solo letras básicas afianzadas en modo Letras', () => {
    const stats: StatsMap = {
      'hiragana:kana:read:あ': mastered,
      'hiragana:kana:write:あ': mastered,
      'hiragana:kana:read:か': mastered,
      'hiragana:kana:read:が': mastered,
      'hiragana:words:read:い': mastered,
      'katakana:kana:read:ア': mastered,
    };
    const metrics = computeMetrics(EMPTY_LIFETIME, stats);
    expect(metrics.hiraganaBasic).toBe(2);
    expect(metrics.katakanaBasic).toBe(1);
  });

  it('deriva modos, silabarios y oraciones de las combinaciones practicadas', () => {
    const lifetime = {
      ...EMPTY_LIFETIME,
      roundsCompleted: 4,
      practiced: ['hiragana:words:read', 'hiragana:kana:read', 'katakana:sentences:read'],
    };
    expect(computeMetrics(lifetime, {})).toMatchObject({
      rounds: 4,
      modesPracticed: 1,
      scriptsPracticed: 2,
      sentenceRounds: 1,
    });
  });
});

describe('evaluateAchievements', () => {
  const now = new Date('2026-10-07T12:00:00Z');

  it('desbloquea lo alcanzado y lo informa como nuevo', () => {
    const result = evaluateAchievements({ ...zero, rounds: 10, bestStreak: 3 }, {}, now);
    expect(result.newly.map((a) => a.id)).toEqual(['rounds-1', 'rounds-10', 'streak-3']);
    expect(result.unlocked['rounds-10']).toBe(now.toISOString());
  });

  it('no vuelve a informar logros ya desbloqueados ni los bloquea si la métrica baja', () => {
    const previous = { 'words-10': '2026-01-01T00:00:00.000Z' };
    const result = evaluateAchievements({ ...zero, wordsLearned: 3 }, previous, now);
    expect(result.newly).toEqual([]);
    expect(result.unlocked).toBe(previous);
  });
});

describe('nextAchievement', () => {
  it('elige el bloqueado más cercano a la meta', () => {
    const progress = achievementProgress({ ...zero, rounds: 8, wordsLearned: 3 }, { 'rounds-1': 'x' });
    expect(nextAchievement(progress)?.achievement.id).toBe('rounds-10');
  });

  it('devuelve null cuando está todo desbloqueado', () => {
    const all = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, 'x']));
    expect(nextAchievement(achievementProgress(zero, all))).toBeNull();
  });
});

describe('logros de tiempo de estudio', () => {
  it('suma minutos de todas las fuentes y la racha de metas', () => {
    const today = new Date();
    const day = (offset: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - offset);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    const entries = [0, 1, 2].map((offset) => ({
      id: String(offset), day: day(offset), categoryId: 'reading', seconds: 1800, source: 'manual' as const, createdAt: '',
    }));
    const metrics = computeMetrics(EMPTY_LIFETIME, {}, entries, 30);
    expect(metrics.studyMinutes).toBe(90);
    expect(metrics.goalStreak).toBe(3);
    const ids = evaluateAchievements(metrics, {}).newly.map((a) => a.id);
    expect(ids).toContain('time-1h');
    expect(ids).not.toContain('goal-7');
  });
});

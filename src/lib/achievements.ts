/**
 * Métricas y evaluación de logros. Todo es puro: recibe el historial y las stats, y devuelve qué logros
 * quedan desbloqueados. La persistencia de los desbloqueos está al final del archivo.
 */
import { ACHIEVEMENTS, type Achievement, type AchievementMetric } from '../data/achievements';
import { HIRAGANA_ROWS, KATAKANA_ROWS, type KanaRow } from '../data/kana';
import { parseStatKey } from './insights';
import { isMastered } from './session';
import type { Lifetime, StatsMap } from './storage';

export type AchievementMetrics = Record<AchievementMetric, number>;

function basicLetters(rows: KanaRow[]): Set<string> {
  return new Set(rows.filter((row) => row.section === 'basic').flatMap((row) => row.units.map((unit) => unit.kana)));
}

const HIRAGANA_BASIC = basicLetters(HIRAGANA_ROWS);
const KATAKANA_BASIC = basicLetters(KATAKANA_ROWS);

export function computeMetrics(lifetime: Lifetime, stats: StatsMap): AchievementMetrics {
  const words = new Set<string>();
  const hiragana = new Set<string>();
  const katakana = new Set<string>();

  for (const [rawKey, stat] of Object.entries(stats)) {
    const key = parseStatKey(rawKey);
    if (!key || !isMastered(stat)) continue;
    // Una palabra cuenta una vez aunque esté afianzada en Leer y en Escribir.
    if (key.kind === 'words') words.add(`${key.script}:${key.kana}`);
    if (key.kind === 'kana' && key.script === 'hiragana' && HIRAGANA_BASIC.has(key.kana)) hiragana.add(key.kana);
    if (key.kind === 'kana' && key.script === 'katakana' && KATAKANA_BASIC.has(key.kana)) katakana.add(key.kana);
  }

  const practiced = lifetime.practiced.map((combo) => combo.split(':'));
  return {
    rounds: lifetime.roundsCompleted,
    bestStreak: lifetime.bestStreak,
    wordsLearned: words.size,
    perfectRounds: lifetime.perfectRounds,
    hiraganaBasic: hiragana.size,
    katakanaBasic: katakana.size,
    modesPracticed: new Set(practiced.map(([, , mode]) => mode)).size,
    scriptsPracticed: new Set(practiced.map(([script]) => script)).size,
    sentenceRounds: practiced.some(([, kind]) => kind === 'sentences') ? 1 : 0,
  };
}

export interface AchievementProgress {
  achievement: Achievement;
  /** Progreso actual, limitado a la meta. */
  current: number;
  unlockedAt: string | null;
}

/** id del logro → fecha ISO en que se desbloqueó. */
export type UnlockedAchievements = Record<string, string>;

export function achievementProgress(metrics: AchievementMetrics, unlocked: UnlockedAchievements): AchievementProgress[] {
  return ACHIEVEMENTS.map((achievement) => ({
    achievement,
    current: Math.min(metrics[achievement.metric], achievement.target),
    unlockedAt: unlocked[achievement.id] ?? null,
  }));
}

/**
 * Desbloquea los logros cuya meta se alcanzó. Un logro desbloqueado nunca se vuelve a bloquear,
 * aunque la métrica baje (por ejemplo, si una palabra afianzada se falla después).
 */
export function evaluateAchievements(
  metrics: AchievementMetrics,
  unlocked: UnlockedAchievements,
  now = new Date(),
): { unlocked: UnlockedAchievements; newly: Achievement[] } {
  const newly = ACHIEVEMENTS.filter(
    (achievement) => !unlocked[achievement.id] && metrics[achievement.metric] >= achievement.target,
  );
  if (newly.length === 0) return { unlocked, newly };
  const stamp = now.toISOString();
  return {
    unlocked: { ...unlocked, ...Object.fromEntries(newly.map((achievement) => [achievement.id, stamp])) },
    newly,
  };
}

/** El logro bloqueado más cercano a completarse, para motivar el próximo paso. */
export function nextAchievement(progress: AchievementProgress[]): AchievementProgress | null {
  const locked = progress.filter((entry) => !entry.unlockedAt);
  if (locked.length === 0) return null;
  return [...locked].sort((a, b) => {
    const ratio = (entry: AchievementProgress) => entry.current / entry.achievement.target;
    return ratio(b) - ratio(a) || a.achievement.target - b.achievement.target;
  })[0];
}

const ACHIEVEMENTS_KEY = 'wordgana:achievements:v1';

export function loadUnlocked(): UnlockedAchievements {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(([, value]) => typeof value === 'string'),
    ) as UnlockedAchievements;
  } catch {
    return {};
  }
}

export function saveUnlocked(unlocked: UnlockedAchievements): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
  } catch {
    // Sin persistencia esta sesión.
  }
}

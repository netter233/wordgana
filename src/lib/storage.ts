/**
 * Persistencia en localStorage. Cualquier lectura/escritura puede fallar (modo privado de
 * Safari, cuota agotada, storage bloqueado) — nunca debe tirar abajo la app, solo perder la
 * persistencia para esa sesión.
 */
import type { PracticeMode } from './kana';
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';

const SETTINGS_KEY = 'wordgana:settings:v2';
const LEGACY_SETTINGS_KEY = 'wordgana:settings:v1';

export interface Settings {
  activeScript: KanaScript;
  enabledRowIds: Record<KanaScript, string[]>;
  mode: Record<KanaScript, PracticeMode>;
  practiceKind: Record<KanaScript, PracticeKind>;
}

export const DEFAULT_SETTINGS: Settings = {
  activeScript: 'hiragana',
  enabledRowIds: { hiragana: ['a'], katakana: ['a'] },
  mode: { hiragana: 'read', katakana: 'read' },
  practiceKind: { hiragana: 'words', katakana: 'words' },
};

function stringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value)
    ? value.filter((id): id is string => typeof id === 'string')
    : fallback;
}

function practiceMode(value: unknown): PracticeMode {
  return value === 'write' ? 'write' : 'read';
}

function practiceKind(value: unknown): PracticeKind {
  return value === 'sentences' ? 'sentences' : 'words';
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (!legacyRaw) return DEFAULT_SETTINGS;
      const legacy = JSON.parse(legacyRaw) as { enabledRowIds?: unknown; mode?: unknown };
      return {
        ...DEFAULT_SETTINGS,
        enabledRowIds: {
          hiragana: stringArray(legacy.enabledRowIds, DEFAULT_SETTINGS.enabledRowIds.hiragana),
          katakana: DEFAULT_SETTINGS.enabledRowIds.katakana,
        },
        mode: {
          hiragana: practiceMode(legacy.mode),
          katakana: DEFAULT_SETTINGS.mode.katakana,
        },
      };
    }
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      activeScript: parsed.activeScript === 'katakana' ? 'katakana' : 'hiragana',
      enabledRowIds: {
        hiragana: stringArray(parsed.enabledRowIds?.hiragana, DEFAULT_SETTINGS.enabledRowIds.hiragana),
        katakana: stringArray(parsed.enabledRowIds?.katakana, DEFAULT_SETTINGS.enabledRowIds.katakana),
      },
      mode: {
        hiragana: practiceMode(parsed.mode?.hiragana),
        katakana: practiceMode(parsed.mode?.katakana),
      },
      practiceKind: {
        hiragana: practiceKind(parsed.practiceKind?.hiragana),
        katakana: practiceKind(parsed.practiceKind?.katakana),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Sin persistencia esta sesión; la app sigue funcionando en memoria.
  }
}

const STATS_KEY = 'wordgana:stats:v1';

export interface WordStat {
  seen: number;
  missed: number;
  /** Aciertos consecutivos recientes. Dos o más indican que el ítem está afianzado. */
  correctStreak?: number;
  lastAnsweredAt?: string;
}

/** Estadísticas por ítem y contexto de práctica. Las claves antiguas por kana siguen siendo legibles. */
export type StatsMap = Record<string, WordStat>;

export function loadStats(): StatsMap {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as StatsMap) : {};
  } catch {
    return {};
  }
}

export function saveStats(stats: StatsMap): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Sin persistencia esta sesión; la app sigue funcionando en memoria.
  }
}

/** Devuelve un StatsMap nuevo con el resultado de responder `kana` sumado (no muta `stats`). */
export function recordAnswer(
  stats: StatsMap,
  key: string,
  correct: boolean,
  now = new Date(),
): StatsMap {
  const prev = stats[key] ?? { seen: 0, missed: 0 };
  const previousStreak = prev.correctStreak ?? (prev.missed === 0 ? prev.seen : 0);
  return {
    ...stats,
    [key]: {
      seen: prev.seen + 1,
      missed: prev.missed + (correct ? 0 : 1),
      correctStreak: correct ? previousStreak + 1 : 0,
      lastAnsweredAt: now.toISOString(),
    },
  };
}

const PROGRESS_KEY = 'wordgana:progress:v1';

export interface Progress {
  /** Último día con una ronda terminada (YYYY-MM-DD). Vacío si nunca se terminó una. */
  lastDay: string;
  streak: number;
  roundsToday: number;
}

export const EMPTY_PROGRESS: Progress = { lastDay: '', streak: 0, roundsToday: 0 };

/** Día en hora local: la racha se corta a la medianoche del teléfono, no en UTC. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function previousDayKey(date: Date): string {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return dayKey(previous);
}

/**
 * Pone el progreso guardado al día: las rondas de hoy vuelven a cero al cambiar el día, y la racha
 * se pierde solo si pasó más de un día sin practicar (si la última fue ayer sigue viva, sin sumar).
 */
export function normalizeProgress(progress: Progress, now = new Date()): Progress {
  if (progress.lastDay === dayKey(now)) return progress;
  if (progress.lastDay === previousDayKey(now)) return { ...progress, roundsToday: 0 };
  return EMPTY_PROGRESS;
}

/** Suma una ronda terminada, extendiendo la racha si la última fue ayer y arrancándola si no. */
export function recordRound(progress: Progress, now = new Date()): Progress {
  const today = dayKey(now);
  if (progress.lastDay === today) {
    return { ...progress, roundsToday: progress.roundsToday + 1 };
  }
  const continues = progress.lastDay === previousDayKey(now);
  return { lastDay: today, streak: continues ? progress.streak + 1 : 1, roundsToday: 1 };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return normalizeProgress({
      lastDay: typeof parsed.lastDay === 'string' ? parsed.lastDay : '',
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      roundsToday: typeof parsed.roundsToday === 'number' ? parsed.roundsToday : 0,
    });
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Sin persistencia esta sesión; la app sigue funcionando en memoria.
  }
}

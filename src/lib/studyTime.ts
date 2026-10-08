/**
 * Registro del tiempo dedicado al japonés: automático al practicar en WordGana, con cronómetro o cargado a
 * mano. El tiempo automático se agrupa en un registro por día y categoría para que el historial no se llene
 * de rondas sueltas. Todo es puro salvo la persistencia del final del archivo.
 */
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';
import { dayKey } from './storage';

export type EntrySource = 'auto' | 'timer' | 'manual';

export interface StudyEntry {
  id: string;
  /** Día local, YYYY-MM-DD. */
  day: string;
  categoryId: string;
  seconds: number;
  source: EntrySource;
  /** Rondas terminadas, solo en registros automáticos. */
  rounds?: number;
  note?: string;
  createdAt: string;
}

/** Tope de tiempo que puede sumar una sola pregunta: si te distraés, no se cuenta como práctica. */
export const MAX_SECONDS_PER_ANSWER = 90;

export function practiceCategoryId(script: KanaScript, kind: PracticeKind): string {
  return `practice:${script}:${kind}`;
}

/** Segundos activos entre dos eventos de práctica, con el tope por pregunta. */
export function activeDelta(fromMs: number, toMs: number): number {
  const seconds = (toMs - fromMs) / 1000;
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.min(seconds, MAX_SECONDS_PER_ANSWER);
}

/** Suma tiempo de práctica al registro automático del día para esa categoría (no muta `entries`). */
export function addAutoTime(
  entries: readonly StudyEntry[],
  categoryId: string,
  seconds: number,
  now = new Date(),
  rounds = 0,
): StudyEntry[] {
  if (seconds <= 0 && rounds <= 0) return [...entries];
  const round = (value: number) => Math.round(value * 10) / 10;
  const day = dayKey(now);
  const id = `auto:${day}:${categoryId}`;
  const existing = entries.find((entry) => entry.id === id);
  if (!existing) {
    return [
      ...entries,
      { id, day, categoryId, seconds: round(seconds), source: 'auto', rounds, createdAt: now.toISOString() },
    ];
  }
  return entries.map((entry) => (entry.id === id
    ? { ...entry, seconds: round(entry.seconds + seconds), rounds: (entry.rounds ?? 0) + rounds }
    : entry));
}

const STUDY_KEY = 'wordgana:study:v1';

function isEntry(value: unknown): value is StudyEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<StudyEntry>;
  return typeof entry.id === 'string'
    && typeof entry.day === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(entry.day)
    && typeof entry.categoryId === 'string'
    && typeof entry.seconds === 'number'
    && Number.isFinite(entry.seconds)
    && entry.seconds >= 0
    && (entry.source === 'auto' || entry.source === 'timer' || entry.source === 'manual');
}

export function loadStudyEntries(): StudyEntry[] {
  try {
    const raw = localStorage.getItem(STUDY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

export function saveStudyEntries(entries: readonly StudyEntry[]): void {
  try {
    localStorage.setItem(STUDY_KEY, JSON.stringify(entries));
  } catch {
    // Sin persistencia esta sesión.
  }
}

export interface RunningTimer {
  categoryId: string;
  startedAt: string;
}

const TIMER_KEY = 'wordgana:study-timer:v1';

/** Cronómetro en marcha. Se guarda el inicio, así sigue contando aunque se cierre la app. */
export function loadTimer(): RunningTimer | null {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RunningTimer>;
    return typeof parsed.categoryId === 'string' && typeof parsed.startedAt === 'string'
      && !Number.isNaN(Date.parse(parsed.startedAt))
      ? { categoryId: parsed.categoryId, startedAt: parsed.startedAt }
      : null;
  } catch {
    return null;
  }
}

export function saveTimer(timer: RunningTimer | null): void {
  try {
    if (timer) localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
    else localStorage.removeItem(TIMER_KEY);
  } catch {
    // Sin persistencia esta sesión.
  }
}

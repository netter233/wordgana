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

// --- Totales -------------------------------------------------------------------------------------

function shiftDay(day: string, offset: number): string {
  const [year, month, date] = day.split('-').map(Number);
  return dayKey(new Date(year, month - 1, date + offset));
}

export function secondsOnDay(entries: readonly StudyEntry[], day: string): number {
  return entries.reduce((sum, entry) => (entry.day === day ? sum + entry.seconds : sum), 0);
}

export function totalSeconds(entries: readonly StudyEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.seconds, 0);
}

/** Totales de los últimos `days` días, del más viejo a hoy (incluye días en cero). */
export function totalsByDay(
  entries: readonly StudyEntry[],
  days: number,
  today = new Date(),
): Array<{ day: string; seconds: number }> {
  const todayKey = dayKey(today);
  const byDay = new Map<string, number>();
  for (const entry of entries) byDay.set(entry.day, (byDay.get(entry.day) ?? 0) + entry.seconds);
  return Array.from({ length: days }, (_, index) => {
    const day = shiftDay(todayKey, index - days + 1);
    return { day, seconds: byDay.get(day) ?? 0 };
  });
}

/** Totales por categoría desde `sinceDay` inclusive (o de todo el historial), de mayor a menor. */
export function totalsByCategory(
  entries: readonly StudyEntry[],
  sinceDay: string | null = null,
): Array<{ categoryId: string; seconds: number }> {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    if (sinceDay && entry.day < sinceDay) continue;
    totals.set(entry.categoryId, (totals.get(entry.categoryId) ?? 0) + entry.seconds);
  }
  return [...totals.entries()]
    .filter(([, seconds]) => seconds > 0)
    .map(([categoryId, seconds]) => ({ categoryId, seconds }))
    .sort((a, b) => b.seconds - a.seconds);
}

/** Primer día del rango de los últimos `days` días, incluido hoy. */
export function rangeStart(days: number, today = new Date()): string {
  return shiftDay(dayKey(today), -(days - 1));
}

/**
 * Días seguidos con la meta cumplida. Hoy suma si ya se cumplió, pero no corta la racha si todavía no:
 * el día no terminó.
 */
export function goalStreak(entries: readonly StudyEntry[], goalMinutes: number, today = new Date()): number {
  if (goalMinutes <= 0) return 0;
  const goal = goalMinutes * 60;
  const todayKey = dayKey(today);
  let day = secondsOnDay(entries, todayKey) >= goal ? todayKey : shiftDay(todayKey, -1);
  let streak = 0;
  while (secondsOnDay(entries, day) >= goal) {
    streak += 1;
    day = shiftDay(day, -1);
  }
  return streak;
}

/** Minutos enteros para mostrar; un rato de menos de un minuto cuenta como 1 para no mostrar "0 min". */
export function displayMinutes(seconds: number): number {
  if (seconds <= 0) return 0;
  return Math.max(1, Math.round(seconds / 60));
}

// --- Meta diaria ---------------------------------------------------------------------------------

export const GOAL_OPTIONS = [0, 10, 15, 20, 30, 45, 60, 90];

const GOAL_KEY = 'wordgana:study-goal:v1';

export function loadGoal(): number {
  try {
    const value = Number(localStorage.getItem(GOAL_KEY));
    return GOAL_OPTIONS.includes(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function saveGoal(minutes: number): void {
  try {
    localStorage.setItem(GOAL_KEY, String(minutes));
  } catch {
    // Sin persistencia esta sesión.
  }
}

// --- Registros manuales y de cronómetro ----------------------------------------------------------

export const MAX_ENTRY_MINUTES = 720;
/** Pasado este tiempo, al detener el cronómetro se sugiere revisar la duración (¿te olvidaste de pararlo?). */
export const LONG_TIMER_SECONDS = 4 * 60 * 60;

function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  } catch {
    // Sigue con el respaldo.
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface EntryInput {
  categoryId: string;
  day: string;
  minutes: number;
  note?: string;
}

export type EntryError = 'duration' | 'day' | 'category';

/** Valida una carga: duración entre 1 y 720 min, día válido y no futuro, y una categoría elegida. */
export function validateEntry(input: EntryInput, today = new Date()): EntryError | null {
  if (!input.categoryId) return 'category';
  if (!Number.isFinite(input.minutes) || input.minutes < 1 || input.minutes > MAX_ENTRY_MINUTES) return 'duration';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.day) || input.day > dayKey(today)) return 'day';
  return null;
}

export function addEntry(
  entries: readonly StudyEntry[],
  input: EntryInput,
  source: Exclude<EntrySource, 'auto'>,
  now = new Date(),
): StudyEntry[] {
  const note = input.note?.trim();
  return [
    ...entries,
    {
      id: newId(),
      day: input.day,
      categoryId: input.categoryId,
      seconds: Math.round(input.minutes) * 60,
      source,
      ...(note ? { note } : {}),
      createdAt: now.toISOString(),
    },
  ];
}

/** Edita un registro manual o de cronómetro. Los automáticos no se editan: reflejan lo practicado. */
export function updateEntry(entries: readonly StudyEntry[], id: string, input: EntryInput): StudyEntry[] {
  const note = input.note?.trim();
  return entries.map((entry) => {
    if (entry.id !== id || entry.source === 'auto') return entry;
    const { note: _previous, ...rest } = entry;
    return {
      ...rest,
      day: input.day,
      categoryId: input.categoryId,
      seconds: Math.round(input.minutes) * 60,
      ...(note ? { note } : {}),
    };
  });
}

export function deleteEntry(entries: readonly StudyEntry[], id: string): StudyEntry[] {
  return entries.filter((entry) => entry.id !== id);
}

/** Segundos transcurridos desde que arrancó el cronómetro. */
export function timerElapsed(timer: RunningTimer, now = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - Date.parse(timer.startedAt)) / 1000));
}

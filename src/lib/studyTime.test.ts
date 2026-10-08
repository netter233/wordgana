import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_SECONDS_PER_ANSWER,
  activeDelta,
  addAutoTime,
  addEntry,
  deleteEntry,
  displayMinutes,
  goalStreak,
  groupByDay,
  loadGoal,
  loadStudyEntries,
  practiceCategoryId,
  rangeStart,
  saveGoal,
  saveStudyEntries,
  totalsByCategory,
  timerElapsed,
  totalsByDay,
  updateEntry,
  validateEntry,
  type StudyEntry,
} from './studyTime';

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  });
});

const morning = new Date(2026, 9, 8, 9, 0);
const evening = new Date(2026, 9, 8, 21, 0);
const tomorrow = new Date(2026, 9, 9, 10, 0);

describe('activeDelta', () => {
  it('cuenta los segundos entre eventos con un tope por pregunta', () => {
    expect(activeDelta(0, 12_000)).toBe(12);
    expect(activeDelta(0, 10 * 60_000)).toBe(MAX_SECONDS_PER_ANSWER);
  });

  it('ignora intervalos negativos o inválidos', () => {
    expect(activeDelta(5_000, 1_000)).toBe(0);
    expect(activeDelta(Number.NaN, 1_000)).toBe(0);
  });
});

describe('addAutoTime', () => {
  const words = practiceCategoryId('hiragana', 'words');

  it('agrupa el tiempo del mismo día y categoría en un solo registro', () => {
    let entries = addAutoTime([], words, 30, morning);
    entries = addAutoTime(entries, words, 45, evening, 1);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ day: '2026-10-08', categoryId: words, seconds: 75, rounds: 1, source: 'auto' });
  });

  it('separa por categoría y por día', () => {
    let entries = addAutoTime([], words, 30, morning);
    entries = addAutoTime(entries, practiceCategoryId('katakana', 'kana'), 20, morning);
    entries = addAutoTime(entries, words, 10, tomorrow);
    expect(entries.map((entry) => [entry.day, entry.categoryId, entry.seconds])).toEqual([
      ['2026-10-08', 'practice:hiragana:words', 30],
      ['2026-10-08', 'practice:katakana:kana', 20],
      ['2026-10-09', 'practice:hiragana:words', 10],
    ]);
  });

  it('no crea registros vacíos y no muta el arreglo original', () => {
    const original = addAutoTime([], words, 30, morning);
    expect(addAutoTime([], words, 0, morning)).toEqual([]);
    const next = addAutoTime(original, words, 5, morning);
    expect(original[0].seconds).toBe(30);
    expect(next[0].seconds).toBe(35);
  });
});

describe('persistencia', () => {
  it('guarda y recupera, descartando registros inválidos', () => {
    const entries = addAutoTime([], practiceCategoryId('hiragana', 'kana'), 42, morning, 1);
    saveStudyEntries(entries);
    expect(loadStudyEntries()).toEqual(entries);
    store.set('wordgana:study:v1', JSON.stringify([...entries, { id: 'x', day: 'ayer', seconds: 5 }]));
    expect(loadStudyEntries()).toEqual(entries);
  });
});

const entry = (day: string, categoryId: string, minutes: number): StudyEntry => ({
  id: `${day}:${categoryId}`, day, categoryId, seconds: minutes * 60, source: 'manual', createdAt: '',
});

describe('totales', () => {
  const today = new Date(2026, 9, 8, 12);
  const entries = [
    entry('2026-10-08', 'listening', 20),
    entry('2026-10-08', 'practice:hiragana:words', 10),
    entry('2026-10-06', 'listening', 15),
    entry('2026-09-01', 'reading', 60),
  ];

  it('totalsByDay devuelve todos los días del rango, del más viejo a hoy', () => {
    expect(totalsByDay(entries, 3, today)).toEqual([
      { day: '2026-10-06', seconds: 900 },
      { day: '2026-10-07', seconds: 0 },
      { day: '2026-10-08', seconds: 1800 },
    ]);
  });

  it('totalsByDay cruza meses correctamente', () => {
    expect(totalsByDay([], 3, new Date(2026, 10, 1)).map((d) => d.day)).toEqual(['2026-10-30', '2026-10-31', '2026-11-01']);
  });

  it('totalsByCategory ordena de mayor a menor y respeta el rango', () => {
    expect(totalsByCategory(entries)).toEqual([
      { categoryId: 'reading', seconds: 3600 },
      { categoryId: 'listening', seconds: 2100 },
      { categoryId: 'practice:hiragana:words', seconds: 600 },
    ]);
    expect(totalsByCategory(entries, rangeStart(7, today)).map((t) => t.categoryId)).toEqual(['listening', 'practice:hiragana:words']);
  });
});

describe('goalStreak', () => {
  const today = new Date(2026, 9, 8, 12);
  const met = [entry('2026-10-06', 'a', 30), entry('2026-10-07', 'a', 20), entry('2026-10-07', 'b', 15)];

  it('cuenta días seguidos con la meta cumplida sumando categorías', () => {
    expect(goalStreak(met, 30, today)).toBe(2);
  });

  it('hoy suma si ya se cumplió y no corta la racha si todavía no', () => {
    expect(goalStreak([...met, entry('2026-10-08', 'a', 30)], 30, today)).toBe(3);
    expect(goalStreak([...met, entry('2026-10-08', 'a', 5)], 30, today)).toBe(2);
  });

  it('sin meta no hay racha', () => {
    expect(goalStreak(met, 0, today)).toBe(0);
  });
});

describe('displayMinutes y meta', () => {
  it('redondea y muestra al menos 1 minuto si hubo práctica', () => {
    expect(displayMinutes(0)).toBe(0);
    expect(displayMinutes(20)).toBe(1);
    expect(displayMinutes(150)).toBe(3);
  });

  it('la meta solo acepta opciones válidas', () => {
    expect(loadGoal()).toBe(0);
    saveGoal(30);
    expect(loadGoal()).toBe(30);
    store.set('wordgana:study-goal:v1', '37');
    expect(loadGoal()).toBe(0);
  });
});

describe('registros manuales', () => {
  const today = new Date(2026, 9, 8, 12);
  const input = { categoryId: 'listening', day: '2026-10-08', minutes: 30, note: '  podcast  ' };

  it('valida duración, día y categoría', () => {
    expect(validateEntry(input, today)).toBeNull();
    expect(validateEntry({ ...input, minutes: 0 }, today)).toBe('duration');
    expect(validateEntry({ ...input, minutes: 721 }, today)).toBe('duration');
    expect(validateEntry({ ...input, day: '2026-10-09' }, today)).toBe('day');
    expect(validateEntry({ ...input, day: 'ayer' }, today)).toBe('day');
    expect(validateEntry({ ...input, categoryId: '' }, today)).toBe('category');
  });

  it('agrega, edita y borra registros', () => {
    const [created] = addEntry([], input, 'manual', today);
    expect(created).toMatchObject({ categoryId: 'listening', seconds: 1800, source: 'manual', note: 'podcast' });
    const [edited] = updateEntry([created], created.id, { ...input, minutes: 45, note: '' });
    expect(edited.seconds).toBe(2700);
    expect(edited.note).toBeUndefined();
    expect(deleteEntry([created], created.id)).toEqual([]);
  });

  it('no edita registros automáticos', () => {
    const auto = addAutoTime([], 'practice:hiragana:words', 60, today);
    expect(updateEntry(auto, auto[0].id, input)).toEqual(auto);
  });

  it('calcula el tiempo del cronómetro', () => {
    expect(timerElapsed({ categoryId: 'reading', startedAt: new Date(2026, 9, 8, 11, 30).toISOString() }, today)).toBe(1800);
  });
});

describe('groupByDay', () => {
  it('agrupa por día del más nuevo al más viejo y ordena por duración', () => {
    const groups = groupByDay([
      entry('2026-10-06', 'a', 10),
      entry('2026-10-08', 'b', 5),
      entry('2026-10-08', 'c', 20),
      { ...entry('2026-10-07', 'auto', 0), seconds: 0 },
    ]);
    expect(groups.map((g) => [g.day, g.seconds, g.entries.map((e) => e.categoryId)])).toEqual([
      ['2026-10-08', 1500, ['c', 'b']],
      ['2026-10-06', 600, ['a']],
    ]);
  });
});

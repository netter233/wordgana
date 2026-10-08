import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_SECONDS_PER_ANSWER,
  activeDelta,
  addAutoTime,
  loadStudyEntries,
  practiceCategoryId,
  saveStudyEntries,
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

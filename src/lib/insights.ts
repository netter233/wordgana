/**
 * Estadísticas derivadas de las respuestas guardadas (`StatsMap`). Las claves tienen la forma
 * `${script}:${kind}:${mode}:${kana}`; las claves antiguas de versiones previas se ignoran.
 */
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';
import { tryTokenize, type PracticeMode } from './kana';
import type { StatsMap, WordStat } from './storage';

export interface ParsedStatKey {
  script: KanaScript;
  kind: PracticeKind;
  mode: PracticeMode;
  kana: string;
}

const KINDS: readonly string[] = ['kana', 'words', 'sentences'];

export function parseStatKey(key: string): ParsedStatKey | null {
  const [script, kind, mode, ...rest] = key.split(':');
  const kana = rest.join(':');
  if (script !== 'hiragana' && script !== 'katakana') return null;
  if (!KINDS.includes(kind)) return null;
  if (mode !== 'read' && mode !== 'write') return null;
  if (!kana) return null;
  return { script, kind: kind as PracticeKind, mode, kana };
}

function parsedEntries(stats: StatsMap): Array<[ParsedStatKey, WordStat]> {
  return Object.entries(stats).flatMap(([key, stat]) => {
    const parsed = parseStatKey(key);
    return parsed ? [[parsed, stat] as [ParsedStatKey, WordStat]] : [];
  });
}

export interface Tally {
  answers: number;
  correct: number;
}

export function accuracy(tally: Tally): number {
  return tally.answers > 0 ? Math.round((tally.correct / tally.answers) * 100) : 0;
}

function add(tally: Tally, stat: WordStat) {
  tally.answers += stat.seen;
  tally.correct += Math.max(0, stat.seen - stat.missed);
}

/** Respuestas y aciertos de todo el historial, en ambos silabarios. */
export function totalTally(stats: StatsMap): Tally {
  const tally = { answers: 0, correct: 0 };
  for (const [, stat] of parsedEntries(stats)) add(tally, stat);
  return tally;
}

export function tallyByMode(stats: StatsMap, script: KanaScript): Record<PracticeMode, Tally> {
  const result = { read: { answers: 0, correct: 0 }, write: { answers: 0, correct: 0 } };
  for (const [key, stat] of parsedEntries(stats)) {
    if (key.script === script) add(result[key.mode], stat);
  }
  return result;
}

export interface Difficulty {
  /** Letra (o palabra) en kana. */
  kana: string;
  seen: number;
  missed: number;
  /** Porcentaje de respuestas incorrectas, 0–100. */
  errorRate: number;
}

function ranked(map: Map<string, { seen: number; missed: number }>, minSeen: number, limit: number): Difficulty[] {
  return [...map.entries()]
    .filter(([, value]) => value.seen >= minSeen && value.missed > 0)
    .map(([kana, value]) => ({
      kana,
      seen: value.seen,
      missed: value.missed,
      errorRate: Math.round((value.missed / value.seen) * 100),
    }))
    .sort((a, b) => b.errorRate - a.errorRate || b.missed - a.missed || a.kana.localeCompare(b.kana))
    .slice(0, limit);
}

/**
 * Letras que más cuestan. Cada respuesta a una palabra u oración cuenta para todas las letras que la
 * forman (una vez por letra distinta), así un error en さかな suma a さ, か y な.
 */
export function hardestLetters(stats: StatsMap, script: KanaScript, limit = 8, minSeen = 3): Difficulty[] {
  const sokuon = script === 'hiragana' ? 'っ' : 'ッ';
  const totals = new Map<string, { seen: number; missed: number }>();
  for (const [key, stat] of parsedEntries(stats)) {
    if (key.script !== script) continue;
    const tokens = tryTokenize(key.kana.replace(/[\s、。！？!?,.]/g, ''));
    if (!tokens) continue;
    const letters = new Set(tokens.map((token) => (
      token.type === 'unit' ? token.unit.kana : token.type === 'sokuon' ? sokuon : 'ー'
    )));
    for (const letter of letters) {
      const current = totals.get(letter) ?? { seen: 0, missed: 0 };
      totals.set(letter, { seen: current.seen + stat.seen, missed: current.missed + stat.missed });
    }
  }
  return ranked(totals, minSeen, limit);
}

/** Palabras con más errores, sumando Leer y Escribir. */
export function hardestWords(stats: StatsMap, script: KanaScript, limit = 6, minSeen = 1): Difficulty[] {
  const totals = new Map<string, { seen: number; missed: number }>();
  for (const [key, stat] of parsedEntries(stats)) {
    if (key.script !== script || key.kind !== 'words') continue;
    const current = totals.get(key.kana) ?? { seen: 0, missed: 0 };
    totals.set(key.kana, { seen: current.seen + stat.seen, missed: current.missed + stat.missed });
  }
  return ranked(totals, minSeen, limit);
}

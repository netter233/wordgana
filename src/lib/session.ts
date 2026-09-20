/**
 * Arma la ronda de práctica: hasta `count` palabras sin repetidos, tomadas del pool de palabras
 * elegibles. Los ítems fallados o todavía en aprendizaje pesan más para aparecer seguido,
 * usando muestreo ponderado sin reemplazo.
 */
import type { Word } from '../data/words';
import type { StatsMap } from './storage';

const NEEDS_REVIEW_WEIGHT = 4;
const LEARNING_WEIGHT = 2;
const BASE_WEIGHT = 1;

type StatKey = (word: Word) => string;

function statFor(wordsStats: StatsMap, word: Word, keyFor?: StatKey) {
  return wordsStats[keyFor?.(word) ?? word.kana] ?? wordsStats[word.kana];
}

function correctStreak(stat: StatsMap[string] | undefined): number {
  if (!stat) return 0;
  return stat.correctStreak ?? (stat.missed === 0 ? stat.seen : 0);
}

function practiceWeight(stat: StatsMap[string] | undefined): number {
  if (!stat) return BASE_WEIGHT;
  const streak = correctStreak(stat);
  if (streak === 0) return NEEDS_REVIEW_WEIGHT;
  if (streak === 1) return LEARNING_WEIGHT;
  return BASE_WEIGHT;
}

export function pickRound(
  words: readonly Word[],
  count: number,
  stats: StatsMap = {},
  random: () => number = Math.random,
  keyFor?: StatKey,
): Word[] {
  const pool = words.map((word) => ({
    word,
    weight: practiceWeight(statFor(stats, word, keyFor)),
  }));

  const result: Word[] = [];
  const n = Math.min(count, pool.length);

  while (result.length < n) {
    const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
    let r = random() * totalWeight;
    let chosenIndex = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].weight;
      if (r <= 0) {
        chosenIndex = i;
        break;
      }
    }
    result.push(pool[chosenIndex].word);
    pool.splice(chosenIndex, 1);
  }

  return result;
}

/** Palabras dominadas: contestadas al menos una vez y nunca falladas. */
export function countMastered(words: readonly Word[], stats: StatsMap, keyFor?: StatKey): number {
  return words.filter((word) => {
    return correctStreak(statFor(stats, word, keyFor)) >= 2;
  }).length;
}

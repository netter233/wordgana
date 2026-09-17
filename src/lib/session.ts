/**
 * Arma la ronda de práctica: hasta `count` palabras sin repetidos, tomadas del pool de palabras
 * elegibles. Las palabras falladas antes (según `stats`) pesan ×3 para aparecer más seguido,
 * usando muestreo ponderado sin reemplazo (sin generar todas las combinaciones posibles).
 */
import type { Word } from '../data/words';
import type { StatsMap } from './storage';

const MISSED_WEIGHT = 3;
const BASE_WEIGHT = 1;

export function pickRound(
  words: readonly Word[],
  count: number,
  stats: StatsMap = {},
  random: () => number = Math.random,
): Word[] {
  const pool = words.map((word) => ({
    word,
    weight: (stats[word.kana]?.missed ?? 0) > 0 ? MISSED_WEIGHT : BASE_WEIGHT,
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

import type { Word } from '../data/words';
import { toRomaji } from './kana';

export function readingFor(item: Word): string {
  return item.romaji ?? toRomaji(item.kana);
}

import type { KanaRow } from '../data/kana';
import type { Word } from '../data/words';

/**
 * Letras sueltas de las filas activas, como ítems de práctica. No tienen significado: el feedback
 * muestra solo kana y romaji. っ y ー no tienen unidades propias, así que no aportan letras.
 */
export function letterItems(rows: readonly KanaRow[], enabledRowIds: ReadonlySet<string>): Word[] {
  return rows
    .filter((row) => enabledRowIds.has(row.id))
    .flatMap((row) => row.units.map((unit) => ({ kana: unit.kana, es: '' })));
}

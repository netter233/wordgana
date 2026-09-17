/**
 * Lógica de kana: tokenización, generación de romaji canónico, validación de respuestas.
 *
 * El romaji nunca se guarda en los datos (ver src/data/words.ts): siempre se deriva de aquí,
 * a partir de la tabla de src/data/kana.ts, para tener una única fuente de verdad.
 */
import { KANA_ROWS, SOKUON, SOKUON_ROW_ID, type KanaUnit } from '../data/kana';

export type PracticeMode = 'read' | 'write';

interface IndexedUnit extends KanaUnit {
  rowId: string;
}

function buildUnitIndex(): Map<string, IndexedUnit> {
  const map = new Map<string, IndexedUnit>();
  for (const row of KANA_ROWS) {
    for (const unit of row.units) {
      map.set(unit.kana, { ...unit, rowId: row.id });
    }
  }
  return map;
}

const UNIT_INDEX = buildUnitIndex();

export type KanaToken = { type: 'unit'; unit: IndexedUnit } | { type: 'sokuon' };

/**
 * Divide una palabra en hiragana en sus unidades (きゃ, き, っ, ん, ...), matcheando primero
 * combinaciones de 2 caracteres (yōon) y después caracteres sueltos. Devuelve `null` si algún
 * carácter no es un hiragana conocido por la tabla (útil para validar datos).
 */
export function tryTokenize(kana: string): KanaToken[] | null {
  const tokens: KanaToken[] = [];
  let i = 0;
  while (i < kana.length) {
    const ch = kana[i];
    if (ch === SOKUON) {
      tokens.push({ type: 'sokuon' });
      i += 1;
      continue;
    }
    const two = kana.slice(i, i + 2);
    const twoUnit = two.length === 2 ? UNIT_INDEX.get(two) : undefined;
    if (twoUnit) {
      tokens.push({ type: 'unit', unit: twoUnit });
      i += 2;
      continue;
    }
    const oneUnit = UNIT_INDEX.get(ch);
    if (oneUnit) {
      tokens.push({ type: 'unit', unit: oneUnit });
      i += 1;
      continue;
    }
    return null;
  }
  return tokens;
}

/** Como tryTokenize, pero lanza si la palabra tiene algo que no es hiragana conocido. */
export function tokenize(kana: string): KanaToken[] {
  const tokens = tryTokenize(kana);
  if (!tokens) throw new Error(`No se pudo tokenizar como hiragana: "${kana}"`);
  return tokens;
}

/**
 * っ (sokuon) duplica la consonante inicial de la sílaba siguiente. Excepción de Hepburn:
 * antes de "ch" se escribe "tch", no "cch" (っちゃ → "tcha", como en "matcha").
 */
function doubleConsonant(romaji: string): string {
  if (romaji.startsWith('ch')) return 't' + romaji;
  return romaji[0] + romaji;
}

/**
 * Convierte la lista de tokens en grupos de variantes de romaji aceptadas por posición,
 * ya resolviendo el efecto de っ sobre la unidad siguiente.
 */
function tokensToVariantGroups(tokens: KanaToken[]): string[][] {
  const groups: string[][] = [];
  let pendingSokuon = false;
  for (const token of tokens) {
    if (token.type === 'sokuon') {
      pendingSokuon = true;
      continue;
    }
    const variants = [token.unit.romaji, ...(token.unit.variants ?? [])];
    groups.push(pendingSokuon ? variants.map(doubleConsonant) : variants);
    pendingSokuon = false;
  }
  return groups;
}

/** Romaji canónico (Hepburn) de una palabra en hiragana. */
export function toRomaji(kana: string): string {
  const groups = tokensToVariantGroups(tokenize(kana));
  return groups.map((group) => group[0]).join('');
}

const MACRONS: Record<string, string> = { ā: 'aa', ī: 'ii', ū: 'uu', ē: 'ee', ō: 'ou' };

function normalizeRomaji(input: string): string {
  return input
    .normalize('NFC')
    .toLowerCase()
    .trim()
    .replace(/[āīūēō]/g, (m) => MACRONS[m] ?? m)
    .replace(/\s+/g, '');
}

/** Backtracking simple: prueba cada variante posible en la posición actual antes de avanzar. */
function matchFrom(input: string, groups: string[][], groupIndex: number, pos: number): boolean {
  if (groupIndex === groups.length) return pos === input.length;
  for (const variant of groups[groupIndex]) {
    if (variant && input.startsWith(variant, pos)) {
      if (matchFrom(input, groups, groupIndex + 1, pos + variant.length)) return true;
    }
  }
  return false;
}

/** ¿El romaji tipeado por el usuario corresponde a esta palabra en hiragana? Acepta variantes. */
export function matchesRomaji(input: string, kanaWord: string): boolean {
  const tokens = tryTokenize(kanaWord);
  if (!tokens) return false;
  const normalized = normalizeRomaji(input);
  if (!normalized) return false;
  return matchFrom(normalized, tokensToVariantGroups(tokens), 0, 0);
}

const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const KATAKANA_TO_HIRAGANA_OFFSET = -0x60;

/** Normaliza una respuesta en hiragana: recorta espacios, pasa katakana a hiragana, NFKC. */
export function normalizeHiragana(input: string): string {
  const nfkc = input.normalize('NFKC').trim().replace(/\s+/g, '');
  let out = '';
  for (const ch of nfkc) {
    const code = ch.codePointAt(0)!;
    out += code >= KATAKANA_START && code <= KATAKANA_END
      ? String.fromCodePoint(code + KATAKANA_TO_HIRAGANA_OFFSET)
      : ch;
  }
  return out;
}

/** ¿Todas las unidades de esta palabra pertenecen a filas ya marcadas como aprendidas? */
export function isEligible(kanaWord: string, enabledRowIds: ReadonlySet<string> | readonly string[]): boolean {
  const enabled = enabledRowIds instanceof Set ? enabledRowIds : new Set(enabledRowIds);
  const tokens = tryTokenize(kanaWord);
  if (!tokens) return false;
  for (const token of tokens) {
    const rowId = token.type === 'sokuon' ? SOKUON_ROW_ID : token.unit.rowId;
    if (!enabled.has(rowId)) return false;
  }
  return true;
}

/**
 * Valida la respuesta del usuario para una palabra dada.
 * - Modo "read" (se muestra hiragana): acepta romaji o el propio hiragana (teclados con IME).
 * - Modo "write" (se muestra romaji): solo acepta hiragana.
 */
export function checkAnswer(input: string, wordKana: string, mode: PracticeMode): boolean {
  if (!input.trim()) return false;
  if (mode === 'write') {
    return normalizeHiragana(input) === wordKana;
  }
  if (normalizeHiragana(input) === wordKana) return true;
  return matchesRomaji(input, wordKana);
}

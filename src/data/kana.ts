/**
 * Filas del silabario hiragana. Cada fila es la unidad que el usuario marca como "ya aprendida"
 * en RowPicker. `units` son las combinaciones kana → romaji de esa fila, con `romaji` canónico
 * (Hepburn) y `variants` como otras formas de romaji que también se aceptan al tipear.
 *
 * っ (sokuon, consonante doble) no tiene romaji propio: modifica la unidad siguiente. Se modela
 * como una fila especial sin `units`; la lógica de tokenize/toRomaji en src/lib/kana.ts la trata
 * como un caso aparte.
 */

export type KanaScript = 'hiragana' | 'katakana';
export type KanaSection = 'basic' | 'dakuten' | 'yoon' | 'special';

export interface KanaUnit {
  kana: string;
  romaji: string;
  variants?: string[];
}

export interface KanaRow {
  id: string;
  label: string;
  section: KanaSection;
  units: KanaUnit[];
}

export const SOKUON = 'っ';
export const SOKUON_ROW_ID = 'sokuon';
export const CHOON = 'ー';
export const CHOON_ROW_ID = 'choon';

const basicRows: KanaRow[] = [
  {
    id: 'a',
    label: 'あ',
    section: 'basic',
    units: [
      { kana: 'あ', romaji: 'a' },
      { kana: 'い', romaji: 'i' },
      { kana: 'う', romaji: 'u' },
      { kana: 'え', romaji: 'e' },
      { kana: 'お', romaji: 'o' },
    ],
  },
  {
    id: 'ka',
    label: 'か',
    section: 'basic',
    units: [
      { kana: 'か', romaji: 'ka' },
      { kana: 'き', romaji: 'ki' },
      { kana: 'く', romaji: 'ku' },
      { kana: 'け', romaji: 'ke' },
      { kana: 'こ', romaji: 'ko' },
    ],
  },
  {
    id: 'sa',
    label: 'さ',
    section: 'basic',
    units: [
      { kana: 'さ', romaji: 'sa' },
      { kana: 'し', romaji: 'shi', variants: ['si'] },
      { kana: 'す', romaji: 'su' },
      { kana: 'せ', romaji: 'se' },
      { kana: 'そ', romaji: 'so' },
    ],
  },
  {
    id: 'ta',
    label: 'た',
    section: 'basic',
    units: [
      { kana: 'た', romaji: 'ta' },
      { kana: 'ち', romaji: 'chi', variants: ['ti'] },
      { kana: 'つ', romaji: 'tsu', variants: ['tu'] },
      { kana: 'て', romaji: 'te' },
      { kana: 'と', romaji: 'to' },
    ],
  },
  {
    id: 'na',
    label: 'な',
    section: 'basic',
    units: [
      { kana: 'な', romaji: 'na' },
      { kana: 'に', romaji: 'ni' },
      { kana: 'ぬ', romaji: 'nu' },
      { kana: 'ね', romaji: 'ne' },
      { kana: 'の', romaji: 'no' },
    ],
  },
  {
    id: 'ha',
    label: 'は',
    section: 'basic',
    units: [
      { kana: 'は', romaji: 'ha' },
      { kana: 'ひ', romaji: 'hi' },
      { kana: 'ふ', romaji: 'fu', variants: ['hu'] },
      { kana: 'へ', romaji: 'he' },
      { kana: 'ほ', romaji: 'ho' },
    ],
  },
  {
    id: 'ma',
    label: 'ま',
    section: 'basic',
    units: [
      { kana: 'ま', romaji: 'ma' },
      { kana: 'み', romaji: 'mi' },
      { kana: 'む', romaji: 'mu' },
      { kana: 'め', romaji: 'me' },
      { kana: 'も', romaji: 'mo' },
    ],
  },
  {
    id: 'ya',
    label: 'や',
    section: 'basic',
    units: [
      { kana: 'や', romaji: 'ya' },
      { kana: 'ゆ', romaji: 'yu' },
      { kana: 'よ', romaji: 'yo' },
    ],
  },
  {
    id: 'ra',
    label: 'ら',
    section: 'basic',
    units: [
      { kana: 'ら', romaji: 'ra' },
      { kana: 'り', romaji: 'ri' },
      { kana: 'る', romaji: 'ru' },
      { kana: 'れ', romaji: 're' },
      { kana: 'ろ', romaji: 'ro' },
    ],
  },
  {
    id: 'wa',
    label: 'わ',
    section: 'basic',
    units: [
      { kana: 'わ', romaji: 'wa' },
      { kana: 'を', romaji: 'o', variants: ['wo'] },
    ],
  },
  {
    id: 'n',
    label: 'ん',
    section: 'basic',
    units: [{ kana: 'ん', romaji: 'n', variants: ['nn', "n'"] }],
  },
];

const dakutenRows: KanaRow[] = [
  {
    id: 'ga',
    label: 'が',
    section: 'dakuten',
    units: [
      { kana: 'が', romaji: 'ga' },
      { kana: 'ぎ', romaji: 'gi' },
      { kana: 'ぐ', romaji: 'gu' },
      { kana: 'げ', romaji: 'ge' },
      { kana: 'ご', romaji: 'go' },
    ],
  },
  {
    id: 'za',
    label: 'ざ',
    section: 'dakuten',
    units: [
      { kana: 'ざ', romaji: 'za' },
      { kana: 'じ', romaji: 'ji', variants: ['zi'] },
      { kana: 'ず', romaji: 'zu' },
      { kana: 'ぜ', romaji: 'ze' },
      { kana: 'ぞ', romaji: 'zo' },
    ],
  },
  {
    id: 'da',
    label: 'だ',
    section: 'dakuten',
    units: [
      { kana: 'だ', romaji: 'da' },
      { kana: 'ぢ', romaji: 'ji', variants: ['di'] },
      { kana: 'づ', romaji: 'zu', variants: ['du'] },
      { kana: 'で', romaji: 'de' },
      { kana: 'ど', romaji: 'do' },
    ],
  },
  {
    id: 'ba',
    label: 'ば',
    section: 'dakuten',
    units: [
      { kana: 'ば', romaji: 'ba' },
      { kana: 'び', romaji: 'bi' },
      { kana: 'ぶ', romaji: 'bu' },
      { kana: 'べ', romaji: 'be' },
      { kana: 'ぼ', romaji: 'bo' },
    ],
  },
  {
    id: 'pa',
    label: 'ぱ',
    section: 'dakuten',
    units: [
      { kana: 'ぱ', romaji: 'pa' },
      { kana: 'ぴ', romaji: 'pi' },
      { kana: 'ぷ', romaji: 'pu' },
      { kana: 'ぺ', romaji: 'pe' },
      { kana: 'ぽ', romaji: 'po' },
    ],
  },
];

const yoonRows: KanaRow[] = [
  {
    id: 'kya',
    label: 'きゃ',
    section: 'yoon',
    units: [
      { kana: 'きゃ', romaji: 'kya' },
      { kana: 'きゅ', romaji: 'kyu' },
      { kana: 'きょ', romaji: 'kyo' },
    ],
  },
  {
    id: 'sha',
    label: 'しゃ',
    section: 'yoon',
    units: [
      { kana: 'しゃ', romaji: 'sha', variants: ['sya'] },
      { kana: 'しゅ', romaji: 'shu', variants: ['syu'] },
      { kana: 'しょ', romaji: 'sho', variants: ['syo'] },
    ],
  },
  {
    id: 'cha',
    label: 'ちゃ',
    section: 'yoon',
    units: [
      { kana: 'ちゃ', romaji: 'cha', variants: ['tya'] },
      { kana: 'ちゅ', romaji: 'chu', variants: ['tyu'] },
      { kana: 'ちょ', romaji: 'cho', variants: ['tyo'] },
    ],
  },
  {
    id: 'nya',
    label: 'にゃ',
    section: 'yoon',
    units: [
      { kana: 'にゃ', romaji: 'nya' },
      { kana: 'にゅ', romaji: 'nyu' },
      { kana: 'にょ', romaji: 'nyo' },
    ],
  },
  {
    id: 'hya',
    label: 'ひゃ',
    section: 'yoon',
    units: [
      { kana: 'ひゃ', romaji: 'hya' },
      { kana: 'ひゅ', romaji: 'hyu' },
      { kana: 'ひょ', romaji: 'hyo' },
    ],
  },
  {
    id: 'mya',
    label: 'みゃ',
    section: 'yoon',
    units: [
      { kana: 'みゃ', romaji: 'mya' },
      { kana: 'みゅ', romaji: 'myu' },
      { kana: 'みょ', romaji: 'myo' },
    ],
  },
  {
    id: 'rya',
    label: 'りゃ',
    section: 'yoon',
    units: [
      { kana: 'りゃ', romaji: 'rya' },
      { kana: 'りゅ', romaji: 'ryu' },
      { kana: 'りょ', romaji: 'ryo' },
    ],
  },
  {
    id: 'gya',
    label: 'ぎゃ',
    section: 'yoon',
    units: [
      { kana: 'ぎゃ', romaji: 'gya' },
      { kana: 'ぎゅ', romaji: 'gyu' },
      { kana: 'ぎょ', romaji: 'gyo' },
    ],
  },
  {
    id: 'ja',
    label: 'じゃ',
    section: 'yoon',
    units: [
      { kana: 'じゃ', romaji: 'ja', variants: ['jya', 'zya'] },
      { kana: 'じゅ', romaji: 'ju', variants: ['jyu', 'zyu'] },
      { kana: 'じょ', romaji: 'jo', variants: ['jyo', 'zyo'] },
    ],
  },
  {
    id: 'bya',
    label: 'びゃ',
    section: 'yoon',
    units: [
      { kana: 'びゃ', romaji: 'bya' },
      { kana: 'びゅ', romaji: 'byu' },
      { kana: 'びょ', romaji: 'byo' },
    ],
  },
  {
    id: 'pya',
    label: 'ぴゃ',
    section: 'yoon',
    units: [
      { kana: 'ぴゃ', romaji: 'pya' },
      { kana: 'ぴゅ', romaji: 'pyu' },
      { kana: 'ぴょ', romaji: 'pyo' },
    ],
  },
];

const specialRows: KanaRow[] = [
  {
    id: SOKUON_ROW_ID,
    label: SOKUON,
    section: 'special',
    units: [],
  },
];

export const HIRAGANA_ROWS: KanaRow[] = [...basicRows, ...dakutenRows, ...yoonRows, ...specialRows];

function hiraganaToKatakana(value: string): string {
  return [...value].map((character) => {
    const code = character.codePointAt(0)!;
    return code >= 0x3041 && code <= 0x3096
      ? String.fromCodePoint(code + 0x60)
      : character;
  }).join('');
}

export const KATAKANA_ROWS: KanaRow[] = [
  ...HIRAGANA_ROWS.map((row) => ({
    ...row,
    label: hiraganaToKatakana(row.label),
    units: row.units.map((unit) => ({ ...unit, kana: hiraganaToKatakana(unit.kana) })),
  })),
  {
    id: CHOON_ROW_ID,
    label: CHOON,
    section: 'special',
    units: [],
  },
];

/** Alias histórico para consumidores que trabajan sólo con hiragana. */
export const KANA_ROWS = HIRAGANA_ROWS;

export function rowsForScript(script: KanaScript): KanaRow[] {
  return script === 'hiragana' ? HIRAGANA_ROWS : KATAKANA_ROWS;
}

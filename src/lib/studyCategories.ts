/**
 * Categorías del tiempo de estudio: las de práctica en WordGana (automáticas), unas fijas para registrar
 * actividades fuera de la app y las personalizadas que crea cada persona.
 */
import type { KanaScript } from '../data/kana';
import type { PracticeKind } from '../data/sentences';
import type { Messages } from '../i18n';
import { practiceCategoryId } from './studyTime';

export type BuiltInCategory = 'listening' | 'reading' | 'class' | 'conversation' | 'handwriting' | 'apps';

export interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  /** Archivada: no se ofrece para cargar tiempo, pero sigue en el historial. */
  archived?: boolean;
}

const PRACTICE_ICONS: Record<PracticeKind, Record<KanaScript, string>> = {
  kana: { hiragana: 'あ', katakana: 'ア' },
  words: { hiragana: '語', katakana: '語' },
  sentences: { hiragana: '文', katakana: '文' },
};

export const BUILT_IN_CATEGORIES: Array<{ id: BuiltInCategory; icon: string }> = [
  { id: 'listening', icon: '🎧' },
  { id: 'reading', icon: '📖' },
  { id: 'class', icon: '🏫' },
  { id: 'conversation', icon: '💬' },
  { id: 'handwriting', icon: '✍️' },
  { id: 'apps', icon: '📱' },
];

function parsePracticeId(id: string): { script: KanaScript; kind: PracticeKind } | null {
  const [prefix, script, kind] = id.split(':');
  if (prefix !== 'practice') return null;
  if (script !== 'hiragana' && script !== 'katakana') return null;
  if (kind !== 'kana' && kind !== 'words' && kind !== 'sentences') return null;
  return { script, kind };
}

export function isPracticeCategory(id: string): boolean {
  return parsePracticeId(id) !== null;
}

export interface CategoryInfo {
  id: string;
  icon: string;
  label: string;
}

/** Ícono y nombre visible de cualquier categoría, incluidas las archivadas o desconocidas. */
export function categoryInfo(id: string, messages: Messages, custom: readonly CustomCategory[] = []): CategoryInfo {
  const practice = parsePracticeId(id);
  if (practice) {
    const kindNames: Record<PracticeKind, string> = {
      kana: messages.letters,
      words: messages.words,
      sentences: messages.sentences,
    };
    const scriptName = practice.script === 'hiragana' ? 'Hiragana' : 'Katakana';
    return { id, icon: PRACTICE_ICONS[practice.kind][practice.script], label: `${kindNames[practice.kind]} · ${scriptName}` };
  }
  const builtIn = BUILT_IN_CATEGORIES.find((category) => category.id === id);
  if (builtIn) return { id, icon: builtIn.icon, label: messages.studyCategoryNames[builtIn.id] };
  const own = custom.find((category) => category.id === id);
  if (own) return { id, icon: own.icon, label: own.name };
  return { id, icon: '•', label: messages.otherCategory };
}

export { practiceCategoryId };

/** "25 min", "1 h 25 min" o "2 h", según el idioma. */
export function formatDuration(seconds: number, messages: Messages): string {
  const totalMinutes = seconds <= 0 ? 0 : Math.max(1, Math.round(seconds / 60));
  if (totalMinutes < 60) return messages.durationM(totalMinutes);
  return messages.durationHM(Math.floor(totalMinutes / 60), totalMinutes % 60);
}

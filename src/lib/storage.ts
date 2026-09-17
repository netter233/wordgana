/**
 * Persistencia en localStorage. Cualquier lectura/escritura puede fallar (modo privado de
 * Safari, cuota agotada, storage bloqueado) — nunca debe tirar abajo la app, solo perder la
 * persistencia para esa sesión.
 */
import type { PracticeMode } from './kana';

const SETTINGS_KEY = 'wordgana:settings:v1';

export interface Settings {
  enabledRowIds: string[];
  mode: PracticeMode;
}

export const DEFAULT_SETTINGS: Settings = {
  enabledRowIds: ['a'],
  mode: 'read',
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    if (!Array.isArray(parsed.enabledRowIds)) return DEFAULT_SETTINGS;
    return {
      enabledRowIds: parsed.enabledRowIds.filter((id): id is string => typeof id === 'string'),
      mode: parsed.mode === 'write' ? 'write' : 'read',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Sin persistencia esta sesión; la app sigue funcionando en memoria.
  }
}

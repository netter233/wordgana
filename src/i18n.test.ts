import { describe, expect, it } from 'vitest';
import { resolveLanguage } from './i18n';

describe('resolveLanguage', () => {
  it('matches supported regional locales to their base language', () => {
    expect(resolveLanguage(['es-AR'])).toBe('es');
    expect(resolveLanguage(['fr-CA'])).toBe('fr');
    expect(resolveLanguage(['de-DE'])).toBe('de');
    expect(resolveLanguage(['en-US'])).toBe('en');
    expect(resolveLanguage(['pt-BR'])).toBe('pt');
    expect(resolveLanguage(['pt-PT'])).toBe('pt');
    expect(resolveLanguage(['it-IT'])).toBe('it');
  });

  it('uses the first supported preference and falls back to English', () => {
    expect(resolveLanguage(['ja-JP', 'it-IT', 'fr-FR'])).toBe('it');
    expect(resolveLanguage(['ja-JP', 'ko-KR'])).toBe('en');
    expect(resolveLanguage([])).toBe('en');
  });
});

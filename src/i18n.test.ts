import { describe, expect, it } from 'vitest';
import { resolveLanguage } from './i18n';

describe('resolveLanguage', () => {
  it('matches supported regional locales to their base language', () => {
    expect(resolveLanguage(['es-AR'])).toBe('es');
    expect(resolveLanguage(['fr-CA'])).toBe('fr');
    expect(resolveLanguage(['de-DE'])).toBe('de');
    expect(resolveLanguage(['en-US'])).toBe('en');
  });

  it('uses the first supported preference and falls back to English', () => {
    expect(resolveLanguage(['pt-BR', 'fr-FR', 'en-US'])).toBe('fr');
    expect(resolveLanguage(['ja-JP', 'pt-BR'])).toBe('en');
    expect(resolveLanguage([])).toBe('en');
  });
});

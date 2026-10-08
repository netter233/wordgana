import { describe, expect, it } from 'vitest';
import { canSpeakJapanese, pickJapaneseVoice } from './speech';

describe('pickJapaneseVoice', () => {
  it('prefiere una voz japonesa local sobre una en red', () => {
    const voices = [
      { name: 'Samantha', lang: 'en-US', localService: true },
      { name: 'Google 日本語', lang: 'ja-JP', localService: false },
      { name: 'Kyoko', lang: 'ja-JP', localService: true },
    ];
    expect(pickJapaneseVoice(voices)?.name).toBe('Kyoko');
  });

  it('acepta códigos de idioma con guion bajo', () => {
    expect(pickJapaneseVoice([{ name: 'Otoya', lang: 'ja_JP' }])?.name).toBe('Otoya');
  });

  it('devuelve null si no hay voces japonesas', () => {
    expect(pickJapaneseVoice([{ lang: 'es-AR' }, { lang: 'en-GB' }])).toBeNull();
  });
});

describe('canSpeakJapanese', () => {
  it('no hay audio sin soporte del navegador', () => {
    expect(canSpeakJapanese(false, [{ lang: 'ja-JP' }])).toBe(false);
  });

  it('confía en el sistema cuando la lista de voces llega vacía', () => {
    expect(canSpeakJapanese(true, [])).toBe(true);
  });

  it('oculta el audio si hay voces pero ninguna japonesa', () => {
    expect(canSpeakJapanese(true, [{ lang: 'en-US' }])).toBe(false);
  });
});

/**
 * Pronunciación con la voz japonesa del sistema (Web Speech API). Funciona sin red en iOS, Android y
 * escritorio cuando el sistema tiene una voz japonesa instalada.
 */
import { useEffect, useState } from 'react';

interface VoiceLike {
  lang: string;
  localService?: boolean;
  default?: boolean;
}

/** Elige la mejor voz japonesa: primero las locales (sin red), después la predeterminada. */
export function pickJapaneseVoice<V extends VoiceLike>(voices: readonly V[]): V | null {
  const japanese = voices.filter((voice) => voice.lang.toLowerCase().replace('_', '-').startsWith('ja'));
  if (japanese.length === 0) return null;
  const score = (voice: V) => (voice.localService ? 2 : 0) + (voice.default ? 1 : 0);
  return [...japanese].sort((a, b) => score(b) - score(a))[0];
}

/**
 * ¿Se puede pronunciar japonés? Algunos WebView de iOS devuelven la lista de voces vacía aunque el
 * sistema tenga voces: en ese caso se confía en `lang = ja-JP`. Si la lista trae voces pero ninguna es
 * japonesa (típico en escritorio), se oculta el audio para no leer kana con una voz de otro idioma.
 */
export function canSpeakJapanese(supported: boolean, voices: readonly VoiceLike[]): boolean {
  if (!supported) return false;
  return voices.length === 0 || pickJapaneseVoice(voices) !== null;
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
    ? window.speechSynthesis
    : null;
}

export function speakJapanese(text: string): void {
  const speech = synth();
  if (!speech) return;
  try {
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    const voice = pickJapaneseVoice(speech.getVoices());
    if (voice) utterance.voice = voice;
    speech.speak(utterance);
  } catch {
    // Sin audio no se rompe la práctica.
  }
}

/** `true` cuando hay voz japonesa disponible. Se actualiza cuando el navegador termina de cargar voces. */
export function useJapaneseSpeech(): boolean {
  const [available, setAvailable] = useState(() => {
    const speech = synth();
    return speech ? canSpeakJapanese(true, speech.getVoices()) : false;
  });

  useEffect(() => {
    const speech = synth();
    if (!speech) return;
    const update = () => setAvailable(canSpeakJapanese(true, speech.getVoices()));
    update();
    speech.addEventListener?.('voiceschanged', update);
    return () => speech.removeEventListener?.('voiceschanged', update);
  }, []);

  return available;
}

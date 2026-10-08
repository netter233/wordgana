import { speakJapanese } from '../lib/speech';
import { useI18n } from '../i18n';

interface SpeakButtonProps {
  text: string;
  small?: boolean;
}

export function SpeakButton({ text, small = false }: SpeakButtonProps) {
  const { messages } = useI18n();
  return (
    <button
      type="button"
      className={small ? 'speak-btn speak-btn--small' : 'speak-btn'}
      onClick={() => speakJapanese(text)}
      aria-label={`${messages.listen}: ${text}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}

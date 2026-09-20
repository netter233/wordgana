import { useI18n } from '../i18n';

interface TopBarProps {
  title: string;
  onClose?: () => void;
  onSettings?: () => void;
  mark?: string;
}

export function TopBar({ title, onClose, onSettings, mark = 'あ' }: TopBarProps) {
  const { messages } = useI18n();
  return (
    <header className="appbar">
      {onClose ? (
        <button type="button" className="appbar-btn" onClick={onClose} aria-label={messages.closeHome}>
          ✕
        </button>
      ) : (
        <span className="appbar-mark ja" aria-hidden="true">
          {mark}
        </span>
      )}
      <h1 className="appbar-title">{title}</h1>
      {onSettings && (
        <button
          type="button"
          className="appbar-btn appbar-btn--trailing"
          onClick={onSettings}
          aria-label={messages.openSettings}
        >
          <svg
            className="appbar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.09a2 2 0 0 1 1 1.74v.5a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      )}
    </header>
  );
}

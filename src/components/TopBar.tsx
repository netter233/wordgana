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
          <span aria-hidden="true">⚙︎</span>
        </button>
      )}
    </header>
  );
}

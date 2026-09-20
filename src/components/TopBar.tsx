interface TopBarProps {
  title: string;
  onClose?: () => void;
  mark?: string;
}

export function TopBar({ title, onClose, mark = 'あ' }: TopBarProps) {
  return (
    <header className="appbar">
      {onClose ? (
        <button type="button" className="appbar-btn" onClick={onClose} aria-label="Salir al inicio">
          ✕
        </button>
      ) : (
        <span className="appbar-mark ja" aria-hidden="true">
          {mark}
        </span>
      )}
      <h1 className="appbar-title">{title}</h1>
    </header>
  );
}

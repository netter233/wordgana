interface TopBarProps {
  title: string;
  onClose?: () => void;
}

export function TopBar({ title, onClose }: TopBarProps) {
  return (
    <header className="appbar">
      {onClose ? (
        <button type="button" className="appbar-btn" onClick={onClose} aria-label="Salir al inicio">
          ✕
        </button>
      ) : (
        <span className="appbar-mark ja" aria-hidden="true">
          あ
        </span>
      )}
      <h1 className="appbar-title">{title}</h1>
    </header>
  );
}

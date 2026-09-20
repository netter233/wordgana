import type { KanaScript } from '../data/kana';

interface ScriptSwitchProps {
  value: KanaScript;
  onChange: (script: KanaScript) => void;
}

export function ScriptSwitch({ value, onChange }: ScriptSwitchProps) {
  return (
    <div className="script-switch" role="group" aria-label="Silabario para practicar">
      <button
        type="button"
        className={value === 'hiragana' ? 'script-switch-btn script-switch-btn--selected' : 'script-switch-btn'}
        aria-pressed={value === 'hiragana'}
        onClick={() => onChange('hiragana')}
      >
        <span className="ja">あ</span> Hiragana
      </button>
      <button
        type="button"
        className={value === 'katakana' ? 'script-switch-btn script-switch-btn--selected' : 'script-switch-btn'}
        aria-pressed={value === 'katakana'}
        onClick={() => onChange('katakana')}
      >
        <span className="ja">ア</span> Katakana
      </button>
    </div>
  );
}

import {
  CHOON_ROW_ID,
  SOKUON_ROW_ID,
  type KanaRow,
  type KanaScript,
  type KanaSection,
} from '../data/kana';
import { useI18n } from '../i18n';

const SECTION_ORDER: KanaSection[] = ['basic', 'dakuten', 'yoon', 'special'];

interface RowPickerProps {
  rows: KanaRow[];
  enabledRowIds: Set<string>;
  onToggle: (rowId: string) => void;
  onSetAll: (rowIds: string[]) => void;
  eligibleCount: number;
  script: KanaScript;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export function RowPicker({
  rows: kanaRows,
  enabledRowIds,
  onToggle,
  onSetAll,
  eligibleCount,
  script,
  expanded,
  onToggleExpanded,
}: RowPickerProps) {
  const { messages } = useI18n();
  const sectionLabels: Record<KanaSection, string> = {
    basic: messages.basicRows,
    dakuten: messages.dakutenRows,
    yoon: messages.combinationsRows,
    special: messages.specialRows,
  };
  const allRowIds = kanaRows.map((r) => r.id);
  const selectedCount = kanaRows.filter((row) => enabledRowIds.has(row.id)).length;
  const scriptName = script === 'hiragana' ? 'hiragana' : 'katakana';

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h2>{messages.rowsTitle(scriptName)}</h2>
          <p className="section-summary">
            {messages.rowsSummary(selectedCount, kanaRows.length, eligibleCount)}
          </p>
        </div>
        <button
          type="button"
          className="edit-btn"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-controls={`rows-${script}`}
        >
          {expanded ? messages.done : messages.edit}
        </button>
      </div>

      {expanded && (
        <div className="row-picker-details" id={`rows-${script}`}>
          <div className="link-row row-picker-actions">
            <button type="button" className="link-btn" onClick={() => onSetAll(allRowIds)}>
              {messages.selectAll}
            </button>
            <button type="button" className="link-btn" onClick={() => onSetAll([])}>
              {messages.clearAll}
            </button>
          </div>

          {SECTION_ORDER.map((section) => {
            const rows = kanaRows.filter((r) => r.section === section);
            if (rows.length === 0) return null;
            return (
              <div className="row-section" key={section}>
                <h3 className="row-section-title">{sectionLabels[section]}</h3>
                <div className="chip-grid">
                  {rows.map((row) => {
                    const on = enabledRowIds.has(row.id);
                    return (
                      <button
                        key={row.id}
                        type="button"
                        className={on ? 'chip chip--on' : 'chip'}
                        aria-pressed={on}
                        onClick={() => onToggle(row.id)}
                      >
                        <span className="chip-label ja">{row.label}</span>
                        {row.units.length > 0 && (
                          <span className="chip-kana ja">{row.units.map((u) => u.kana).join('')}</span>
                        )}
                        {row.id === SOKUON_ROW_ID && (
                          <span className="chip-kana">{messages.doublesConsonants}</span>
                        )}
                        {row.id === CHOON_ROW_ID && (
                          <span className="chip-kana">{messages.lengthensVowel}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

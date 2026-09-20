import {
  CHOON_ROW_ID,
  SOKUON_ROW_ID,
  type KanaRow,
  type KanaScript,
  type KanaSection,
} from '../data/kana';

const SECTION_LABELS: Record<KanaSection, string> = {
  basic: 'Básicas',
  dakuten: 'Con dakuten (゛゜)',
  yoon: 'Combinaciones (ゃゅょ)',
  special: 'Especial',
};

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
  const allRowIds = kanaRows.map((r) => r.id);
  const selectedCount = kanaRows.filter((row) => enabledRowIds.has(row.id)).length;
  const scriptName = script === 'hiragana' ? 'hiragana' : 'katakana';

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h2>1. Filas de {scriptName}</h2>
          <p className="section-summary">
            {selectedCount} de {kanaRows.length} seleccionadas · {eligibleCount} palabras
          </p>
        </div>
        <button
          type="button"
          className="edit-btn"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-controls={`rows-${script}`}
        >
          {expanded ? 'Listo' : 'Editar'}
        </button>
      </div>

      {expanded && (
        <div className="row-picker-details" id={`rows-${script}`}>
          <div className="link-row row-picker-actions">
            <button type="button" className="link-btn" onClick={() => onSetAll(allRowIds)}>
              Seleccionar todas
            </button>
            <button type="button" className="link-btn" onClick={() => onSetAll([])}>
              Quitar todas
            </button>
          </div>

          {SECTION_ORDER.map((section) => {
            const rows = kanaRows.filter((r) => r.section === section);
            if (rows.length === 0) return null;
            return (
              <div className="row-section" key={section}>
                <h3 className="row-section-title">{SECTION_LABELS[section]}</h3>
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
                          <span className="chip-kana">duplica consonantes</span>
                        )}
                        {row.id === CHOON_ROW_ID && (
                          <span className="chip-kana">alarga la vocal</span>
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

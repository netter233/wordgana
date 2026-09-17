import { KANA_ROWS, SOKUON_ROW_ID, type KanaSection } from '../data/kana';

const SECTION_LABELS: Record<KanaSection, string> = {
  basic: 'Básicas',
  dakuten: 'Con dakuten (゛゜)',
  yoon: 'Combinaciones (ゃゅょ)',
  special: 'Especial',
};

const SECTION_ORDER: KanaSection[] = ['basic', 'dakuten', 'yoon', 'special'];

interface RowPickerProps {
  enabledRowIds: Set<string>;
  onToggle: (rowId: string) => void;
  onSetAll: (rowIds: string[]) => void;
  eligibleCount: number;
}

export function RowPicker({ enabledRowIds, onToggle, onSetAll, eligibleCount }: RowPickerProps) {
  const allRowIds = KANA_ROWS.map((r) => r.id);

  return (
    <section className="card">
      <div className="section-head">
        <h2>1. ¿Qué filas ya sabés?</h2>
        <div className="link-row">
          <button type="button" className="link-btn" onClick={() => onSetAll(allRowIds)}>
            Todas
          </button>
          <button type="button" className="link-btn" onClick={() => onSetAll([])}>
            Ninguna
          </button>
        </div>
      </div>

      {SECTION_ORDER.map((section) => {
        const rows = KANA_ROWS.filter((r) => r.section === section);
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
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="eligible-count">
        {eligibleCount === 1 ? '1 palabra disponible' : `${eligibleCount} palabras disponibles`}
      </p>
    </section>
  );
}

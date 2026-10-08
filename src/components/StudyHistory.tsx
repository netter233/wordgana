import { useI18n } from '../i18n';
import { categoryInfo, formatDuration, type CustomCategory } from '../lib/studyCategories';
import { groupByDay, type StudyEntry } from '../lib/studyTime';
import { Chevron } from './Chevron';

interface StudyHistoryProps {
  entries: StudyEntry[];
  customCategories: CustomCategory[];
  onEdit: (entry: StudyEntry) => void;
  onDelete: (entry: StudyEntry) => void;
  onAdd: () => void;
}

function parseDay(day: string): Date {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date);
}

/** Registros por día. Los manuales y de cronómetro se editan; los automáticos solo se pueden borrar. */
export function StudyHistory({ entries, customCategories, onEdit, onDelete, onAdd }: StudyHistoryProps) {
  const { language, messages } = useI18n();
  const groups = groupByDay(entries);
  const thisYear = new Date().getFullYear();
  const dayFormat = new Intl.DateTimeFormat(language, { weekday: 'long', day: 'numeric', month: 'short' });
  const dayFormatWithYear = new Intl.DateTimeFormat(language, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
  const formatDay = (day: string) => {
    const date = parseDay(day);
    return (date.getFullYear() === thisYear ? dayFormat : dayFormatWithYear).format(date);
  };

  if (groups.length === 0) {
    return (
      <section className="card">
        <p className="empty-note empty-note--first">{messages.emptyHistory}</p>
        <button type="button" className="secondary-btn" onClick={onAdd}>＋ {messages.addTime}</button>
      </section>
    );
  }

  return (
    <section>
      {groups.map((group) => (
        <div className="card history-day" key={group.day}>
          <div className="history-day-head">
            <h2 className="history-day-title">{formatDay(group.day)}</h2>
            <span className="history-day-total">{formatDuration(group.seconds, messages)}</span>
          </div>
          <ul className="history-list">
            {group.entries.map((entry) => {
              const info = categoryInfo(entry.categoryId, messages, customCategories);
              const duration = formatDuration(entry.seconds, messages);
              const meta = entry.source === 'auto'
                ? `${messages.sourceAuto} · ${messages.rounds(entry.rounds ?? 0)}`
                : [entry.source === 'timer' ? messages.sourceTimer : messages.sourceManual, entry.note]
                  .filter(Boolean)
                  .join(' · ');
              const body = (
                <>
                  <span className="category-bar-icon ja" aria-hidden="true">{info.icon}</span>
                  <span className="history-text">
                    <span className="history-label">{info.label}</span>
                    <span className="history-meta">{meta}</span>
                  </span>
                  <span className="history-duration">{duration}</span>
                </>
              );
              return (
                <li key={entry.id}>
                  {entry.source === 'auto' ? (
                    <div className="history-row">
                      {body}
                      <button
                        type="button"
                        className="link-btn link-btn--danger history-delete"
                        aria-label={`${messages.deleteShort}: ${info.label}, ${duration}`}
                        onClick={() => {
                          if (window.confirm(messages.confirmDeleteEntry(info.label, duration))) onDelete(entry);
                        }}
                      >
                        {messages.deleteShort}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="history-row history-row--button"
                      aria-label={`${messages.editEntryHint}: ${info.label}, ${duration}`}
                      onClick={() => onEdit(entry)}
                    >
                      {body}
                      <Chevron />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}

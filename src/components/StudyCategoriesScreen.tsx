import { useState } from 'react';
import { useI18n } from '../i18n';
import { BUILT_IN_CATEGORIES, categoryInfo, type CustomCategory } from '../lib/studyCategories';
import { CategoryCreator } from './CategoryPicker';

interface StudyCategoriesScreenProps {
  customCategories: CustomCategory[];
  onCreate: (name: string, icon: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

export function StudyCategoriesScreen({ customCategories, onCreate, onRename, onRemove }: StudyCategoriesScreenProps) {
  const { messages } = useI18n();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const active = customCategories.filter((category) => !category.archived);

  return (
    <section>
      <div className="card">
        <h2>{messages.yourCategories}</h2>
        {active.length === 0 ? (
          <p className="empty-note">{messages.noCustomCategories}</p>
        ) : (
          <ul className="category-manage-list">
            {active.map((category) => (
              <li key={category.id}>
                <span className="category-bar-icon" aria-hidden="true">{category.icon}</span>
                {editing === category.id ? (
                  <form
                    className="category-rename"
                    onSubmit={(event) => {
                      event.preventDefault();
                      onRename(category.id, draft);
                      setEditing(null);
                    }}
                  >
                    <input
                      className="text-input"
                      value={draft}
                      maxLength={40}
                      autoFocus
                      aria-label={messages.categoryName}
                      onChange={(event) => setDraft(event.target.value)}
                    />
                    <button type="submit" className="small-btn" disabled={!draft.trim()}>{messages.save}</button>
                  </form>
                ) : (
                  <>
                    <span className="category-bar-label">{category.name}</span>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => {
                        setEditing(category.id);
                        setDraft(category.name);
                      }}
                    >
                      {messages.rename}
                    </button>
                    <button
                      type="button"
                      className="link-btn link-btn--danger"
                      onClick={() => {
                        if (window.confirm(messages.confirmRemoveCategory(category.name))) onRemove(category.id);
                      }}
                    >
                      {messages.removeCategory}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="hint">{messages.archivedNote}</p>
      </div>

      <div className="card">
        <h2>{messages.newCategory}</h2>
        <CategoryCreator onCreate={onCreate} />
      </div>

      <div className="card">
        <h2>{messages.builtInCategoriesTitle}</h2>
        <ul className="category-manage-list">
          {BUILT_IN_CATEGORIES.map((category) => {
            const info = categoryInfo(category.id, messages);
            return (
              <li key={category.id}>
                <span className="category-bar-icon" aria-hidden="true">{info.icon}</span>
                <span className="category-bar-label">{info.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

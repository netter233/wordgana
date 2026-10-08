import { useState } from 'react';
import { useI18n } from '../i18n';
import { CATEGORY_ICONS, selectableCategories, type CustomCategory } from '../lib/studyCategories';

interface CategoryPickerProps {
  value: string;
  onChange: (categoryId: string) => void;
  customCategories: CustomCategory[];
  /** Crea una categoría y devuelve su id. */
  onCreateCategory: (name: string, icon: string) => string;
}

export function CategoryPicker({ value, onChange, customCategories, onCreateCategory }: CategoryPickerProps) {
  const { messages } = useI18n();
  const [creating, setCreating] = useState(false);
  const options = selectableCategories(messages, customCategories);

  return (
    <div>
      <div className="category-grid" role="radiogroup" aria-label={messages.categoryLabel}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={option.id === value}
            className={option.id === value ? 'category-chip category-chip--selected' : 'category-chip'}
            onClick={() => onChange(option.id)}
          >
            <span className="category-chip-icon" aria-hidden="true">{option.icon}</span>
            <span className="category-chip-label">{option.label}</span>
          </button>
        ))}
        {!creating && (
          <button type="button" className="category-chip category-chip--new" onClick={() => setCreating(true)}>
            <span className="category-chip-icon" aria-hidden="true">＋</span>
            <span className="category-chip-label">{messages.newCategory}</span>
          </button>
        )}
      </div>
      {creating && (
        <CategoryCreator
          onCancel={() => setCreating(false)}
          onCreate={(name, icon) => {
            onChange(onCreateCategory(name, icon));
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

interface CategoryCreatorProps {
  onCreate: (name: string, icon: string) => void;
  onCancel?: () => void;
}

export function CategoryCreator({ onCreate, onCancel }: CategoryCreatorProps) {
  const { messages } = useI18n();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);

  return (
    <div className="category-creator">
      <label className="field">
        <span className="field-label">{messages.categoryName}</span>
        <input
          className="text-input"
          value={name}
          maxLength={40}
          placeholder={messages.categoryNamePlaceholder}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <div className="field">
        <span className="field-label" id="category-icon-label">{messages.categoryIcon}</span>
        <div className="icon-grid" role="radiogroup" aria-labelledby="category-icon-label">
          {CATEGORY_ICONS.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={option === icon}
              className={option === icon ? 'icon-option icon-option--selected' : 'icon-option'}
              onClick={() => setIcon(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="inline-actions">
        {onCancel && (
          <button type="button" className="link-btn link-btn--muted" onClick={onCancel}>{messages.cancel}</button>
        )}
        <button
          type="button"
          className="small-btn"
          disabled={!name.trim()}
          onClick={() => {
            onCreate(name, icon);
            setName('');
          }}
        >
          {messages.createCategory}
        </button>
      </div>
    </div>
  );
}

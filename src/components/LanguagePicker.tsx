import { LANGUAGE_NAMES, type AppLanguage, type LanguagePreference, useI18n } from '../i18n';

const LANGUAGES: AppLanguage[] = ['en', 'es', 'fr', 'de'];

export function LanguagePicker() {
  const { language, preference, setPreference, messages } = useI18n();

  return (
    <label className="language-picker">
      <span>🌐 {messages.languageLabel}</span>
      <select
        value={preference}
        onChange={(event) => setPreference(event.target.value as LanguagePreference)}
      >
        <option value="auto">{messages.autoLanguage(LANGUAGE_NAMES[language])}</option>
        {LANGUAGES.map((code) => (
          <option key={code} value={code}>{LANGUAGE_NAMES[code]}</option>
        ))}
      </select>
    </label>
  );
}

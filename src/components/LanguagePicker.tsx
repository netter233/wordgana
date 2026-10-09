import { LANGUAGE_NAMES, type AppLanguage, type LanguagePreference, useI18n } from '../i18n';

const LANGUAGES: AppLanguage[] = ['en', 'es', 'pt', 'fr', 'it', 'de'];

export function LanguagePicker() {
  const { language, preference, setPreference, messages } = useI18n();

  return (
    <section className="card settings-card">
      <div className="settings-card-heading">
        <span className="settings-icon" aria-hidden="true">🌐</span>
        <div>
          <h2 id="language-setting-label">{messages.languageLabel}</h2>
          <p>{messages.languageDescription}</p>
        </div>
      </div>
      <select
        className="settings-select"
        aria-labelledby="language-setting-label"
        value={preference}
        onChange={(event) => setPreference(event.target.value as LanguagePreference)}
      >
        <option value="auto">{messages.autoLanguage(LANGUAGE_NAMES[language])}</option>
        {LANGUAGES.map((code) => (
          <option key={code} value={code}>{LANGUAGE_NAMES[code]}</option>
        ))}
      </select>
    </section>
  );
}

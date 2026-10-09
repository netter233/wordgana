import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nProvider, LANGUAGE_NAMES, MESSAGES, SUPPORTED_LANGUAGES } from '../i18n';
import { CATEGORY_ICONS } from '../lib/studyCategories';
import { CategoryCreator } from './CategoryPicker';
import { Practice } from './Practice';
import { LanguagePicker } from './LanguagePicker';

afterEach(() => vi.unstubAllGlobals());

describe('localized control names', () => {
  it.each(SUPPORTED_LANGUAGES)('labels Automatic with the device language while displaying %s', (language) => {
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => key === 'wordgana:language:v1' ? language : null,
    });
    vi.stubGlobal('navigator', { languages: ['es-AR'], language: 'es-AR' });
    const picker = renderToStaticMarkup(<I18nProvider><LanguagePicker /></I18nProvider>);
    expect(picker).toContain(`<option value="auto">${MESSAGES[language].autoLanguage(LANGUAGE_NAMES.es)}</option>`);
    expect(picker).toContain(`<option value="${language}" selected="">`);
  });

  it.each(SUPPORTED_LANGUAGES)('renders translated icon names and practice prompts in %s', (language) => {
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => key === 'wordgana:language:v1' ? language : null,
    });
    const messages = MESSAGES[language];
    const creator = renderToStaticMarkup(
      <I18nProvider><CategoryCreator onCreate={() => {}} /></I18nProvider>,
    );
    for (const icon of CATEGORY_ICONS) {
      expect(creator).toContain(`aria-label="${messages.categoryIconNames[icon]}"`);
    }
    expect(creator.match(/<span aria-hidden="true">/g)).toHaveLength(CATEGORY_ICONS.length);

    for (const kind of ['words', 'sentences'] as const) {
      for (const mode of ['read', 'write'] as const) {
        const practice = renderToStaticMarkup(
          <I18nProvider>
            <Practice
              words={[{ kana: 'ねこ', es: 'gato' }]}
              mode={mode}
              script="hiragana"
              practiceKind={kind}
              onAnswer={() => {}}
              onFinish={() => {}}
            />
          </I18nProvider>,
        );
        const prompt = mode === 'read' ? messages.answerRomaji : messages.answerKana;
        expect(practice).toContain(`aria-label="${prompt}"`);
        expect(practice).toContain(`placeholder="${prompt}"`);
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import {
  addCustomCategory,
  categoryInfo,
  chartSeriesFor,
  removeCustomCategory,
  renameCustomCategory,
  selectableCategories,
} from './studyCategories';
import { MESSAGES } from '../i18n';

const messages = MESSAGES.es;

describe('categorías', () => {
  it('nombra las categorías de práctica, fijas y desconocidas', () => {
    expect(categoryInfo('practice:hiragana:words', messages).label).toBe('Palabras · Hiragana');
    expect(categoryInfo('practice:katakana:kana', messages).icon).toBe('ア');
    expect(categoryInfo('listening', messages).label).toBe('Escucha');
    expect(categoryInfo('custom:borrada', messages).label).toBe('Otra');
  });

  it('crea, renombra y descarta nombres vacíos', () => {
    const created = addCustomCategory([], '  Anime  ', '📺', 'custom:a');
    expect(created).toEqual([{ id: 'custom:a', name: 'Anime', icon: '📺' }]);
    expect(addCustomCategory(created, '   ', '📺')).toEqual(created);
    expect(renameCustomCategory(created, 'custom:a', 'Dramas')[0].name).toBe('Dramas');
    expect(categoryInfo('custom:a', messages, created).label).toBe('Anime');
  });

  it('archiva si tiene registros y borra si no', () => {
    const list = addCustomCategory(addCustomCategory([], 'Anime', '📺', 'custom:a'), 'Juegos', '🎮', 'custom:b');
    const result = removeCustomCategory(list, 'custom:a', new Set(['custom:a']));
    expect(result.find((c) => c.id === 'custom:a')?.archived).toBe(true);
    expect(removeCustomCategory(list, 'custom:b', new Set())).toHaveLength(1);
    expect(selectableCategories(messages, result).map((c) => c.id)).not.toContain('custom:a');
    expect(selectableCategories(messages, result).map((c) => c.id)).toContain('custom:b');
  });
});

describe('series del gráfico', () => {
  it('agrupa la práctica por tipo y lo demás en Otras', () => {
    expect(chartSeriesFor('practice:hiragana:kana')).toBe('letters');
    expect(chartSeriesFor('practice:katakana:kana')).toBe('letters');
    expect(chartSeriesFor('practice:hiragana:sentences')).toBe('sentences');
    expect(chartSeriesFor('reading')).toBe('reading');
    expect(chartSeriesFor('apps')).toBe('other');
    expect(chartSeriesFor('custom:anime')).toBe('other');
  });
});

/**
 * Definición de logros. El progreso de cada uno se mide con una métrica (`metric`) y una meta (`target`);
 * se desbloquea cuando la métrica alcanza la meta. Los títulos viven acá en los cuatro idiomas; las
 * descripciones se arman en i18n a partir de la métrica y la meta.
 */
import type { AppLanguage } from '../i18n';

export type AchievementCategory = 'rounds' | 'streak' | 'vocabulary' | 'precision' | 'mastery' | 'time';

export type AchievementMetric =
  | 'rounds'
  | 'bestStreak'
  | 'wordsLearned'
  | 'perfectRounds'
  | 'hiraganaBasic'
  | 'katakanaBasic'
  | 'modesPracticed'
  | 'scriptsPracticed'
  | 'sentenceRounds'
  | 'studyMinutes'
  | 'goalStreak';

export interface Achievement {
  id: string;
  icon: string;
  category: AchievementCategory;
  metric: AchievementMetric;
  target: number;
  title: Record<AppLanguage, string>;
}

/** Letras de las filas básicas (あ a ん): 46 en cada silabario. */
export const BASIC_LETTER_COUNT = 46;

const t = (es: string, en: string, fr: string, de: string): Record<AppLanguage, string> => ({ es, en, fr, de });

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'rounds-1', icon: '🌱', category: 'rounds', metric: 'rounds', target: 1, title: t('Primer paso', 'First step', 'Premier pas', 'Erster Schritt') },
  { id: 'rounds-10', icon: '🎯', category: 'rounds', metric: 'rounds', target: 10, title: t('En marcha', 'Getting going', 'En route', 'In Fahrt') },
  { id: 'rounds-50', icon: '🏃', category: 'rounds', metric: 'rounds', target: 50, title: t('Constante', 'Consistent', 'Régulier', 'Beständig') },
  { id: 'rounds-100', icon: '💯', category: 'rounds', metric: 'rounds', target: 100, title: t('Cien rondas', 'Centurion', 'Cent séries', 'Hundert Runden') },
  { id: 'rounds-500', icon: '🏯', category: 'rounds', metric: 'rounds', target: 500, title: t('Maestro de rondas', 'Round master', 'Maître des séries', 'Rundenmeister') },

  { id: 'streak-3', icon: '🔥', category: 'streak', metric: 'bestStreak', target: 3, title: t('Encendido', 'On fire', 'En feu', 'Feuer gefangen') },
  { id: 'streak-7', icon: '📅', category: 'streak', metric: 'bestStreak', target: 7, title: t('Una semana', 'One week', 'Une semaine', 'Eine Woche') },
  { id: 'streak-30', icon: '🌙', category: 'streak', metric: 'bestStreak', target: 30, title: t('Un mes', 'One month', 'Un mois', 'Ein Monat') },
  { id: 'streak-100', icon: '⛩️', category: 'streak', metric: 'bestStreak', target: 100, title: t('Imparable', 'Unstoppable', 'Inarrêtable', 'Unaufhaltsam') },

  { id: 'words-10', icon: '📗', category: 'vocabulary', metric: 'wordsLearned', target: 10, title: t('Primeras palabras', 'First words', 'Premiers mots', 'Erste Wörter') },
  { id: 'words-50', icon: '📚', category: 'vocabulary', metric: 'wordsLearned', target: 50, title: t('Vocabulario en crecimiento', 'Growing vocabulary', 'Vocabulaire en croissance', 'Wachsender Wortschatz') },
  { id: 'words-100', icon: '🧠', category: 'vocabulary', metric: 'wordsLearned', target: 100, title: t('Cien palabras', 'A hundred words', 'Cent mots', 'Hundert Wörter') },
  { id: 'words-250', icon: '🎓', category: 'vocabulary', metric: 'wordsLearned', target: 250, title: t('Diccionario andante', 'Walking dictionary', 'Dictionnaire ambulant', 'Wandelndes Wörterbuch') },
  { id: 'words-500', icon: '🏆', category: 'vocabulary', metric: 'wordsLearned', target: 500, title: t('Políglota', 'Polyglot', 'Polyglotte', 'Polyglott') },

  { id: 'perfect-1', icon: '✨', category: 'precision', metric: 'perfectRounds', target: 1, title: t('Sin errores', 'Flawless', 'Sans faute', 'Fehlerfrei') },
  { id: 'perfect-10', icon: '💎', category: 'precision', metric: 'perfectRounds', target: 10, title: t('Puntería', 'Sharpshooter', 'Précision', 'Treffsicher') },
  { id: 'perfect-50', icon: '👑', category: 'precision', metric: 'perfectRounds', target: 50, title: t('Perfeccionista', 'Perfectionist', 'Perfectionniste', 'Perfektionist') },

  { id: 'hiragana-basic', icon: 'あ', category: 'mastery', metric: 'hiraganaBasic', target: BASIC_LETTER_COUNT, title: t('Hiragana básico', 'Hiragana basics', 'Hiragana de base', 'Hiragana-Grundlagen') },
  { id: 'katakana-basic', icon: 'ア', category: 'mastery', metric: 'katakanaBasic', target: BASIC_LETTER_COUNT, title: t('Katakana básico', 'Katakana basics', 'Katakana de base', 'Katakana-Grundlagen') },
  { id: 'both-modes', icon: '✍️', category: 'mastery', metric: 'modesPracticed', target: 2, title: t('Lector y escritor', 'Reader and writer', 'Lecteur et écrivain', 'Leser und Schreiber') },
  { id: 'both-scripts', icon: '🔀', category: 'mastery', metric: 'scriptsPracticed', target: 2, title: t('Dos silabarios', 'Both scripts', 'Deux syllabaires', 'Beide Silbenschriften') },
  { id: 'first-sentences', icon: '文', category: 'mastery', metric: 'sentenceRounds', target: 1, title: t('Primeras oraciones', 'First sentences', 'Premières phrases', 'Erste Sätze') },

  { id: 'time-1h', icon: '🕐', category: 'time', metric: 'studyMinutes', target: 60, title: t('Primera hora', 'First hour', 'Première heure', 'Erste Stunde') },
  { id: 'time-10h', icon: '⏳', category: 'time', metric: 'studyMinutes', target: 600, title: t('Diez horas', 'Ten hours', 'Dix heures', 'Zehn Stunden') },
  { id: 'time-50h', icon: '📘', category: 'time', metric: 'studyMinutes', target: 3000, title: t('Cincuenta horas', 'Fifty hours', 'Cinquante heures', 'Fünfzig Stunden') },
  { id: 'time-100h', icon: '🗾', category: 'time', metric: 'studyMinutes', target: 6000, title: t('Cien horas', 'A hundred hours', 'Cent heures', 'Hundert Stunden') },
  { id: 'time-500h', icon: '🎌', category: 'time', metric: 'studyMinutes', target: 30000, title: t('Quinientas horas', 'Five hundred hours', 'Cinq cents heures', 'Fünfhundert Stunden') },
  { id: 'time-1000h', icon: '🏅', category: 'time', metric: 'studyMinutes', target: 60000, title: t('Mil horas', 'A thousand hours', 'Mille heures', 'Tausend Stunden') },
  { id: 'goal-7', icon: '🎯', category: 'time', metric: 'goalStreak', target: 7, title: t('Semana cumplida', 'Goal week', 'Semaine réussie', 'Ziel-Woche') },
  { id: 'goal-30', icon: '🌟', category: 'time', metric: 'goalStreak', target: 30, title: t('Mes cumplido', 'Goal month', 'Mois réussi', 'Ziel-Monat') },
];

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = ['rounds', 'streak', 'time', 'vocabulary', 'precision', 'mastery'];

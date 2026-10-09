/**
 * Definición de logros. El progreso de cada uno se mide con una métrica (`metric`) y una meta (`target`);
 * se desbloquea cuando la métrica alcanza la meta. Los títulos viven acá en los seis idiomas; las
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

const t = (
  es: string, en: string, fr: string, de: string, pt: string, it: string,
): Record<AppLanguage, string> => ({ es, en, fr, de, pt, it });

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'rounds-1', icon: '🌱', category: 'rounds', metric: 'rounds', target: 1, title: t('Primer paso', 'First step', 'Premier pas', 'Erster Schritt', 'Primeiro passo', 'Primo passo') },
  { id: 'rounds-10', icon: '🎯', category: 'rounds', metric: 'rounds', target: 10, title: t('En marcha', 'Getting going', 'En route', 'In Fahrt', 'Pegando o ritmo', 'Si parte') },
  { id: 'rounds-50', icon: '🏃', category: 'rounds', metric: 'rounds', target: 50, title: t('Constante', 'Consistent', 'Régulier', 'Beständig', 'Constante', 'Costante') },
  { id: 'rounds-100', icon: '💯', category: 'rounds', metric: 'rounds', target: 100, title: t('Cien rondas', 'Centurion', 'Cent séries', 'Hundert Runden', 'Cem rodadas', 'Cento serie') },
  { id: 'rounds-500', icon: '🏯', category: 'rounds', metric: 'rounds', target: 500, title: t('Maestro de rondas', 'Round master', 'Maître des séries', 'Rundenmeister', 'Mestre das rodadas', 'Maestro delle serie') },

  { id: 'streak-3', icon: '🔥', category: 'streak', metric: 'bestStreak', target: 3, title: t('Encendido', 'On fire', 'En feu', 'Feuer gefangen', 'Pegando fogo', 'Acceso') },
  { id: 'streak-7', icon: '📅', category: 'streak', metric: 'bestStreak', target: 7, title: t('Una semana', 'One week', 'Une semaine', 'Eine Woche', 'Uma semana', 'Una settimana') },
  { id: 'streak-30', icon: '🌙', category: 'streak', metric: 'bestStreak', target: 30, title: t('Un mes', 'One month', 'Un mois', 'Ein Monat', 'Um mês', 'Un mese') },
  { id: 'streak-100', icon: '⛩️', category: 'streak', metric: 'bestStreak', target: 100, title: t('Imparable', 'Unstoppable', 'Inarrêtable', 'Unaufhaltsam', 'Imparável', 'Inarrestabile') },

  { id: 'words-10', icon: '📗', category: 'vocabulary', metric: 'wordsLearned', target: 10, title: t('Primeras palabras', 'First words', 'Premiers mots', 'Erste Wörter', 'Primeiras palavras', 'Prime parole') },
  { id: 'words-50', icon: '📚', category: 'vocabulary', metric: 'wordsLearned', target: 50, title: t('Vocabulario en crecimiento', 'Growing vocabulary', 'Vocabulaire en croissance', 'Wachsender Wortschatz', 'Vocabulário em crescimento', 'Vocabolario in crescita') },
  { id: 'words-100', icon: '🧠', category: 'vocabulary', metric: 'wordsLearned', target: 100, title: t('Cien palabras', 'A hundred words', 'Cent mots', 'Hundert Wörter', 'Cem palavras', 'Cento parole') },
  { id: 'words-250', icon: '🎓', category: 'vocabulary', metric: 'wordsLearned', target: 250, title: t('Diccionario andante', 'Walking dictionary', 'Dictionnaire ambulant', 'Wandelndes Wörterbuch', 'Dicionário ambulante', 'Dizionario ambulante') },
  { id: 'words-500', icon: '🏆', category: 'vocabulary', metric: 'wordsLearned', target: 500, title: t('Políglota', 'Polyglot', 'Polyglotte', 'Polyglott', 'Poliglota', 'Poliglotta') },

  { id: 'perfect-1', icon: '✨', category: 'precision', metric: 'perfectRounds', target: 1, title: t('Sin errores', 'Flawless', 'Sans faute', 'Fehlerfrei', 'Sem erros', 'Senza errori') },
  { id: 'perfect-10', icon: '💎', category: 'precision', metric: 'perfectRounds', target: 10, title: t('Puntería', 'Sharpshooter', 'Précision', 'Treffsicher', 'Pontaria', 'Mira perfetta') },
  { id: 'perfect-50', icon: '👑', category: 'precision', metric: 'perfectRounds', target: 50, title: t('Perfeccionista', 'Perfectionist', 'Perfectionniste', 'Perfektionist', 'Perfeccionista', 'Perfezionista') },

  { id: 'hiragana-basic', icon: 'あ', category: 'mastery', metric: 'hiraganaBasic', target: BASIC_LETTER_COUNT, title: t('Hiragana básico', 'Hiragana basics', 'Hiragana de base', 'Hiragana-Grundlagen', 'Hiragana básico', 'Hiragana di base') },
  { id: 'katakana-basic', icon: 'ア', category: 'mastery', metric: 'katakanaBasic', target: BASIC_LETTER_COUNT, title: t('Katakana básico', 'Katakana basics', 'Katakana de base', 'Katakana-Grundlagen', 'Katakana básico', 'Katakana di base') },
  { id: 'both-modes', icon: '✍️', category: 'mastery', metric: 'modesPracticed', target: 2, title: t('Lector y escritor', 'Reader and writer', 'Lecteur et écrivain', 'Leser und Schreiber', 'Leitor e escritor', 'Lettore e scrittore') },
  { id: 'both-scripts', icon: '🔀', category: 'mastery', metric: 'scriptsPracticed', target: 2, title: t('Dos silabarios', 'Both scripts', 'Deux syllabaires', 'Beide Silbenschriften', 'Dois silabários', 'Due sillabari') },
  { id: 'first-sentences', icon: '文', category: 'mastery', metric: 'sentenceRounds', target: 1, title: t('Primeras oraciones', 'First sentences', 'Premières phrases', 'Erste Sätze', 'Primeiras frases', 'Prime frasi') },

  { id: 'time-1h', icon: '🕐', category: 'time', metric: 'studyMinutes', target: 60, title: t('Primera hora', 'First hour', 'Première heure', 'Erste Stunde', 'Primeira hora', 'Prima ora') },
  { id: 'time-10h', icon: '⏳', category: 'time', metric: 'studyMinutes', target: 600, title: t('Diez horas', 'Ten hours', 'Dix heures', 'Zehn Stunden', 'Dez horas', 'Dieci ore') },
  { id: 'time-50h', icon: '📘', category: 'time', metric: 'studyMinutes', target: 3000, title: t('Cincuenta horas', 'Fifty hours', 'Cinquante heures', 'Fünfzig Stunden', 'Cinquenta horas', 'Cinquanta ore') },
  { id: 'time-100h', icon: '🗾', category: 'time', metric: 'studyMinutes', target: 6000, title: t('Cien horas', 'A hundred hours', 'Cent heures', 'Hundert Stunden', 'Cem horas', 'Cento ore') },
  { id: 'time-500h', icon: '🎌', category: 'time', metric: 'studyMinutes', target: 30000, title: t('Quinientas horas', 'Five hundred hours', 'Cinq cents heures', 'Fünfhundert Stunden', 'Quinhentas horas', 'Cinquecento ore') },
  { id: 'time-1000h', icon: '🏅', category: 'time', metric: 'studyMinutes', target: 60000, title: t('Mil horas', 'A thousand hours', 'Mille heures', 'Tausend Stunden', 'Mil horas', 'Mille ore') },
  { id: 'goal-7', icon: '🎯', category: 'time', metric: 'goalStreak', target: 7, title: t('Semana cumplida', 'Goal week', 'Semaine réussie', 'Ziel-Woche', 'Semana cumprida', 'Settimana riuscita') },
  { id: 'goal-30', icon: '🌟', category: 'time', metric: 'goalStreak', target: 30, title: t('Mes cumplido', 'Goal month', 'Mois réussi', 'Ziel-Monat', 'Mês cumprido', 'Mese riuscito') },
];

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = ['rounds', 'streak', 'time', 'vocabulary', 'precision', 'mastery'];

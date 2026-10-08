import type { PracticeKind } from './data/sentences';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AppLanguage = 'en' | 'es' | 'fr' | 'de';
export type LanguagePreference = 'auto' | AppLanguage;

const LANGUAGE_KEY = 'wordgana:language:v1';
const SUPPORTED_LANGUAGES: AppLanguage[] = ['en', 'es', 'fr', 'de'];

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const EN_ITEMS: Record<PracticeKind, string> = { kana: 'characters', words: 'words', sentences: 'sentences' };
const ES_ITEMS: Record<PracticeKind, string> = { kana: 'letras', words: 'palabras', sentences: 'oraciones' };
const FR_ITEMS: Record<PracticeKind, string> = { kana: 'caractères', words: 'mots', sentences: 'phrases' };
const DE_ITEMS: Record<PracticeKind, string> = { kana: 'Zeichen', words: 'Wörter', sentences: 'Sätze' };

export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export function resolveLanguage(locales: readonly string[]): AppLanguage {
  for (const locale of locales) {
    const base = locale?.toLowerCase().split('-')[0] as AppLanguage;
    if (SUPPORTED_LANGUAGES.includes(base)) return base;
  }
  return 'en';
}

function detectDeviceLanguage(): AppLanguage {
  const preferred = typeof navigator === 'undefined'
    ? []
    : [...(navigator.languages ?? []), navigator.language];
  return resolveLanguage(preferred);
}

function loadLanguagePreference(): LanguagePreference {
  try {
    const value = localStorage.getItem(LANGUAGE_KEY);
    return value === 'auto' || SUPPORTED_LANGUAGES.includes(value as AppLanguage)
      ? value as LanguagePreference
      : 'auto';
  } catch {
    return 'auto';
  }
}

export interface Messages {
  autoLanguage: (language: string) => string;
  languageLabel: string;
  languageDescription: string;
  settings: string;
  openSettings: string;
  tagline: string;
  closeHome: string;
  back: string;
  scriptSelector: string;
  result: string;
  letters: string;
  words: string;
  sentences: string;
  rowsTitle: (script: string) => string;
  rowsSummary: (selected: number, total: number, words: number) => string;
  done: string;
  edit: string;
  selectAll: string;
  clearAll: string;
  basicRows: string;
  dakutenRows: string;
  combinationsRows: string;
  specialRows: string;
  doublesConsonants: string;
  lengthensVowel: string;
  contentTitle: string;
  roundsOf: (count: number) => string;
  advancedRounds: (count: number) => string;
  advancedUnlocked: string;
  oneRowMissing: string;
  rowsMissing: (count: number) => string;
  katakanaSentenceNote: string;
  practiceStyleTitle: string;
  read: string;
  write: string;
  readSentenceDescription: string;
  readScriptDescription: (script: string) => string;
  writeSentenceDescription: string;
  writeScriptDescription: (script: string) => string;
  exampleHint: string;
  streak: string;
  today: string;
  days: (count: number) => string;
  rounds: (count: number) => string;
  mastered: (item: string) => string;
  emptyContent: string;
  masteryHint: (percent: number) => string;
  chooseMoreRows: string;
  practiceItems: (count: number, kind: PracticeKind) => string;
  minimumHint: (count: number, kind: PracticeKind) => string;
  answerRomaji: string;
  answerKana: string;
  instructionRomaji: string;
  instructionSentenceKana: string;
  instructionScript: (script: string) => string;
  check: string;
  viewResults: string;
  next: string;
  dontRemember: string;
  correct: string;
  expected: string;
  yourAnswer: string;
  emptyAnswer: string;
  perfectRound: string;
  toReview: (count: number) => string;
  reviewTitle: string;
  reviewMissed: (count: number) => string;
  anotherRound: string;
  backHome: string;
  listen: string;
  audioTitle: string;
  audioDescription: string;
  autoSpeak: string;
  audioUnavailable: string;
  statsTitle: string;
  totalsTitle: string;
  roundsLabel: string;
  bestStreak: string;
  answersLabel: string;
  accuracyLabel: string;
  accuracyByMode: string;
  answersCount: (count: number) => string;
  hardestLetters: string;
  hardestLettersHint: string;
  errorRate: (percent: number) => string;
  hardestWords: string;
  missedOf: (missed: number, seen: number) => string;
  notEnoughData: string;
  noAnswersYet: string;
  reminderTitle: string;
  reminderDescription: string;
  reminderToggle: string;
  reminderTime: string;
  reminderDenied: string;
  notificationStreak: (days: number) => string;
  notificationGeneric: string;
  achievementsTitle: string;
  achievementsCount: (unlocked: number, total: number) => string;
  achievementsUnlocked: (count: number) => string;
  viewAchievements: string;
  nextAchievement: string;
  allAchievementsDone: string;
  unlockedOn: (date: string) => string;
  categoryRounds: string;
  categoryStreak: string;
  categoryVocabulary: string;
  categoryPrecision: string;
  categoryMastery: string;
  achRounds: (count: number) => string;
  achStreak: (count: number) => string;
  achWords: (count: number) => string;
  achPerfect: (count: number) => string;
  achBasic: (script: string) => string;
  achBothModes: string;
  achBothScripts: string;
  achSentences: string;
  studyTimeTitle: string;
  durationHM: (hours: number, minutes: number) => string;
  durationM: (minutes: number) => string;
  goalProgress: (done: number, goal: number) => string;
  goalReached: string;
  goalRemaining: (minutes: number) => string;
  noGoalHint: string;
  goalStreakLabel: string;
  lastDaysTitle: string;
  range7: string;
  range28: string;
  rangeAll: string;
  goalLine: (minutes: number) => string;
  byCategoryTitle: string;
  totalLabel: string;
  thisWeekLabel: string;
  dailyAverageLabel: string;
  noStudyYet: string;
  dailyGoalTitle: string;
  dailyGoalDescription: string;
  noGoal: string;
  otherCategory: string;
  studyCategoryNames: Record<'listening' | 'reading' | 'class' | 'conversation' | 'handwriting' | 'apps', string>;
  notificationGoal: (minutes: number) => string;
  dayDetail: (date: string, duration: string) => string;
  startTimer: string;
  addTime: string;
  stopTimer: string;
  timerRunning: string;
  chooseCategory: string;
  startTimerAction: string;
  categoryLabel: string;
  newCategory: string;
  categoryName: string;
  categoryNamePlaceholder: string;
  categoryIcon: string;
  createCategory: string;
  cancel: string;
  durationLabel: string;
  minutesUnit: string;
  dayLabel: string;
  yesterday: string;
  otherDay: string;
  noteLabel: string;
  notePlaceholder: string;
  save: string;
  addTimeTitle: string;
  editEntryTitle: string;
  stopTimerTitle: string;
  discardTimer: string;
  longTimerWarning: string;
  invalidDuration: string;
  invalidDay: string;
  invalidCategory: string;
  timerPausesAuto: string;
  categoriesTitle: string;
  yourCategories: string;
  noCustomCategories: string;
  rename: string;
  removeCategory: string;
  archivedNote: string;
  builtInCategoriesTitle: string;
  timerShort: string;
  confirmRemoveCategory: (name: string) => string;
  historyTitle: string;
  sourceAuto: string;
  sourceTimer: string;
  sourceManual: string;
  deleteEntry: string;
  deleteShort: string;
  confirmDeleteEntry: (label: string, duration: string) => string;
  emptyHistory: string;
  editEntryHint: string;
  categoryTime: string;
  achStudyHours: (hours: number) => string;
  achGoalStreak: (days: number) => string;
}

export const MESSAGES: Record<AppLanguage, Messages> = {
  en: {
    autoLanguage: (language) => `Automatic (${language})`, languageLabel: 'Language',
    languageDescription: "Use your device's language or choose one for WordGana.", settings: 'Settings', openSettings: 'Open settings',
    tagline: 'Practice Japanese with real words, one row at a time.', closeHome: 'Close and return home', back: 'Back',
    scriptSelector: 'Writing system to practice', result: 'Results', letters: 'Characters', words: 'Words', sentences: 'Sentences',
    rowsTitle: (script) => `1. ${capitalize(script)} rows`,
    rowsSummary: (selected, total, words) => `${selected} of ${total} selected · ${words} words`,
    done: 'Done', edit: 'Edit', selectAll: 'Select all', clearAll: 'Clear all', basicRows: 'Basic',
    dakutenRows: 'With dakuten (゛゜)', combinationsRows: 'Combinations (ゃゅょ)', specialRows: 'Special',
    doublesConsonants: 'doubles consonants', lengthensVowel: 'lengthens the vowel',
    contentTitle: '2. What do you want to practice?', roundsOf: (count) => `Rounds of ${count}`,
    advancedRounds: (count) => `Advanced · rounds of ${count}`,
    advancedUnlocked: 'Advanced mode unlocked! You can now practice sentences.',
    oneRowMissing: 'Select 1 more row to unlock Sentences.', rowsMissing: (count) => `Select ${count} more rows to unlock Sentences.`,
    katakanaSentenceNote: 'Sentences combine katakana with hiragana, as naturally written Japanese does.',
    practiceStyleTitle: '3. How do you want to practice?', read: 'Read', write: 'Write',
    readSentenceDescription: 'See a sentence and type it in romaji',
    readScriptDescription: (script) => `See ${script} and type it in romaji`,
    writeSentenceDescription: 'See romaji and type the sentence in kana',
    writeScriptDescription: (script) => `See romaji and type it in ${script} (Japanese keyboard required)`,
    exampleHint: 'Select a row to see a real example here.', streak: 'Streak', today: 'Today',
    days: (count) => `${count} ${count === 1 ? 'day' : 'days'}`,
    rounds: (count) => `${count} ${count === 1 ? 'round' : 'rounds'}`,
    mastered: (item) => `${item} mastered`, emptyContent: 'Select rows to get practice content.',
    masteryHint: (percent) => `${percent}% mastered · each item needs two correct answers in a row.`,
    chooseMoreRows: 'Select more rows',
    practiceItems: (count, kind) => `Practice ${count} ${EN_ITEMS[kind]}`,
    minimumHint: (count, kind) => `Select more rows: at least ${count} available ${EN_ITEMS[kind]} are required.`,
    answerRomaji: 'Your answer in romaji', answerKana: 'Your answer in kana', instructionRomaji: 'type in romaji',
    instructionSentenceKana: 'type the sentence in kana', instructionScript: (script) => `type in ${script}`,
    check: 'Check', viewResults: 'View results', next: 'Next', dontRemember: 'Skip',
    correct: 'Correct! ', expected: 'Answer: ', yourAnswer: 'Your answer: ', emptyAnswer: '(empty)',
    perfectRound: 'Perfect round!', toReview: (count) => `${count} to review`, reviewTitle: 'Review',
    reviewMissed: (count) => count === 1 ? 'Review the missed item' : `Review the ${count} missed items`,
    anotherRound: 'Another round', backHome: 'Back to home',
    listen: 'Listen to pronunciation',
    audioTitle: 'Pronunciation',
    audioDescription: 'Hear each answer with your device’s Japanese voice. Works offline.',
    autoSpeak: 'Play after each answer',
    audioUnavailable: 'Your device has no Japanese voice. On iPhone, add one in Settings → Accessibility → Spoken Content → Voices → Japanese.',
    statsTitle: 'Statistics',
    totalsTitle: 'All time',
    roundsLabel: 'Rounds',
    bestStreak: 'Best streak',
    answersLabel: 'Answers',
    accuracyLabel: 'Accuracy',
    accuracyByMode: 'Accuracy by mode',
    answersCount: (count) => `${count} ${count === 1 ? 'answer' : 'answers'}`,
    hardestLetters: 'Trickiest characters',
    hardestLettersHint: 'Based on your answers to characters, words and sentences.',
    errorRate: (percent) => `${percent}% missed`,
    hardestWords: 'Words to review',
    missedOf: (missed, seen) => `${missed} of ${seen} missed`,
    notEnoughData: 'Not enough answers yet. Keep practicing and you’ll see what to focus on here.',
    noAnswersYet: 'No answers yet',
    reminderTitle: 'Daily reminder',
    reminderDescription: 'A notification at the time you choose, only on days you haven’t practiced yet.',
    reminderToggle: 'Remind me to practice',
    reminderTime: 'Time',
    reminderDenied: 'Notifications are turned off for WordGana. Turn them on in Settings → Notifications → WordGana.',
    notificationStreak: (days) => `Your ${days}-day streak is waiting. One quick round?`,
    notificationGeneric: 'Time for a quick round of kana. Just two minutes!',
    achievementsTitle: 'Achievements',
    achievementsCount: (unlocked, total) => `${unlocked} of ${total}`,
    achievementsUnlocked: (count) => count === 1 ? 'Achievement unlocked!' : `${count} achievements unlocked!`,
    viewAchievements: 'See all achievements',
    nextAchievement: 'Up next',
    allAchievementsDone: 'You unlocked every achievement. お疲れさま!',
    unlockedOn: (date) => `Unlocked ${date}`,
    categoryRounds: 'Rounds',
    categoryStreak: 'Streak',
    categoryVocabulary: 'Vocabulary',
    categoryPrecision: 'Precision',
    categoryMastery: 'Scripts and modes',
    achRounds: (count) => count === 1 ? 'Finish your first round' : `Finish ${count} rounds`,
    achStreak: (count) => `Practice ${count} days in a row`,
    achWords: (count) => `Master ${count} words`,
    achPerfect: (count) => count === 1 ? 'Finish a round of 5 or more without mistakes' : `Finish ${count} rounds without mistakes`,
    achBasic: (script) => `Master all basic ${script} characters in Characters mode`,
    achBothModes: 'Finish rounds in both Read and Write',
    achBothScripts: 'Practice both hiragana and katakana',
    achSentences: 'Finish a round of sentences',
    studyTimeTitle: 'Study time',
    durationHM: (hours, minutes) => minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`,
    durationM: (minutes) => `${minutes} min`,
    goalProgress: (done, goal) => `${done} / ${goal} min`,
    goalReached: 'Daily goal reached!',
    goalRemaining: (minutes) => `${minutes} min left to reach today’s goal`,
    noGoalHint: 'Set a daily goal in Settings to track it here.',
    goalStreakLabel: 'Goal streak',
    lastDaysTitle: 'Day by day',
    range7: '7 days',
    range28: '4 weeks',
    rangeAll: 'All time',
    goalLine: (minutes) => `Goal ${minutes} min`,
    byCategoryTitle: 'By category',
    totalLabel: 'Total',
    thisWeekLabel: 'Last 7 days',
    dailyAverageLabel: 'Daily average',
    noStudyYet: 'No time logged yet. Practice a round and it’s counted automatically.',
    dailyGoalTitle: 'Daily goal',
    dailyGoalDescription: 'How many minutes of Japanese you want to study each day, in WordGana or elsewhere.',
    noGoal: 'No goal',
    otherCategory: 'Other',
    studyCategoryNames: { listening: 'Listening', reading: 'Reading', class: 'Class', conversation: 'Conversation', handwriting: 'Handwriting', apps: 'Other apps' },
    notificationGoal: (minutes) => `Ready for today’s ${minutes} minutes of Japanese?`,
    dayDetail: (date, duration) => `${date}: ${duration}`,
    startTimer: 'Start timer',
    addTime: 'Add time',
    stopTimer: 'Stop',
    timerRunning: 'Timer running',
    chooseCategory: 'What are you studying?',
    startTimerAction: 'Start',
    categoryLabel: 'Category',
    newCategory: 'New category',
    categoryName: 'Name',
    categoryNamePlaceholder: 'For example: Anime',
    categoryIcon: 'Icon',
    createCategory: 'Create',
    cancel: 'Cancel',
    durationLabel: 'Duration',
    minutesUnit: 'minutes',
    dayLabel: 'Day',
    yesterday: 'Yesterday',
    otherDay: 'Other day',
    noteLabel: 'Note (optional)',
    notePlaceholder: 'For example: Genki chapter 3',
    save: 'Save',
    addTimeTitle: 'Add time',
    editEntryTitle: 'Edit entry',
    stopTimerTitle: 'Save session',
    discardTimer: 'Discard timer',
    longTimerWarning: 'The timer ran for more than 4 hours. Check the duration before saving.',
    invalidDuration: 'Enter between 1 and 720 minutes.',
    invalidDay: 'Choose today or a past day.',
    invalidCategory: 'Choose a category.',
    timerPausesAuto: 'While the timer runs, practice in WordGana isn’t counted separately.',
    categoriesTitle: 'Categories',
    yourCategories: 'Your categories',
    noCustomCategories: 'You haven’t created any categories yet.',
    rename: 'Rename',
    removeCategory: 'Remove',
    archivedNote: 'Categories with logged time are archived: they’re no longer offered for new entries but stay in your history.',
    builtInCategoriesTitle: 'Included',
    timerShort: 'Timer',
    confirmRemoveCategory: (name) => `Remove “${name}”? It won’t be offered for new entries.`,
    historyTitle: 'History',
    sourceAuto: 'In WordGana',
    sourceTimer: 'Timer',
    sourceManual: 'Added manually',
    deleteEntry: 'Delete entry',
    deleteShort: 'Delete',
    confirmDeleteEntry: (label, duration) => `Delete ${duration} of ${label}? This can’t be undone.`,
    emptyHistory: 'No entries yet. Practice a round or add time to see it here.',
    editEntryHint: 'Edit',
    categoryTime: 'Study time',
    achStudyHours: (hours) => hours === 1 ? 'Log your first hour of Japanese' : `Log ${hours} hours of Japanese`,
    achGoalStreak: (days) => `Reach your daily goal ${days} days in a row`,
  },
  es: {
    autoLanguage: (language) => `Automático (${language})`, languageLabel: 'Idioma',
    languageDescription: 'Usá el idioma de tu dispositivo o elegí uno para WordGana.', settings: 'Configuración', openSettings: 'Abrir configuración',
    tagline: 'Practicá japonés con palabras reales, fila por fila.', closeHome: 'Cerrar y volver al inicio', back: 'Volver',
    scriptSelector: 'Silabario para practicar', result: 'Resultado', letters: 'Letras', words: 'Palabras', sentences: 'Oraciones',
    rowsTitle: (script) => `1. Filas de ${script}`,
    rowsSummary: (selected, total, words) => `${selected} de ${total} seleccionadas · ${words} palabras`,
    done: 'Listo', edit: 'Editar', selectAll: 'Seleccionar todas', clearAll: 'Quitar todas', basicRows: 'Básicas',
    dakutenRows: 'Con dakuten (゛゜)', combinationsRows: 'Combinaciones (ゃゅょ)', specialRows: 'Especial',
    doublesConsonants: 'duplica consonantes', lengthensVowel: 'alarga la vocal',
    contentTitle: '2. ¿Qué querés practicar?', roundsOf: (count) => `Rondas de ${count}`,
    advancedRounds: (count) => `Avanzado · rondas de ${count}`,
    advancedUnlocked: '¡Modo avanzado desbloqueado! Ya podés practicar oraciones.',
    oneRowMissing: 'Te falta 1 fila para desbloquear Oraciones.', rowsMissing: (count) => `Te faltan ${count} filas para desbloquear Oraciones.`,
    katakanaSentenceNote: 'Las oraciones combinan katakana con hiragana, como se escribe naturalmente en japonés.',
    practiceStyleTitle: '3. ¿Cómo querés practicar?', read: 'Leer', write: 'Escribir',
    readSentenceDescription: 'Te muestro una oración, escribís en romaji',
    readScriptDescription: (script) => `Te muestro ${script}, escribís en romaji`,
    writeSentenceDescription: 'Te muestro romaji, escribís la oración en kana',
    writeScriptDescription: (script) => `Te muestro romaji, escribís en ${script} (necesitás teclado japonés)`,
    exampleHint: 'Activá alguna fila para ver un ejemplo real acá.', streak: 'Racha', today: 'Hoy',
    days: (count) => `${count} ${count === 1 ? 'día' : 'días'}`,
    rounds: (count) => `${count} ${count === 1 ? 'ronda' : 'rondas'}`,
    mastered: (item) => `${item} afianzadas`, emptyContent: 'Activá filas para tener contenido con el que practicar.',
    masteryHint: (percent) => `${percent}% afianzado · hacen falta dos aciertos seguidos por ítem.`,
    chooseMoreRows: 'Elegí más filas', practiceItems: (count, kind) => `Practicar ${count} ${ES_ITEMS[kind]}`,
    minimumHint: (count, kind) => `Activá más filas: hacen falta al menos ${count} ${ES_ITEMS[kind]} disponibles.`,
    answerRomaji: 'Tu respuesta en romaji', answerKana: 'Tu respuesta en kana', instructionRomaji: 'escribí en romaji',
    instructionSentenceKana: 'escribí la oración en kana', instructionScript: (script) => `escribí en ${script}`,
    check: 'Comprobar', viewResults: 'Ver resultados', next: 'Siguiente', dontRemember: 'Omitir',
    correct: '¡Bien! ', expected: 'Era: ', yourAnswer: 'Tu respuesta: ', emptyAnswer: '(vacía)',
    perfectRound: '¡Ronda perfecta!', toReview: (count) => `${count} para repasar`, reviewTitle: 'Para repasar',
    reviewMissed: (count) => count === 1 ? 'Repasar la que costó' : `Repasar las ${count} que costaron`,
    anotherRound: 'Otra ronda', backHome: 'Volver al inicio',
    listen: 'Escuchar pronunciación',
    audioTitle: 'Pronunciación',
    audioDescription: 'Escuchá cada respuesta con la voz japonesa de tu dispositivo. Funciona sin conexión.',
    autoSpeak: 'Reproducir al responder',
    audioUnavailable: 'Tu dispositivo no tiene una voz japonesa. En iPhone podés agregarla en Ajustes → Accesibilidad → Contenido leído → Voces → Japonés.',
    statsTitle: 'Estadísticas',
    totalsTitle: 'Desde que empezaste',
    roundsLabel: 'Rondas',
    bestStreak: 'Mejor racha',
    answersLabel: 'Respuestas',
    accuracyLabel: 'Aciertos',
    accuracyByMode: 'Aciertos por modo',
    answersCount: (count) => `${count} ${count === 1 ? 'respuesta' : 'respuestas'}`,
    hardestLetters: 'Letras que más te cuestan',
    hardestLettersHint: 'Según tus respuestas en letras, palabras y oraciones.',
    errorRate: (percent) => `${percent}% mal`,
    hardestWords: 'Palabras para repasar',
    missedOf: (missed, seen) => `${missed} de ${seen} mal`,
    notEnoughData: 'Todavía no hay suficientes respuestas. Seguí practicando y acá vas a ver en qué conviene enfocarte.',
    noAnswersYet: 'Sin respuestas todavía',
    reminderTitle: 'Recordatorio diario',
    reminderDescription: 'Un aviso a la hora que elijas, solo los días que todavía no practicaste.',
    reminderToggle: 'Recordarme practicar',
    reminderTime: 'Hora',
    reminderDenied: 'Las notificaciones de WordGana están desactivadas. Activalas en Ajustes → Notificaciones → WordGana.',
    notificationStreak: (days) => `Tu racha de ${days} ${days === 1 ? 'día' : 'días'} te espera. ¿Una ronda rápida?`,
    notificationGeneric: '¿Una ronda rápida de kana? Son solo dos minutos.',
    achievementsTitle: 'Logros',
    achievementsCount: (unlocked, total) => `${unlocked} de ${total}`,
    achievementsUnlocked: (count) => count === 1 ? '¡Logro desbloqueado!' : `¡${count} logros desbloqueados!`,
    viewAchievements: 'Ver todos los logros',
    nextAchievement: 'Tu próximo logro',
    allAchievementsDone: 'Desbloqueaste todos los logros. ¡お疲れさま!',
    unlockedOn: (date) => `Desbloqueado el ${date}`,
    categoryRounds: 'Rondas',
    categoryStreak: 'Racha',
    categoryVocabulary: 'Vocabulario',
    categoryPrecision: 'Precisión',
    categoryMastery: 'Silabarios y modos',
    achRounds: (count) => count === 1 ? 'Terminá tu primera ronda' : `Terminá ${count} rondas`,
    achStreak: (count) => `Practicá ${count} días seguidos`,
    achWords: (count) => `Afianzá ${count} palabras`,
    achPerfect: (count) => count === 1 ? 'Terminá una ronda de 5 o más sin errores' : `Terminá ${count} rondas sin errores`,
    achBasic: (script) => `Afianzá todas las letras básicas de ${script} en Letras`,
    achBothModes: 'Terminá rondas en Leer y en Escribir',
    achBothScripts: 'Practicá hiragana y katakana',
    achSentences: 'Terminá una ronda de oraciones',
    studyTimeTitle: 'Tiempo de estudio',
    durationHM: (hours, minutes) => minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`,
    durationM: (minutes) => `${minutes} min`,
    goalProgress: (done, goal) => `${done} / ${goal} min`,
    goalReached: '¡Meta del día cumplida!',
    goalRemaining: (minutes) => `Te faltan ${minutes} min para la meta de hoy`,
    noGoalHint: 'Elegí una meta diaria en Configuración para seguirla acá.',
    goalStreakLabel: 'Racha de metas',
    lastDaysTitle: 'Día por día',
    range7: '7 días',
    range28: '4 semanas',
    rangeAll: 'Todo',
    goalLine: (minutes) => `Meta ${minutes} min`,
    byCategoryTitle: 'Por categoría',
    totalLabel: 'Total',
    thisWeekLabel: 'Últimos 7 días',
    dailyAverageLabel: 'Promedio diario',
    noStudyYet: 'Todavía no hay tiempo registrado. Practicá una ronda y se cuenta solo.',
    dailyGoalTitle: 'Meta diaria',
    dailyGoalDescription: 'Cuántos minutos de japonés querés estudiar por día, en WordGana o fuera de la app.',
    noGoal: 'Sin meta',
    otherCategory: 'Otra',
    studyCategoryNames: { listening: 'Escucha', reading: 'Lectura', class: 'Clase', conversation: 'Conversación', handwriting: 'Escritura a mano', apps: 'Otras apps' },
    notificationGoal: (minutes) => `¿Hacemos los ${minutes} minutos de japonés de hoy?`,
    dayDetail: (date, duration) => `${date}: ${duration}`,
    startTimer: 'Iniciar cronómetro',
    addTime: 'Agregar tiempo',
    stopTimer: 'Detener',
    timerRunning: 'Cronómetro en marcha',
    chooseCategory: '¿Qué vas a estudiar?',
    startTimerAction: 'Empezar',
    categoryLabel: 'Categoría',
    newCategory: 'Nueva categoría',
    categoryName: 'Nombre',
    categoryNamePlaceholder: 'Por ejemplo: Anime',
    categoryIcon: 'Ícono',
    createCategory: 'Crear',
    cancel: 'Cancelar',
    durationLabel: 'Duración',
    minutesUnit: 'minutos',
    dayLabel: 'Día',
    yesterday: 'Ayer',
    otherDay: 'Otro día',
    noteLabel: 'Nota (opcional)',
    notePlaceholder: 'Por ejemplo: capítulo 3 de Genki',
    save: 'Guardar',
    addTimeTitle: 'Agregar tiempo',
    editEntryTitle: 'Editar registro',
    stopTimerTitle: 'Guardar sesión',
    discardTimer: 'Descartar cronómetro',
    longTimerWarning: 'El cronómetro estuvo andando más de 4 horas. Revisá la duración antes de guardar.',
    invalidDuration: 'Ingresá entre 1 y 720 minutos.',
    invalidDay: 'Elegí hoy o un día anterior.',
    invalidCategory: 'Elegí una categoría.',
    timerPausesAuto: 'Mientras corre el cronómetro, practicar en WordGana no suma tiempo aparte.',
    categoriesTitle: 'Categorías',
    yourCategories: 'Tus categorías',
    noCustomCategories: 'Todavía no creaste categorías.',
    rename: 'Renombrar',
    removeCategory: 'Quitar',
    archivedNote: 'Si una categoría ya tiene tiempo registrado, se archiva: no se ofrece para cargar más, pero sigue en el historial.',
    builtInCategoriesTitle: 'Incluidas',
    timerShort: 'Cronómetro',
    confirmRemoveCategory: (name) => `¿Quitar “${name}”? No se va a ofrecer para cargar tiempo.`,
    historyTitle: 'Historial',
    sourceAuto: 'En WordGana',
    sourceTimer: 'Cronómetro',
    sourceManual: 'Cargado a mano',
    deleteEntry: 'Borrar registro',
    deleteShort: 'Borrar',
    confirmDeleteEntry: (label, duration) => `¿Borrar ${duration} de ${label}? No se puede deshacer.`,
    emptyHistory: 'Todavía no hay registros. Practicá una ronda o agregá tiempo para verlo acá.',
    editEntryHint: 'Editar',
    categoryTime: 'Tiempo de estudio',
    achStudyHours: (hours) => hours === 1 ? 'Registrá tu primera hora de japonés' : `Registrá ${hours} horas de japonés`,
    achGoalStreak: (days) => `Cumplí tu meta diaria ${days} días seguidos`,
  },
  fr: {
    autoLanguage: (language) => `Automatique (${language})`, languageLabel: 'Langue',
    languageDescription: "Utilisez la langue de votre appareil ou choisissez-en une pour WordGana.", settings: 'Réglages', openSettings: 'Ouvrir les réglages',
    tagline: 'Pratiquez le japonais avec de vrais mots, ligne par ligne.', closeHome: "Fermer et revenir à l'accueil", back: 'Retour',
    scriptSelector: "Système d'écriture à pratiquer", result: 'Résultats', letters: 'Caractères', words: 'Mots', sentences: 'Phrases',
    rowsTitle: (script) => `1. Lignes de ${script}`,
    rowsSummary: (selected, total, words) => `${selected} sur ${total} sélectionnées · ${words} mots`,
    done: 'Terminé', edit: 'Modifier', selectAll: 'Tout sélectionner', clearAll: 'Tout désélectionner', basicRows: 'Bases',
    dakutenRows: 'Avec dakuten (゛゜)', combinationsRows: 'Combinaisons (ゃゅょ)', specialRows: 'Spécial',
    doublesConsonants: 'double les consonnes', lengthensVowel: 'allonge la voyelle',
    contentTitle: '2. Que voulez-vous pratiquer ?', roundsOf: (count) => `Séries de ${count}`,
    advancedRounds: (count) => `Avancé · séries de ${count}`,
    advancedUnlocked: 'Mode avancé débloqué ! Vous pouvez maintenant pratiquer des phrases.',
    oneRowMissing: 'Sélectionnez encore 1 ligne pour débloquer les Phrases.', rowsMissing: (count) => `Sélectionnez encore ${count} lignes pour débloquer les Phrases.`,
    katakanaSentenceNote: "Les phrases combinent katakana et hiragana, comme dans l'écriture japonaise naturelle.",
    practiceStyleTitle: '3. Comment voulez-vous pratiquer ?', read: 'Lire', write: 'Écrire',
    readSentenceDescription: 'Voyez une phrase et écrivez-la en romaji',
    readScriptDescription: (script) => `Voyez du ${script} et écrivez en romaji`,
    writeSentenceDescription: 'Voyez du romaji et écrivez la phrase en kana',
    writeScriptDescription: (script) => `Voyez du romaji et écrivez en ${script} (clavier japonais requis)`,
    exampleHint: 'Sélectionnez une ligne pour voir un exemple réel ici.', streak: 'Série', today: "Aujourd'hui",
    days: (count) => `${count} ${count === 1 ? 'jour' : 'jours'}`,
    rounds: (count) => `${count} ${count === 1 ? 'série' : 'séries'}`,
    mastered: (item) => `Maîtrise : ${item}`, emptyContent: 'Sélectionnez des lignes pour obtenir du contenu à pratiquer.',
    masteryHint: (percent) => `${percent} % maîtrisé · chaque élément nécessite deux bonnes réponses consécutives.`,
    chooseMoreRows: 'Sélectionnez plus de lignes', practiceItems: (count, kind) => `Pratiquer ${count} ${FR_ITEMS[kind]}`,
    minimumHint: (count, kind) => `Sélectionnez plus de lignes : il faut au moins ${count} ${FR_ITEMS[kind]} disponibles.`,
    answerRomaji: 'Votre réponse en romaji', answerKana: 'Votre réponse en kana', instructionRomaji: 'écrivez en romaji',
    instructionSentenceKana: 'écrivez la phrase en kana', instructionScript: (script) => `écrivez en ${script}`,
    check: 'Vérifier', viewResults: 'Voir les résultats', next: 'Suivant', dontRemember: 'Passer',
    correct: 'Correct ! ', expected: 'Réponse : ', yourAnswer: 'Votre réponse : ', emptyAnswer: '(vide)',
    perfectRound: 'Série parfaite !', toReview: (count) => `${count} à revoir`, reviewTitle: 'À revoir',
    reviewMissed: (count) => count === 1 ? "Revoir l'élément manqué" : `Revoir les ${count} éléments manqués`,
    anotherRound: 'Une autre série', backHome: "Retour à l'accueil",
    listen: 'Écouter la prononciation',
    audioTitle: 'Prononciation',
    audioDescription: 'Écoutez chaque réponse avec la voix japonaise de votre appareil. Fonctionne hors ligne.',
    autoSpeak: 'Lire après chaque réponse',
    audioUnavailable: 'Votre appareil n’a pas de voix japonaise. Sur iPhone, ajoutez-en une dans Réglages → Accessibilité → Contenu énoncé → Voix → Japonais.',
    statsTitle: 'Statistiques',
    totalsTitle: "Depuis le début",
    roundsLabel: 'Séries',
    bestStreak: 'Meilleure série',
    answersLabel: 'Réponses',
    accuracyLabel: 'Réussite',
    accuracyByMode: 'Réussite par mode',
    answersCount: (count) => `${count} ${count === 1 ? 'réponse' : 'réponses'}`,
    hardestLetters: 'Caractères les plus difficiles',
    hardestLettersHint: 'D’après vos réponses aux caractères, mots et phrases.',
    errorRate: (percent) => `${percent} % ratées`,
    hardestWords: 'Mots à revoir',
    missedOf: (missed, seen) => `${missed} sur ${seen} ratées`,
    notEnoughData: 'Pas encore assez de réponses. Continuez à pratiquer et vous verrez ici sur quoi vous concentrer.',
    noAnswersYet: 'Pas encore de réponses',
    reminderTitle: 'Rappel quotidien',
    reminderDescription: 'Une notification à l’heure choisie, uniquement les jours où vous n’avez pas encore pratiqué.',
    reminderToggle: 'Me rappeler de pratiquer',
    reminderTime: 'Heure',
    reminderDenied: 'Les notifications de WordGana sont désactivées. Activez-les dans Réglages → Notifications → WordGana.',
    notificationStreak: (days) => `Votre série de ${days} ${days === 1 ? 'jour' : 'jours'} vous attend. Une petite série ?`,
    notificationGeneric: 'Une petite série de kana ? Deux minutes suffisent.',
    achievementsTitle: 'Succès',
    achievementsCount: (unlocked, total) => `${unlocked} sur ${total}`,
    achievementsUnlocked: (count) => count === 1 ? 'Succès débloqué !' : `${count} succès débloqués !`,
    viewAchievements: 'Voir tous les succès',
    nextAchievement: 'Prochain succès',
    allAchievementsDone: 'Vous avez débloqué tous les succès. お疲れさま !',
    unlockedOn: (date) => `Débloqué le ${date}`,
    categoryRounds: 'Séries',
    categoryStreak: 'Régularité',
    categoryVocabulary: 'Vocabulaire',
    categoryPrecision: 'Précision',
    categoryMastery: 'Syllabaires et modes',
    achRounds: (count) => count === 1 ? 'Terminez votre première série' : `Terminez ${count} séries`,
    achStreak: (count) => `Pratiquez ${count} jours d’affilée`,
    achWords: (count) => `Maîtrisez ${count} mots`,
    achPerfect: (count) => count === 1 ? 'Terminez une série de 5 ou plus sans faute' : `Terminez ${count} séries sans faute`,
    achBasic: (script) => `Maîtrisez tous les caractères ${script} de base en mode Caractères`,
    achBothModes: 'Terminez des séries en Lire et en Écrire',
    achBothScripts: 'Pratiquez les hiragana et les katakana',
    achSentences: 'Terminez une série de phrases',
    studyTimeTitle: 'Temps d’étude',
    durationHM: (hours, minutes) => minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`,
    durationM: (minutes) => `${minutes} min`,
    goalProgress: (done, goal) => `${done} / ${goal} min`,
    goalReached: 'Objectif du jour atteint !',
    goalRemaining: (minutes) => `Encore ${minutes} min pour l’objectif du jour`,
    noGoalHint: 'Choisissez un objectif quotidien dans les Réglages pour le suivre ici.',
    goalStreakLabel: 'Série d’objectifs',
    lastDaysTitle: 'Jour par jour',
    range7: '7 jours',
    range28: '4 semaines',
    rangeAll: 'Tout',
    goalLine: (minutes) => `Objectif ${minutes} min`,
    byCategoryTitle: 'Par catégorie',
    totalLabel: 'Total',
    thisWeekLabel: '7 derniers jours',
    dailyAverageLabel: 'Moyenne quotidienne',
    noStudyYet: 'Aucun temps enregistré. Faites une série et il sera compté automatiquement.',
    dailyGoalTitle: 'Objectif quotidien',
    dailyGoalDescription: 'Combien de minutes de japonais vous voulez étudier par jour, dans WordGana ou ailleurs.',
    noGoal: 'Sans objectif',
    otherCategory: 'Autre',
    studyCategoryNames: { listening: 'Écoute', reading: 'Lecture', class: 'Cours', conversation: 'Conversation', handwriting: 'Écriture à la main', apps: 'Autres applis' },
    notificationGoal: (minutes) => `Prêt pour vos ${minutes} minutes de japonais du jour ?`,
    dayDetail: (date, duration) => `${date} : ${duration}`,
    startTimer: 'Lancer le chrono',
    addTime: 'Ajouter du temps',
    stopTimer: 'Arrêter',
    timerRunning: 'Chrono en cours',
    chooseCategory: 'Qu’allez-vous étudier ?',
    startTimerAction: 'Commencer',
    categoryLabel: 'Catégorie',
    newCategory: 'Nouvelle catégorie',
    categoryName: 'Nom',
    categoryNamePlaceholder: 'Par exemple : Anime',
    categoryIcon: 'Icône',
    createCategory: 'Créer',
    cancel: 'Annuler',
    durationLabel: 'Durée',
    minutesUnit: 'minutes',
    dayLabel: 'Jour',
    yesterday: 'Hier',
    otherDay: 'Autre jour',
    noteLabel: 'Note (facultatif)',
    notePlaceholder: 'Par exemple : chapitre 3 de Genki',
    save: 'Enregistrer',
    addTimeTitle: 'Ajouter du temps',
    editEntryTitle: 'Modifier l’entrée',
    stopTimerTitle: 'Enregistrer la session',
    discardTimer: 'Abandonner le chrono',
    longTimerWarning: 'Le chrono a tourné plus de 4 heures. Vérifiez la durée avant d’enregistrer.',
    invalidDuration: 'Saisissez entre 1 et 720 minutes.',
    invalidDay: 'Choisissez aujourd’hui ou un jour passé.',
    invalidCategory: 'Choisissez une catégorie.',
    timerPausesAuto: 'Pendant le chrono, la pratique dans WordGana n’est pas comptée en plus.',
    categoriesTitle: 'Catégories',
    yourCategories: 'Vos catégories',
    noCustomCategories: 'Vous n’avez pas encore créé de catégorie.',
    rename: 'Renommer',
    removeCategory: 'Retirer',
    archivedNote: 'Une catégorie avec du temps enregistré est archivée : elle n’est plus proposée mais reste dans l’historique.',
    builtInCategoriesTitle: 'Incluses',
    timerShort: 'Chrono',
    confirmRemoveCategory: (name) => `Retirer « ${name} » ? Elle ne sera plus proposée.`,
    historyTitle: 'Historique',
    sourceAuto: 'Dans WordGana',
    sourceTimer: 'Chrono',
    sourceManual: 'Ajouté à la main',
    deleteEntry: 'Supprimer l’entrée',
    deleteShort: 'Supprimer',
    confirmDeleteEntry: (label, duration) => `Supprimer ${duration} de ${label} ? Action irréversible.`,
    emptyHistory: 'Aucune entrée. Faites une série ou ajoutez du temps pour la voir ici.',
    editEntryHint: 'Modifier',
    categoryTime: 'Temps d’étude',
    achStudyHours: (hours) => hours === 1 ? 'Enregistrez votre première heure de japonais' : `Enregistrez ${hours} heures de japonais`,
    achGoalStreak: (days) => `Atteignez votre objectif quotidien ${days} jours d’affilée`,
  },
  de: {
    autoLanguage: (language) => `Automatisch (${language})`, languageLabel: 'Sprache',
    languageDescription: 'Verwende die Sprache deines Geräts oder wähle eine für WordGana.', settings: 'Einstellungen', openSettings: 'Einstellungen öffnen',
    tagline: 'Übe Japanisch mit echten Wörtern, Reihe für Reihe.', closeHome: 'Schließen und zur Startseite', back: 'Zurück',
    scriptSelector: 'Zu übendes Schriftsystem', result: 'Ergebnis', letters: 'Zeichen', words: 'Wörter', sentences: 'Sätze',
    rowsTitle: (script) => `1. ${capitalize(script)}-Reihen`,
    rowsSummary: (selected, total, words) => `${selected} von ${total} ausgewählt · ${words} Wörter`,
    done: 'Fertig', edit: 'Bearbeiten', selectAll: 'Alle auswählen', clearAll: 'Alle abwählen', basicRows: 'Grundzeichen',
    dakutenRows: 'Mit Dakuten (゛゜)', combinationsRows: 'Kombinationen (ゃゅょ)', specialRows: 'Sonderzeichen',
    doublesConsonants: 'verdoppelt Konsonanten', lengthensVowel: 'verlängert den Vokal',
    contentTitle: '2. Was möchtest du üben?', roundsOf: (count) => `Runden mit ${count}`,
    advancedRounds: (count) => `Fortgeschritten · Runden mit ${count}`,
    advancedUnlocked: 'Fortgeschrittenenmodus freigeschaltet! Du kannst jetzt Sätze üben.',
    oneRowMissing: 'Wähle noch 1 Reihe aus, um Sätze freizuschalten.', rowsMissing: (count) => `Wähle noch ${count} Reihen aus, um Sätze freizuschalten.`,
    katakanaSentenceNote: 'Die Sätze kombinieren Katakana und Hiragana, wie in natürlichem Japanisch.',
    practiceStyleTitle: '3. Wie möchtest du üben?', read: 'Lesen', write: 'Schreiben',
    readSentenceDescription: 'Sieh einen Satz und tippe ihn in Romaji',
    readScriptDescription: (script) => `Sieh ${script} und tippe es in Romaji`,
    writeSentenceDescription: 'Sieh Romaji und tippe den Satz in Kana',
    writeScriptDescription: (script) => `Sieh Romaji und tippe es in ${script} (japanische Tastatur erforderlich)`,
    exampleHint: 'Wähle eine Reihe aus, um hier ein echtes Beispiel zu sehen.', streak: 'Serie', today: 'Heute',
    days: (count) => `${count} ${count === 1 ? 'Tag' : 'Tage'}`,
    rounds: (count) => `${count} ${count === 1 ? 'Runde' : 'Runden'}`,
    mastered: (item) => `Gefestigt: ${item}`, emptyContent: 'Wähle Reihen aus, um Übungsinhalte zu erhalten.',
    masteryHint: (percent) => `${percent} % gefestigt · jedes Element braucht zwei richtige Antworten in Folge.`,
    chooseMoreRows: 'Mehr Reihen auswählen', practiceItems: (count, kind) => `${count} ${DE_ITEMS[kind]} üben`,
    minimumHint: (count, kind) => `Wähle mehr Reihen aus: Mindestens ${count} verfügbare ${DE_ITEMS[kind]} sind erforderlich.`,
    answerRomaji: 'Deine Antwort in Romaji', answerKana: 'Deine Antwort in Kana', instructionRomaji: 'in Romaji schreiben',
    instructionSentenceKana: 'den Satz in Kana schreiben', instructionScript: (script) => `in ${script} schreiben`,
    check: 'Prüfen', viewResults: 'Ergebnisse ansehen', next: 'Weiter', dontRemember: 'Überspringen',
    correct: 'Richtig! ', expected: 'Antwort: ', yourAnswer: 'Deine Antwort: ', emptyAnswer: '(leer)',
    perfectRound: 'Perfekte Runde!', toReview: (count) => `${count} zum Wiederholen`, reviewTitle: 'Wiederholen',
    reviewMissed: (count) => count === 1 ? 'Fehler wiederholen' : `${count} Fehler wiederholen`,
    anotherRound: 'Noch eine Runde', backHome: 'Zurück zur Startseite',
    listen: 'Aussprache anhören',
    audioTitle: 'Aussprache',
    audioDescription: 'Höre jede Antwort mit der japanischen Stimme deines Geräts. Funktioniert offline.',
    autoSpeak: 'Nach jeder Antwort abspielen',
    audioUnavailable: 'Dein Gerät hat keine japanische Stimme. Auf dem iPhone kannst du eine unter Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Japanisch hinzufügen.',
    statsTitle: 'Statistik',
    totalsTitle: 'Seit Beginn',
    roundsLabel: 'Runden',
    bestStreak: 'Beste Serie',
    answersLabel: 'Antworten',
    accuracyLabel: 'Trefferquote',
    accuracyByMode: 'Trefferquote nach Modus',
    answersCount: (count) => `${count} ${count === 1 ? 'Antwort' : 'Antworten'}`,
    hardestLetters: 'Schwierigste Zeichen',
    hardestLettersHint: 'Basierend auf deinen Antworten zu Zeichen, Wörtern und Sätzen.',
    errorRate: (percent) => `${percent} % falsch`,
    hardestWords: 'Wörter zum Wiederholen',
    missedOf: (missed, seen) => `${missed} von ${seen} falsch`,
    notEnoughData: 'Noch nicht genug Antworten. Übe weiter, dann siehst du hier, worauf du dich konzentrieren solltest.',
    noAnswersYet: 'Noch keine Antworten',
    reminderTitle: 'Tägliche Erinnerung',
    reminderDescription: 'Eine Benachrichtigung zur gewählten Uhrzeit, nur an Tagen, an denen du noch nicht geübt hast.',
    reminderToggle: 'Ans Üben erinnern',
    reminderTime: 'Uhrzeit',
    reminderDenied: 'Mitteilungen für WordGana sind deaktiviert. Aktiviere sie unter Einstellungen → Mitteilungen → WordGana.',
    notificationStreak: (days) => `Deine Serie von ${days} ${days === 1 ? 'Tag' : 'Tagen'} wartet. Eine schnelle Runde?`,
    notificationGeneric: 'Zeit für eine schnelle Kana-Runde. Nur zwei Minuten!',
    achievementsTitle: 'Erfolge',
    achievementsCount: (unlocked, total) => `${unlocked} von ${total}`,
    achievementsUnlocked: (count) => count === 1 ? 'Erfolg freigeschaltet!' : `${count} Erfolge freigeschaltet!`,
    viewAchievements: 'Alle Erfolge ansehen',
    nextAchievement: 'Als Nächstes',
    allAchievementsDone: 'Du hast alle Erfolge freigeschaltet. お疲れさま!',
    unlockedOn: (date) => `Freigeschaltet am ${date}`,
    categoryRounds: 'Runden',
    categoryStreak: 'Serie',
    categoryVocabulary: 'Wortschatz',
    categoryPrecision: 'Genauigkeit',
    categoryMastery: 'Schriften und Modi',
    achRounds: (count) => count === 1 ? 'Beende deine erste Runde' : `Beende ${count} Runden`,
    achStreak: (count) => `Übe ${count} Tage in Folge`,
    achWords: (count) => `Festige ${count} Wörter`,
    achPerfect: (count) => count === 1 ? 'Beende eine Runde mit 5 oder mehr ohne Fehler' : `Beende ${count} Runden ohne Fehler`,
    achBasic: (script) => `Festige alle ${capitalize(script)}-Grundzeichen im Modus Zeichen`,
    achBothModes: 'Beende Runden in Lesen und Schreiben',
    achBothScripts: 'Übe Hiragana und Katakana',
    achSentences: 'Beende eine Runde mit Sätzen',
    studyTimeTitle: 'Lernzeit',
    durationHM: (hours, minutes) => minutes > 0 ? `${hours} Std. ${minutes} Min.` : `${hours} Std.`,
    durationM: (minutes) => `${minutes} Min.`,
    goalProgress: (done, goal) => `${done} / ${goal} Min.`,
    goalReached: 'Tagesziel erreicht!',
    goalRemaining: (minutes) => `Noch ${minutes} Min. bis zum Tagesziel`,
    noGoalHint: 'Lege in den Einstellungen ein Tagesziel fest, um es hier zu verfolgen.',
    goalStreakLabel: 'Ziel-Serie',
    lastDaysTitle: 'Tag für Tag',
    range7: '7 Tage',
    range28: '4 Wochen',
    rangeAll: 'Gesamt',
    goalLine: (minutes) => `Ziel ${minutes} Min.`,
    byCategoryTitle: 'Nach Kategorie',
    totalLabel: 'Gesamt',
    thisWeekLabel: 'Letzte 7 Tage',
    dailyAverageLabel: 'Tagesdurchschnitt',
    noStudyYet: 'Noch keine Zeit erfasst. Übe eine Runde, dann wird sie automatisch gezählt.',
    dailyGoalTitle: 'Tagesziel',
    dailyGoalDescription: 'Wie viele Minuten Japanisch du pro Tag lernen möchtest, in WordGana oder anderswo.',
    noGoal: 'Kein Ziel',
    otherCategory: 'Sonstiges',
    studyCategoryNames: { listening: 'Hören', reading: 'Lesen', class: 'Unterricht', conversation: 'Konversation', handwriting: 'Handschrift', apps: 'Andere Apps' },
    notificationGoal: (minutes) => `Bereit für deine ${minutes} Minuten Japanisch heute?`,
    dayDetail: (date, duration) => `${date}: ${duration}`,
    startTimer: 'Timer starten',
    addTime: 'Zeit hinzufügen',
    stopTimer: 'Stoppen',
    timerRunning: 'Timer läuft',
    chooseCategory: 'Was lernst du?',
    startTimerAction: 'Los geht’s',
    categoryLabel: 'Kategorie',
    newCategory: 'Neue Kategorie',
    categoryName: 'Name',
    categoryNamePlaceholder: 'Zum Beispiel: Anime',
    categoryIcon: 'Symbol',
    createCategory: 'Erstellen',
    cancel: 'Abbrechen',
    durationLabel: 'Dauer',
    minutesUnit: 'Minuten',
    dayLabel: 'Tag',
    yesterday: 'Gestern',
    otherDay: 'Anderer Tag',
    noteLabel: 'Notiz (optional)',
    notePlaceholder: 'Zum Beispiel: Genki Kapitel 3',
    save: 'Speichern',
    addTimeTitle: 'Zeit hinzufügen',
    editEntryTitle: 'Eintrag bearbeiten',
    stopTimerTitle: 'Sitzung speichern',
    discardTimer: 'Timer verwerfen',
    longTimerWarning: 'Der Timer lief über 4 Stunden. Prüfe die Dauer vor dem Speichern.',
    invalidDuration: 'Gib 1 bis 720 Minuten ein.',
    invalidDay: 'Wähle heute oder einen vergangenen Tag.',
    invalidCategory: 'Wähle eine Kategorie.',
    timerPausesAuto: 'Während der Timer läuft, wird Üben in WordGana nicht zusätzlich gezählt.',
    categoriesTitle: 'Kategorien',
    yourCategories: 'Deine Kategorien',
    noCustomCategories: 'Du hast noch keine Kategorien erstellt.',
    rename: 'Umbenennen',
    removeCategory: 'Entfernen',
    archivedNote: 'Kategorien mit erfasster Zeit werden archiviert: Sie werden nicht mehr angeboten, bleiben aber im Verlauf.',
    builtInCategoriesTitle: 'Enthalten',
    timerShort: 'Timer',
    confirmRemoveCategory: (name) => `„${name}“ entfernen? Sie wird nicht mehr angeboten.`,
    historyTitle: 'Verlauf',
    sourceAuto: 'In WordGana',
    sourceTimer: 'Timer',
    sourceManual: 'Manuell',
    deleteEntry: 'Eintrag löschen',
    deleteShort: 'Löschen',
    confirmDeleteEntry: (label, duration) => `${duration} ${label} löschen? Das kann nicht rückgängig gemacht werden.`,
    emptyHistory: 'Noch keine Einträge. Übe eine Runde oder füge Zeit hinzu.',
    editEntryHint: 'Bearbeiten',
    categoryTime: 'Lernzeit',
    achStudyHours: (hours) => hours === 1 ? 'Erfasse deine erste Stunde Japanisch' : `Erfasse ${hours} Stunden Japanisch`,
    achGoalStreak: (days) => `Erreiche dein Tagesziel ${days} Tage in Folge`,
  },
};

interface I18nValue {
  language: AppLanguage;
  preference: LanguagePreference;
  setPreference: (preference: LanguagePreference) => void;
  messages: Messages;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<LanguagePreference>(loadLanguagePreference);
  const language = preference === 'auto' ? detectDeviceLanguage() : preference;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setPreference(next: LanguagePreference) {
    setPreferenceState(next);
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Keep the in-memory choice. */ }
  }

  const value = useMemo<I18nValue>(() => ({
    language,
    preference,
    setPreference,
    messages: MESSAGES[language],
  }), [language, preference]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}

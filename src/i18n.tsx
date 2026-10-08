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
}

const MESSAGES: Record<AppLanguage, Messages> = {
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

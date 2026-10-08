import { ACHIEVEMENT_CATEGORIES, type Achievement, type AchievementCategory } from '../data/achievements';
import { useI18n, type Messages } from '../i18n';
import { nextAchievement, type AchievementProgress } from '../lib/achievements';

export function achievementDescription(achievement: Achievement, messages: Messages): string {
  switch (achievement.metric) {
    case 'rounds': return messages.achRounds(achievement.target);
    case 'bestStreak': return messages.achStreak(achievement.target);
    case 'wordsLearned': return messages.achWords(achievement.target);
    case 'perfectRounds': return messages.achPerfect(achievement.target);
    case 'hiraganaBasic': return messages.achBasic('hiragana');
    case 'katakanaBasic': return messages.achBasic('katakana');
    case 'modesPracticed': return messages.achBothModes;
    case 'scriptsPracticed': return messages.achBothScripts;
    case 'sentenceRounds': return messages.achSentences;
  }
}

export function AchievementBadge({ icon, locked = false }: { icon: string; locked?: boolean }) {
  return (
    <span className={locked ? 'achievement-badge achievement-badge--locked' : 'achievement-badge'} aria-hidden="true">
      <span className="ja">{icon}</span>
    </span>
  );
}

interface AchievementsScreenProps {
  progress: AchievementProgress[];
}

export function AchievementsScreen({ progress }: AchievementsScreenProps) {
  const { language, messages } = useI18n();
  const unlockedCount = progress.filter((entry) => entry.unlockedAt).length;
  const next = nextAchievement(progress);
  const dateFormat = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short', year: 'numeric' });
  const categoryLabels: Record<AchievementCategory, string> = {
    rounds: messages.categoryRounds,
    streak: messages.categoryStreak,
    vocabulary: messages.categoryVocabulary,
    precision: messages.categoryPrecision,
    mastery: messages.categoryMastery,
  };

  return (
    <section>
      <div className="card achievements-summary">
        <div className="achievements-total">
          <span className="achievements-trophy" aria-hidden="true">🏆</span>
          <div>
            <p className="achievements-total-value">{messages.achievementsCount(unlockedCount, progress.length)}</p>
            <p className="stat-label">{messages.achievementsTitle}</p>
          </div>
        </div>
        <div className="progress-track progress-track--compact">
          <div className="progress-fill" style={{ width: `${(unlockedCount / progress.length) * 100}%` }} />
        </div>
        {next ? (
          <div className="next-achievement">
            <p className="row-section-title">{messages.nextAchievement}</p>
            <AchievementRow entry={next} messages={messages} language={language} />
          </div>
        ) : (
          <p className="hint">{messages.allAchievementsDone}</p>
        )}
      </div>

      {ACHIEVEMENT_CATEGORIES.map((category) => (
        <div className="card" key={category}>
          <h2>{categoryLabels[category]}</h2>
          <ul className="achievement-list">
            {progress
              .filter((entry) => entry.achievement.category === category)
              .map((entry) => (
                <li key={entry.achievement.id}>
                  <AchievementRow entry={entry} messages={messages} language={language} dateFormat={dateFormat} />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

interface AchievementRowProps {
  entry: AchievementProgress;
  messages: Messages;
  language: keyof Achievement['title'];
  dateFormat?: Intl.DateTimeFormat;
}

function AchievementRow({ entry, messages, language, dateFormat }: AchievementRowProps) {
  const { achievement, current, unlockedAt } = entry;
  const locked = !unlockedAt;
  return (
    <div className={locked ? 'achievement-row achievement-row--locked' : 'achievement-row'}>
      <AchievementBadge icon={achievement.icon} locked={locked} />
      <div className="achievement-text">
        <p className="achievement-title">{achievement.title[language]}</p>
        <p className="achievement-description">{achievementDescription(achievement, messages)}</p>
        {locked ? (
          <div className="achievement-progress">
            <div className="progress-track progress-track--compact">
              <div className="progress-fill" style={{ width: `${(current / achievement.target) * 100}%` }} />
            </div>
            <span>{current} / {achievement.target}</span>
          </div>
        ) : (
          dateFormat && <p className="achievement-date">{messages.unlockedOn(dateFormat.format(new Date(unlockedAt)))}</p>
        )}
      </div>
    </div>
  );
}

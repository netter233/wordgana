import type { Achievement } from '../data/achievements';
import { useI18n } from '../i18n';
import { AchievementBadge, achievementDescription } from './AchievementsScreen';

interface UnlockedAchievementsProps {
  achievements: Achievement[];
  onViewAll: () => void;
}

/** Celebración en Resultados de los logros que se acaban de desbloquear. */
export function UnlockedAchievements({ achievements, onViewAll }: UnlockedAchievementsProps) {
  const { language, messages } = useI18n();
  if (achievements.length === 0) return null;
  return (
    <div className="card unlocked-card" role="status" aria-live="polite">
      <p className="unlocked-heading">{messages.achievementsUnlocked(achievements.length)}</p>
      <ul className="unlocked-list">
        {achievements.map((achievement, index) => (
          <li
            key={achievement.id}
            className="unlocked-item"
            style={{ animationDelay: `${120 + index * 90}ms` }}
          >
            <AchievementBadge icon={achievement.icon} />
            <div className="achievement-text">
              <p className="achievement-title">{achievement.title[language]}</p>
              <p className="achievement-description">{achievementDescription(achievement, messages)}</p>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="link-btn unlocked-link" onClick={onViewAll}>
        {messages.viewAchievements}
      </button>
    </div>
  );
}

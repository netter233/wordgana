import { useI18n } from '../i18n';
import { GOAL_OPTIONS } from '../lib/studyTime';

interface GoalSettingsProps {
  goalMinutes: number;
  onChange: (minutes: number) => void;
}

export function GoalSettings({ goalMinutes, onChange }: GoalSettingsProps) {
  const { messages } = useI18n();
  return (
    <section className="card settings-card">
      <div className="settings-card-heading">
        <span className="settings-icon" aria-hidden="true">🎯</span>
        <div>
          <h2 id="goal-setting-label">{messages.dailyGoalTitle}</h2>
          <p>{messages.dailyGoalDescription}</p>
        </div>
      </div>
      <select
        className="settings-select"
        aria-labelledby="goal-setting-label"
        value={goalMinutes}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {GOAL_OPTIONS.map((minutes) => (
          <option key={minutes} value={minutes}>
            {minutes === 0 ? messages.noGoal : messages.durationM(minutes)}
          </option>
        ))}
      </select>
    </section>
  );
}

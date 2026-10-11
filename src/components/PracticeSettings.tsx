import { useState } from 'react';
import { loadReviewEach, saveReviewEach } from '../lib/storage';
import { useI18n } from '../i18n';

export function PracticeSettings() {
  const { messages } = useI18n();
  const [reviewEach, setReviewEach] = useState(loadReviewEach);

  function toggle() {
    const next = !reviewEach;
    setReviewEach(next);
    saveReviewEach(next);
  }

  return (
    <section className="card settings-card">
      <div className="settings-card-heading">
        <span className="settings-icon" aria-hidden="true">📝</span>
        <div>
          <h2>{messages.practiceSettingsTitle}</h2>
          <p>{messages.practiceSettingsDescription}</p>
        </div>
      </div>
      <label className="switch-row">
        <span>{messages.reviewEach}</span>
        <input
          type="checkbox"
          role="switch"
          className="switch"
          checked={reviewEach}
          onChange={toggle}
        />
      </label>
    </section>
  );
}

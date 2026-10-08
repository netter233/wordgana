import { useState } from 'react';
import { useJapaneseSpeech } from '../lib/speech';
import { loadAutoSpeak, saveAutoSpeak } from '../lib/storage';
import { useI18n } from '../i18n';

export function AudioSettings() {
  const { messages } = useI18n();
  const available = useJapaneseSpeech();
  const [autoSpeak, setAutoSpeak] = useState(loadAutoSpeak);

  function toggle() {
    const next = !autoSpeak;
    setAutoSpeak(next);
    saveAutoSpeak(next);
  }

  return (
    <section className="card settings-card">
      <div className="settings-card-heading">
        <span className="settings-icon" aria-hidden="true">🔊</span>
        <div>
          <h2>{messages.audioTitle}</h2>
          <p>{available ? messages.audioDescription : messages.audioUnavailable}</p>
        </div>
      </div>
      {available && (
        <label className="switch-row">
          <span>{messages.autoSpeak}</span>
          <input
            type="checkbox"
            role="switch"
            className="switch"
            checked={autoSpeak}
            onChange={toggle}
          />
        </label>
      )}
    </section>
  );
}

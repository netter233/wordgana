import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { categoryInfo, type CustomCategory } from '../lib/studyCategories';
import { pauseTimer, resumeTimer, timerElapsed, type RunningTimer } from '../lib/studyTime';

interface TimerBannerProps {
  timer: RunningTimer;
  customCategories: CustomCategory[];
  onTimerChange: (timer: RunningTimer) => void;
  onStop: () => void;
}

function clock(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(rest).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Cronómetro en marcha. El tiempo se calcula desde el inicio y las pausas guardadas, así que sobrevive a cerrar la app. */
export function TimerBanner({ timer, customCategories, onTimerChange, onStop }: TimerBannerProps) {
  const { messages } = useI18n();
  const [now, setNow] = useState(() => new Date());
  const info = categoryInfo(timer.categoryId, messages, customCategories);
  const paused = Boolean(timer.pausedAt);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`timer-banner${paused ? ' timer-banner--paused' : ''}`}
      role="timer"
      aria-label={`${paused ? messages.timerPaused : messages.timerRunning}: ${info.label}`}
    >
      <span className="timer-banner-dot" aria-hidden="true" />
      <div className="timer-banner-text">
        <span className="timer-banner-label">{paused ? `${messages.timerPaused} · ` : ''}{info.icon} {info.label}</span>
        <span className="timer-banner-clock">{clock(timerElapsed(timer, now))}</span>
      </div>
      <div className="timer-banner-actions">
        <button
          type="button"
          className="small-btn small-btn--secondary"
          onClick={() => onTimerChange(paused ? resumeTimer(timer) : pauseTimer(timer))}
        >
          {paused ? messages.resumeTimer : messages.pauseTimer}
        </button>
        <button type="button" className="small-btn" onClick={onStop}>{messages.stopTimer}</button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import {
  loadReminder,
  reminderPermission,
  remindersSupported,
  requestReminderPermission,
  saveReminder,
  syncReminders,
  type ReminderSettings as Reminder,
  type ReminderTexts,
} from '../lib/reminders';

interface ReminderSettingsProps {
  practicedToday: boolean;
  texts: ReminderTexts;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function ReminderSettings({ practicedToday, texts }: ReminderSettingsProps) {
  const { messages } = useI18n();
  const [reminder, setReminder] = useState(loadReminder);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!reminder.enabled) return;
    reminderPermission().then((state) => setDenied(state === 'denied'));
  }, [reminder.enabled]);

  if (!remindersSupported()) return null;

  function apply(next: Reminder) {
    setReminder(next);
    saveReminder(next);
    void syncReminders(next, practicedToday, texts);
  }

  async function toggle() {
    if (reminder.enabled) {
      apply({ ...reminder, enabled: false });
      return;
    }
    // El permiso se pide recién cuando la persona activa el recordatorio, con el contexto a la vista.
    const granted = await requestReminderPermission();
    setDenied(!granted);
    apply({ ...reminder, enabled: granted });
  }

  function changeTime(value: string) {
    const [hour, minute] = value.split(':').map(Number);
    if (Number.isInteger(hour) && Number.isInteger(minute)) apply({ ...reminder, hour, minute });
  }

  return (
    <section className="card settings-card">
      <div className="settings-card-heading">
        <span className="settings-icon" aria-hidden="true">⏰</span>
        <div>
          <h2>{messages.reminderTitle}</h2>
          <p>{messages.reminderDescription}</p>
        </div>
      </div>
      <label className="switch-row">
        <span>{messages.reminderToggle}</span>
        <input type="checkbox" role="switch" className="switch" checked={reminder.enabled} onChange={toggle} />
      </label>
      {reminder.enabled && (
        <label className="switch-row">
          <span>{messages.reminderTime}</span>
          <input
            type="time"
            className="time-input"
            value={`${pad(reminder.hour)}:${pad(reminder.minute)}`}
            onChange={(event) => changeTime(event.target.value)}
          />
        </label>
      )}
      {denied && <p className="settings-warning">{messages.reminderDenied}</p>}
    </section>
  );
}

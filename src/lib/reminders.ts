/**
 * Recordatorio diario con notificaciones locales (solo en la app nativa). En vez de una notificación
 * repetitiva, se programan avisos sueltos para los próximos días y se reprograman al abrir la app y al
 * terminar cada ronda: así no hay aviso los días que ya practicaste, y si dejás de usar la app los
 * avisos se terminan solos en vez de insistir para siempre.
 */
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export const DEFAULT_REMINDER: ReminderSettings = { enabled: false, hour: 20, minute: 0 };

const REMINDER_KEY = 'wordgana:reminder:v1';
const FIRST_ID = 1001;
export const REMINDER_DAYS = 14;

export function remindersSupported(): boolean {
  return Capacitor.isNativePlatform();
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max ? value : fallback;
}

export function loadReminder(): ReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    if (!raw) return DEFAULT_REMINDER;
    const parsed = JSON.parse(raw) as Partial<ReminderSettings>;
    return {
      enabled: parsed.enabled === true,
      hour: clampInt(parsed.hour, 0, 23, DEFAULT_REMINDER.hour),
      minute: clampInt(parsed.minute, 0, 59, DEFAULT_REMINDER.minute),
    };
  } catch {
    return DEFAULT_REMINDER;
  }
}

export function saveReminder(settings: ReminderSettings): void {
  try {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
  } catch {
    // Sin persistencia esta sesión.
  }
}

/**
 * Fechas de los próximos avisos, en hora local. Hoy se incluye solo si todavía no practicaste y la
 * hora no pasó.
 */
export function reminderDates(
  now: Date,
  settings: Pick<ReminderSettings, 'hour' | 'minute'>,
  practicedToday: boolean,
  days = REMINDER_DAYS,
): Date[] {
  const dates: Date[] = [];
  for (let offset = 0; dates.length < days; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, settings.hour, settings.minute);
    if (offset === 0 && (practicedToday || date <= now)) continue;
    dates.push(date);
  }
  return dates;
}

export interface ReminderTexts {
  title: string;
  /** Texto del primer aviso, que puede mencionar la racha actual. */
  first: string;
  /** Texto de los avisos siguientes, cuando la racha ya puede haberse cortado. */
  later: string;
}

export type PermissionState = 'granted' | 'denied' | 'prompt';

export async function reminderPermission(): Promise<PermissionState> {
  if (!remindersSupported()) return 'denied';
  try {
    const { display } = await LocalNotifications.checkPermissions();
    return display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'prompt';
  } catch {
    return 'denied';
  }
}

export async function requestReminderPermission(): Promise<boolean> {
  if (!remindersSupported()) return false;
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  } catch {
    return false;
  }
}

async function cancelAll(): Promise<void> {
  const notifications = Array.from({ length: REMINDER_DAYS }, (_, index) => ({ id: FIRST_ID + index }));
  await LocalNotifications.cancel({ notifications });
}

/** Reemplaza los avisos programados según la configuración y si ya practicaste hoy. */
export async function syncReminders(
  settings: ReminderSettings,
  practicedToday: boolean,
  texts: ReminderTexts,
  now = new Date(),
): Promise<void> {
  if (!remindersSupported()) return;
  try {
    await cancelAll();
    if (!settings.enabled || (await reminderPermission()) !== 'granted') return;
    const notifications = reminderDates(now, settings, practicedToday).map((at, index) => ({
      id: FIRST_ID + index,
      title: texts.title,
      body: index === 0 ? texts.first : texts.later,
      schedule: { at, allowWhileIdle: true },
    }));
    await LocalNotifications.schedule({ notifications });
  } catch {
    // Si el sistema rechaza la programación, la app sigue funcionando sin recordatorios.
  }
}

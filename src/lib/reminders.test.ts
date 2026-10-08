import { describe, expect, it } from 'vitest';
import { reminderDates } from './reminders';

const at = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute);

describe('reminderDates', () => {
  it('incluye hoy si todavía no practicaste y la hora no pasó', () => {
    const dates = reminderDates(at(7, 9), { hour: 20, minute: 30 }, false, 3);
    expect(dates).toEqual([at(7, 20, 30), at(8, 20, 30), at(9, 20, 30)]);
  });

  it('saltea hoy si ya practicaste', () => {
    const dates = reminderDates(at(7, 9), { hour: 20, minute: 0 }, true, 2);
    expect(dates).toEqual([at(8, 20), at(9, 20)]);
  });

  it('saltea hoy si la hora ya pasó', () => {
    const dates = reminderDates(at(7, 21), { hour: 20, minute: 0 }, false, 1);
    expect(dates).toEqual([at(8, 20)]);
  });

  it('cruza fin de mes correctamente', () => {
    const dates = reminderDates(new Date(2026, 9, 31, 22), { hour: 8, minute: 0 }, false, 2);
    expect(dates).toEqual([new Date(2026, 10, 1, 8), new Date(2026, 10, 2, 8)]);
  });
});

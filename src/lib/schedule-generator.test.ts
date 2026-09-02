import { describe, expect, it } from 'vitest';
import { generatePuppySchedule, pottyIntervalMinutes } from './schedule-generator';

describe('pottyIntervalMinutes', () => {
  it('returns 90 when age is 8 weeks', () => {
    expect(pottyIntervalMinutes(8)).toBe(90);
  });

  it('returns 150 when age is 12 weeks', () => {
    expect(pottyIntervalMinutes(12)).toBe(150);
  });

  it('returns 300 when age is 26 weeks', () => {
    expect(pottyIntervalMinutes(26)).toBe(300);
  });

  it('returns 360 when age is older than 26 weeks', () => {
    expect(pottyIntervalMinutes(52)).toBe(360);
  });
});

describe('generatePuppySchedule', () => {
  const baseInput = {
    ageWeeks: 12,
    wakeTime: '07:00',
    mealsPerDay: 3,
    bedTime: '21:00',
  };

  it('starts with a wake up event at the wake time', () => {
    const schedule = generatePuppySchedule(baseInput);
    expect(schedule[0]).toEqual({ time: '07:00', activity: 'Wake up' });
  });

  it('ends with a bedtime event at the bed time', () => {
    const schedule = generatePuppySchedule(baseInput);
    expect(schedule[schedule.length - 1]).toEqual({ time: '21:00', activity: 'Bedtime' });
  });

  it('labels bedtime for the crate when crateTraining is true', () => {
    const schedule = generatePuppySchedule({ ...baseInput, crateTraining: true });
    expect(schedule[schedule.length - 1].activity).toBe('Bedtime (in crate)');
  });

  it('includes a potty break immediately after waking', () => {
    const schedule = generatePuppySchedule(baseInput);
    expect(schedule[1].activity).toBe('Potty');
  });

  it('includes exactly one entry per meal for mealsPerDay', () => {
    const schedule = generatePuppySchedule({ ...baseInput, mealsPerDay: 4 });
    const meals = schedule.filter((item) =>
      ['Breakfast', 'Lunch', 'Afternoon snack', 'Dinner'].includes(item.activity),
    );
    expect(meals).toHaveLength(4);
  });

  it('labels a midday potty break as needing a sitter when awayDuringDay is true', () => {
    const schedule = generatePuppySchedule({ ...baseInput, awayDuringDay: true });
    const awayBreaks = schedule.filter((item) => item.activity.includes('arrange a sitter'));
    expect(awayBreaks.length).toBeGreaterThan(0);
  });

  it('returns events sorted in chronological order with strictly increasing times', () => {
    const schedule = generatePuppySchedule(baseInput);
    const minutes = schedule.map((item) => {
      const [h, m] = item.time.split(':').map(Number);
      return h * 60 + m;
    });
    for (let i = 1; i < minutes.length; i++) {
      expect(minutes[i]).toBeGreaterThan(minutes[i - 1]);
    }
  });

  it('throws when bedTime is not after wakeTime', () => {
    expect(() => generatePuppySchedule({ ...baseInput, wakeTime: '22:00', bedTime: '07:00' })).toThrow();
  });
});

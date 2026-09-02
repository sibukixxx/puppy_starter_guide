export interface PuppyScheduleInput {
  ageWeeks: number;
  wakeTime: string;
  mealsPerDay: number;
  bedTime: string;
  crateTraining?: boolean;
  awayDuringDay?: boolean;
}

export interface ScheduleItem {
  time: string;
  activity: string;
}

const MEAL_LABELS: Record<number, string[]> = {
  2: ['Breakfast', 'Dinner'],
  3: ['Breakfast', 'Lunch', 'Dinner'],
  4: ['Breakfast', 'Lunch', 'Afternoon snack', 'Dinner'],
};

const WORK_HOURS_WINDOW: [number, number] = [10 * 60, 16 * 60];

export function pottyIntervalMinutes(ageWeeks: number): number {
  if (ageWeeks <= 8) return 90;
  if (ageWeeks <= 10) return 120;
  if (ageWeeks <= 12) return 150;
  if (ageWeeks <= 17) return 210;
  if (ageWeeks <= 26) return 300;
  return 360;
}

function napsPerDay(ageWeeks: number): number {
  if (ageWeeks <= 10) return 4;
  if (ageWeeks <= 17) return 3;
  if (ageWeeks <= 26) return 2;
  return 1;
}

function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(wrapped / 60);
  const mins = wrapped % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function pottyLabel(minutes: number, awayDuringDay: boolean | undefined): string {
  const [start, end] = WORK_HOURS_WINDOW;
  if (awayDuringDay && minutes >= start && minutes <= end) {
    return 'Potty break (arrange a sitter/walker — you’re away)';
  }
  return 'Potty';
}

function mealLabels(mealsPerDay: number): string[] {
  return MEAL_LABELS[mealsPerDay] ?? Array.from({ length: mealsPerDay }, (_, i) => `Meal ${i + 1}`);
}

/**
 * Deterministic, rule-based puppy day planner. No LLM involved on purpose:
 * fast, free, reproducible, and safe to publish as a static SEO page.
 */
export function generatePuppySchedule(input: PuppyScheduleInput): ScheduleItem[] {
  const wake = parseTime(input.wakeTime);
  const bed = parseTime(input.bedTime);

  if (bed <= wake) {
    throw new Error('bedTime must be after wakeTime');
  }

  const events: { minutes: number; activity: string }[] = [];
  const dayLength = bed - wake;
  const labels = mealLabels(input.mealsPerDay);

  events.push({ minutes: wake, activity: 'Wake up' });
  events.push({ minutes: wake + 5, activity: pottyLabel(wake + 5, input.awayDuringDay) });

  const mealWindowStart = wake + 15;
  const mealWindowEnd = bed - 60;
  const mealTimes = labels.map((_, i) => {
    const step = (mealWindowEnd - mealWindowStart) / Math.max(labels.length - 1, 1);
    const raw = labels.length === 1 ? mealWindowStart : mealWindowStart + step * i;
    return Math.round(raw / 5) * 5;
  });

  mealTimes.forEach((mealMinutes, i) => {
    events.push({ minutes: mealMinutes, activity: labels[i] });
    events.push({
      minutes: mealMinutes + 15,
      activity: pottyLabel(mealMinutes + 15, input.awayDuringDay),
    });
    events.push({ minutes: mealMinutes + 30, activity: 'Play / training' });
  });

  const naps = napsPerDay(input.ageWeeks);
  const napLabel = input.crateTraining ? 'Nap (in crate)' : 'Nap';
  for (let i = 1; i <= naps; i++) {
    const target = wake + (dayLength * i) / (naps + 1);
    const rounded = Math.round(target / 5) * 5;
    events.push({ minutes: nearestFreeSlot(rounded, events), activity: napLabel });
  }

  const interval = pottyIntervalMinutes(input.ageWeeks);
  for (let t = wake + interval; t < bed - 30; t += interval) {
    const tooClose = events.some(
      (e) => e.activity.startsWith('Potty') && Math.abs(e.minutes - t) < 30,
    );
    if (!tooClose) {
      events.push({ minutes: t, activity: pottyLabel(t, input.awayDuringDay) });
    }
  }

  events.push({ minutes: bed - 15, activity: pottyLabel(bed - 15, input.awayDuringDay) });
  events.push({
    minutes: bed,
    activity: input.crateTraining ? 'Bedtime (in crate)' : 'Bedtime',
  });

  events.sort((a, b) => a.minutes - b.minutes);

  let lastMinutes = -Infinity;
  for (const event of events) {
    if (event.minutes <= lastMinutes) {
      event.minutes = lastMinutes + 1;
    }
    lastMinutes = event.minutes;
  }

  return events.map((event) => ({ time: formatTime(event.minutes), activity: event.activity }));
}

function nearestFreeSlot(minutes: number, existing: { minutes: number }[]): number {
  let candidate = minutes;
  let attempts = 0;
  while (existing.some((e) => Math.abs(e.minutes - candidate) < 20) && attempts < 20) {
    candidate += 15;
    attempts += 1;
  }
  return candidate;
}

import { useState, type FormEvent } from 'react';
import { generatePuppySchedule, type ScheduleItem } from '../../lib/schedule-generator';
import { trackEvent } from '../../lib/analytics';

const AGE_OPTIONS = [
  { label: '8 weeks', value: 8 },
  { label: '10 weeks', value: 10 },
  { label: '12 weeks', value: 12 },
  { label: '4 months', value: 17 },
  { label: '6 months', value: 26 },
  { label: 'Older than 6 months', value: 40 },
];

export default function PuppyScheduleGenerator() {
  const [ageWeeks, setAgeWeeks] = useState(12);
  const [wakeTime, setWakeTime] = useState('07:00');
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [bedTime, setBedTime] = useState('21:00');
  const [crateTraining, setCrateTraining] = useState(false);
  const [awayDuringDay, setAwayDuringDay] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  function markStarted() {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent({ name: 'tool_start', properties: { tool: 'puppy-schedule-generator' } });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const result = generatePuppySchedule({
        ageWeeks,
        wakeTime,
        mealsPerDay,
        bedTime,
        crateTraining,
        awayDuringDay,
      });
      setSchedule(result);
      trackEvent({ name: 'tool_complete', properties: { tool: 'puppy-schedule-generator' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a schedule.');
      setSchedule(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        onFocus={markStarted}
        className="space-y-5 rounded-2xl border border-stone-200 p-6"
      >
        <div>
          <label htmlFor="ageWeeks" className="block text-sm font-medium text-stone-800">
            Puppy age
          </label>
          <select
            id="ageWeeks"
            value={ageWeeks}
            onChange={(e) => setAgeWeeks(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            {AGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="wakeTime" className="block text-sm font-medium text-stone-800">
            Wake-up time
          </label>
          <input
            id="wakeTime"
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="mealsPerDay" className="block text-sm font-medium text-stone-800">
            Meals per day
          </label>
          <select
            id="mealsPerDay"
            value={mealsPerDay}
            onChange={(e) => setMealsPerDay(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>

        <div>
          <label htmlFor="bedTime" className="block text-sm font-medium text-stone-800">
            Bedtime
          </label>
          <input
            id="bedTime"
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-stone-800">Optional</legend>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={crateTraining}
              onChange={(e) => setCrateTraining(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300"
            />
            Crate training
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={awayDuringDay}
              onChange={(e) => setAwayDuringDay(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300"
            />
            I'm away from home during the day
          </label>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Generate schedule
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="rounded-2xl bg-stone-50 p-6">
        {!schedule && (
          <p className="text-sm text-stone-500">
            Fill in the form and generate an example daily schedule for your puppy.
          </p>
        )}
        {schedule && (
          <ol className="space-y-2" aria-label="Generated puppy schedule">
            {schedule.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="w-14 shrink-0 font-mono font-medium text-stone-900">
                  {item.time}
                </span>
                <span className="text-stone-700">{item.activity}</span>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-6 text-xs text-stone-400">
          This is an example schedule based on general guidelines — every puppy is different.
          Talk to your veterinarian about anything specific to your puppy's health or behavior.
        </p>
      </div>
    </div>
  );
}

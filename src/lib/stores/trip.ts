import { writable, derived, get } from 'svelte/store';
import type { Trip, TripDay, Activity, Flight, Accommodation, Traveler } from '$lib/models/types';
import { trips, days, activities, flights, accommodations, travelers } from '$lib/firebase/services';
import { seedFirestore } from '$lib/firebase/seed';
import { db } from '$lib/firebase/config';
import { SEED_TRIP, SEED_DAYS, SEED_ACTIVITIES, SEED_FLIGHTS, SEED_ACCOMMODATIONS, SEED_TRAVELERS } from '$lib/data/seed';
import { TRIP_ID } from '$lib/config';

// ── Sort helpers ───────────────────────────────────────────

const sortFlights = (list: Flight[]) =>
  [...list].sort((a, b) => a.dm !== b.dm ? a.dm - b.dm : (a.dep ?? '').localeCompare(b.dep ?? ''));

const sortStays = (list: Accommodation[]) =>
  [...list].sort((a, b) => a.startDm - b.startDm);

// ── Raw state ──────────────────────────────────────────────

export const trip           = writable<Trip | null>(null);
const _tripDays             = writable<TripDay[]>([]);
export const activityList   = writable<Activity[]>([]);
export const flightList     = writable<Flight[]>([]);
export const stayList       = writable<Accommodation[]>([]);
export const travelerList   = writable<Traveler[]>([]);
export const loading        = writable(false);

// ── Derived ────────────────────────────────────────────────

export const activitiesByDay = derived(activityList, ($acts) =>
  $acts.reduce<Record<number, Activity[]>>((acc, a) => {
    (acc[a.dayDm] ??= []).push(a);
    return acc;
  }, {})
);

// tripDays computes the 'act' badge declaratively — no manual sync needed.
export const tripDays = derived(
  [_tripDays, activitiesByDay],
  ([$days, $byDay]) => $days.map(d => ({
    ...d,
    badges: [
      ...d.badges.filter(b => b !== 'act'),
      ...($byDay[d.d]?.length ? ['act' as const] : []),
    ],
  }))
);

export const activitiesMap = derived(activityList, ($acts) =>
  Object.fromEntries($acts.map(a => [a.id, a]))
);

export const flightsMap = derived(flightList, ($fl) =>
  Object.fromEntries($fl.map(f => [f.id, f]))
);

export const staysMap = derived(stayList, ($sl) =>
  Object.fromEntries($sl.map(s => [s.id, s]))
);

export const dayByDm = derived(tripDays, ($days) =>
  Object.fromEntries($days.map(d => [d.d, d.id]))
);

// ── Real-time listeners ────────────────────────────────────

let _unsubs: Array<() => void> = [];

export function unsubscribeListeners() {
  _unsubs.forEach(fn => fn());
  _unsubs = [];
}

// ── Load ───────────────────────────────────────────────────

export async function loadTrip() {
  loading.set(true);
  unsubscribeListeners();

  // Step 1: ensure trip doc exists (one-time check)
  try {
    let t = await trips.get(TRIP_ID).catch(() => null);
    if (!t) {
      try { await seedFirestore(); } catch { /* offline — use seed */ }
      t = SEED_TRIP;
    }
    trip.set(t);
  } catch {
    trip.set(SEED_TRIP);
  }

  // Step 2: Firebase not available → seed data, no listeners
  if (!db) {
    _tripDays.set(SEED_DAYS);
    activityList.set(SEED_ACTIVITIES);
    flightList.set(sortFlights(SEED_FLIGHTS));
    stayList.set(sortStays(SEED_ACCOMMODATIONS));
    travelerList.set(SEED_TRAVELERS);
    loading.set(false);
    return;
  }

  // Step 3: onSnapshot listeners — fire immediately with current data,
  // then push every update from any session automatically.
  const fired = new Set<string>();
  const markReady = (key: string) => {
    fired.add(key);
    if (fired.size >= 5) loading.set(false);
  };

  _unsubs.push(
    days.watch(TRIP_ID,           (d)  => { _tripDays.set(d);              markReady('days');      }),
    activities.watch(TRIP_ID,     (a)  => { activityList.set(a);           markReady('acts');      }),
    flights.watch(TRIP_ID,        (f)  => { flightList.set(sortFlights(f));markReady('flights');   }),
    accommodations.watch(TRIP_ID, (s)  => { stayList.set(sortStays(s));    markReady('stays');     }),
    travelers.watch(TRIP_ID,      (tv) => { travelerList.set(tv);          markReady('travelers'); }),
  );
}

// ── Mutations: Activity ────────────────────────────────────

export async function saveActivity(a: Activity) {
  activityList.update(list => {
    const idx = list.findIndex(x => x.id === a.id);
    return idx >= 0 ? list.with(idx, a) : [...list, a];
  });
  await activities.save(a).catch((e) => console.error('[saveActivity]', e));
}

export async function deleteActivity(id: string) {
  activityList.update(list => list.filter(x => x.id !== id));
  await activities.delete(id).catch((e) => console.error('[deleteActivity]', e));
}

// ── Mutations: TripDay warn ────────────────────────────────

export async function saveDayWarn(dayId: string, warn: string) {
  _tripDays.update(list =>
    list.map(d => d.id === dayId ? { ...d, warn: warn || undefined } : d)
  );
  const updated = get(_tripDays).find(d => d.id === dayId);
  if (updated) await days.save(updated).catch((e) => console.error('[saveDayWarn]', e));
}

// ── Mutations: Flight ──────────────────────────────────────

export async function saveFlight(f: Flight) {
  flightList.update(list => {
    const idx = list.findIndex(x => x.id === f.id);
    return sortFlights(idx >= 0 ? list.with(idx, f) : [...list, f]);
  });
  await flights.save(f).catch((e) => console.error('[saveFlight]', e));
}

export async function deleteFlight(id: string) {
  flightList.update(list => list.filter(x => x.id !== id));
  await flights.delete(id).catch((e) => console.error('[deleteFlight]', e));
}

export async function saveBoardingPass(flightId: string, bp: import('$lib/models/types').BoardingPass) {
  const flight = get(flightList).find(f => f.id === flightId);
  if (!flight) return;
  const passes = (flight.boardingPasses ?? []).filter(p => p.travelerId !== bp.travelerId);
  const updated = { ...flight, boardingPasses: [...passes, bp] };
  await saveFlight(updated);
}

// ── Mutations: Accommodation ───────────────────────────────

export async function saveAccommodation(a: Accommodation) {
  stayList.update(list => {
    const idx = list.findIndex(x => x.id === a.id);
    return sortStays(idx >= 0 ? list.with(idx, a) : [...list, a]);
  });
  await accommodations.save(a).catch((e) => console.error('[saveAccommodation]', e));
}

export async function deleteAccommodation(id: string) {
  stayList.update(list => list.filter(x => x.id !== id));
  await accommodations.delete(id).catch((e) => console.error('[deleteAccommodation]', e));
}

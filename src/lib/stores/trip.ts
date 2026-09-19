import { writable, derived, get } from 'svelte/store';
import type { Trip, TripDay, Activity, Flight, Accommodation, Traveler, Excursion } from '$lib/models/types';
import { trips, days, activities, flights, accommodations, travelers, excursions } from '$lib/firebase/services';
import { SEED_TRIP, SEED_DAYS, SEED_ACTIVITIES, SEED_FLIGHTS, SEED_ACCOMMODATIONS, SEED_TRAVELERS, SEED_EXCURSIONS } from '$lib/data/seed';
import { TRIP_ID } from '$lib/config';

// ── State ──────────────────────────────────────────────────

export const trip           = writable<Trip | null>(null);
export const tripDays       = writable<TripDay[]>([]);
export const activityList   = writable<Activity[]>([]);
export const flightList     = writable<Flight[]>([]);
export const stayList       = writable<Accommodation[]>([]);
export const travelerList   = writable<Traveler[]>([]);
export const excursionList  = writable<Excursion[]>([]);
export const loading        = writable(false);

// ── Derived ────────────────────────────────────────────────

export const activitiesByDay = derived(activityList, ($acts) =>
  $acts.reduce<Record<number, Activity[]>>((acc, a) => {
    (acc[a.dayDm] ??= []).push(a);
    return acc;
  }, {})
);

export const flightsMap = derived(flightList, ($fl) =>
  Object.fromEntries($fl.map(f => [f.id, f]))
);

export const staysMap = derived(stayList, ($sl) =>
  Object.fromEntries($sl.map(s => [s.id, s]))
);

export const excursionsMap = derived(excursionList, ($el) =>
  Object.fromEntries($el.map(e => [e.id, e]))
);

// ── Load ───────────────────────────────────────────────────


export async function loadTrip() {
  loading.set(true);
  try {
    let t = await trips.get(TRIP_ID).catch(() => null);

    if (!t) {
      // Firebase no disponible o primer arranque — intenta sembrar, si falla usa seed local
      try {
        await seedFirestore();
      } catch { /* Sin Firebase: modo offline puro */ }
      t = SEED_TRIP;
    }

    trip.set(t);

    const [d, a, f, s, tv, ex] = await Promise.all([
      days.getByTrip(TRIP_ID).catch(() => SEED_DAYS),
      activities.getByTrip(TRIP_ID).catch(() => SEED_ACTIVITIES),
      flights.getByTrip(TRIP_ID).catch(() => SEED_FLIGHTS),
      accommodations.getByTrip(TRIP_ID).catch(() => SEED_ACCOMMODATIONS),
      travelers.getByTrip(TRIP_ID).catch(() => SEED_TRAVELERS),
      excursions.getByTrip(TRIP_ID).catch(() => SEED_EXCURSIONS),
    ]);
    tripDays.set(d);
    activityList.set(a);
    flightList.set(f);
    stayList.set(s);
    travelerList.set(tv);
    excursionList.set(ex);
  } finally {
    loading.set(false);
  }
}

async function seedFirestore() {
  await trips.save(SEED_TRIP);
  await Promise.all([
    ...SEED_DAYS.map(d => days.save(d)),
    ...SEED_ACTIVITIES.map(a => activities.save(a)),
    ...SEED_FLIGHTS.map(f => flights.save(f)),
    ...SEED_ACCOMMODATIONS.map(s => accommodations.save(s)),
    ...SEED_TRAVELERS.map(t => travelers.save(t)),
    ...SEED_EXCURSIONS.map(e => excursions.save(e)),
  ]);
}

// ── Mutations: Activity ────────────────────────────────────

export async function saveActivity(a: Activity) {
  activityList.update(list => {
    const idx = list.findIndex(x => x.id === a.id);
    return idx >= 0 ? list.with(idx, a) : [...list, a];
  });
  _syncDayActivityBadge(a.dayDm);
  await activities.save(a).catch(() => {});
}

export async function deleteActivity(id: string) {
  const a = get(activityList).find(x => x.id === id);
  activityList.update(list => list.filter(x => x.id !== id));
  if (a) _syncDayActivityBadge(a.dayDm);
  await activities.delete(id).catch(() => {});
}

// ── Mutations: TripDay warn ────────────────────────────────

export async function saveDayWarn(dayId: string, warn: string) {
  tripDays.update(list =>
    list.map(d => d.id === dayId ? { ...d, warn: warn || undefined } : d)
  );
  const updated = get(tripDays).find(d => d.id === dayId);
  if (updated) await days.save(updated).catch(() => {/* offline: se sincroniza luego */});
}

// ── Mutations: Flight ──────────────────────────────────────

export async function saveFlight(f: Flight) {
  flightList.update(list => {
    const idx = list.findIndex(x => x.id === f.id);
    return idx >= 0 ? list.with(idx, f) : [...list, f];
  });
  await flights.save(f).catch(() => {});
}

export async function deleteFlight(id: string) {
  flightList.update(list => list.filter(x => x.id !== id));
  await flights.delete(id).catch(() => {});
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
    return idx >= 0 ? list.with(idx, a) : [...list, a];
  });
  await accommodations.save(a).catch(() => {});
}

export async function deleteAccommodation(id: string) {
  stayList.update(list => list.filter(x => x.id !== id));
  await accommodations.delete(id).catch(() => {});
}

// ── Helpers ────────────────────────────────────────────────

function _syncDayActivityBadge(dayDm: number) {
  const hasActs = get(activityList).some(a => a.dayDm === dayDm);
  tripDays.update(list =>
    list.map(day => {
      if (day.d !== dayDm) return day;
      const badges = hasActs
        ? Array.from(new Set([...day.badges, 'act' as const]))
        : day.badges.filter(b => b !== 'act');
      return { ...day, badges };
    })
  );
}

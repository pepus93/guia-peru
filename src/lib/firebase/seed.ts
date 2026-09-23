import { trips, days, activities, flights, accommodations, travelers } from './services';
import {
  SEED_TRIP, SEED_DAYS, SEED_ACTIVITIES, SEED_FLIGHTS,
  SEED_ACCOMMODATIONS, SEED_TRAVELERS,
} from '$lib/data/seed';

export async function seedFirestore(): Promise<void> {
  await trips.save(SEED_TRIP);
  await Promise.all([
    ...SEED_DAYS.map(d         => days.save(d)),
    ...SEED_ACTIVITIES.map(a   => activities.save(a)),
    ...SEED_FLIGHTS.map(f      => flights.save(f)),
    ...SEED_ACCOMMODATIONS.map(s => accommodations.save(s)),
    ...SEED_TRAVELERS.map(t    => travelers.save(t)),
  ]);
}

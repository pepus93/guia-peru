import { derived } from 'svelte/store';
import { tripDays } from '$lib/stores/trip';
import { todayDm } from '$lib/utils/dates';

export const TODAY_DM = todayDm();

export const inTrip = derived(tripDays, ($days) => {
  if (!$days.length) return false;
  const dms = $days.map(d => d.d);
  return TODAY_DM >= Math.min(...dms) && TODAY_DM <= Math.max(...dms);
});

import { derived } from 'svelte/store';
import { tripDays } from '$lib/stores/trip';
import { todayDm } from '$lib/utils/dates';

export const TODAY_DM = todayDm();

// ¿Estamos dentro del rango del viaje?
export const inTrip = derived(tripDays, ($days) => {
  if (!$days.length) return false;
  const dms = $days.map(d => d.d);
  return TODAY_DM >= Math.min(...dms) && TODAY_DM <= Math.max(...dms);
});

// TripDay de hoy (null si no estamos en el viaje)
export const todayDay = derived(tripDays, ($days) =>
  $days.find(d => d.d === TODAY_DM) ?? null
);

// IDs de los vuelos de hoy
export const todayFlightIds = derived(todayDay, ($day) =>
  new Set($day?.flightIds ?? [])
);

// ID del hotel de esta noche
export const todayStayId = derived(todayDay, ($day) =>
  $day?.stayId ?? null
);

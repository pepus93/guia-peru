import {
  collection, doc, getDocs, getDoc,
  setDoc, deleteDoc,
  query, where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Activity, Flight, Accommodation, TripDay, Trip, Traveler } from '$lib/models/types';

// ── Generic helpers ────────────────────────────────────────

function col(path: string) {
  if (!db) throw new Error('Firebase no configurado');
  return collection(db, path);
}
function ref(path: string, id: string) {
  if (!db) throw new Error('Firebase no configurado');
  return doc(db, path, id);
}

async function getAll<T>(path: string): Promise<T[]> {
  const snap = await getDocs(col(path));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as T);
}

async function getById<T>(path: string, id: string): Promise<T | null> {
  const snap = await getDoc(ref(path, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

async function upsert<T extends { id: string }>(path: string, item: T): Promise<void> {
  await setDoc(ref(path, item.id), { ...item, updatedAt: serverTimestamp() }, { merge: true });
}

async function remove(path: string, id: string): Promise<void> {
  await deleteDoc(ref(path, id));
}

async function queryByTrip<T>(path: string, tripId: string): Promise<T[]> {
  const snap = await getDocs(query(col(path), where('tripId', '==', tripId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as T);
}

// ── Trip ───────────────────────────────────────────────────

export const trips = {
  getAll: () => getAll<Trip>('trips'),
  get:    (id: string) => getById<Trip>('trips', id),
  save:   (trip: Trip) => upsert('trips', trip),
  delete: (id: string) => remove('trips', id),
};

// ── TripDay ────────────────────────────────────────────────

export const days = {
  getByTrip: (tripId: string) => queryByTrip<TripDay>('days', tripId),
  save:   (day: TripDay) => upsert('days', day),
  delete: (id: string) => remove('days', id),
};

// ── Activity ───────────────────────────────────────────────

export const activities = {
  getByTrip: (tripId: string) => queryByTrip<Activity>('activities', tripId),
  save:   (a: Activity) => upsert('activities', a),
  delete: (id: string) => remove('activities', id),
};

// ── Flight ─────────────────────────────────────────────────

export const flights = {
  getByTrip: (tripId: string) => queryByTrip<Flight>('flights', tripId),
  save:   (f: Flight) => upsert('flights', f),
  delete: (id: string) => remove('flights', id),
};

// ── Accommodation ──────────────────────────────────────────

export const accommodations = {
  getByTrip: (tripId: string) => queryByTrip<Accommodation>('accommodations', tripId),
  save:   (a: Accommodation) => upsert('accommodations', a),
  delete: (id: string) => remove('accommodations', id),
};

// ── Traveler ───────────────────────────────────────────────

export const travelers = {
  getByTrip: (tripId: string) => queryByTrip<Traveler>('travelers', tripId),
  save:   (t: Traveler) => upsert('travelers', t),
  delete: (id: string) => remove('travelers', id),
};

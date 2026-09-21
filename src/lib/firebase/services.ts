import {
  collection, doc, getDocs, getDoc,
  setDoc, deleteDoc,
  query, where, onSnapshot,
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

function watchByTrip<T>(
  path: string,
  tripId: string,
  callback: (items: T[]) => void,
): () => void {
  const q = query(col(path), where('tripId', '==', tripId));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as T));
  }, (err) => console.error(`[watch ${path}]`, err));
}

// ── Generic collection service factory ────────────────────

function createService<T extends { id: string }>(path: string) {
  return {
    getByTrip: (tripId: string) => queryByTrip<T>(path, tripId),
    watch:     (tripId: string, cb: (items: T[]) => void) => watchByTrip<T>(path, tripId, cb),
    save:      (item: T) => upsert(path, item),
    delete:    (id: string) => remove(path, id),
  };
}

// ── Trip (unique — no tripId filter needed) ────────────────

export const trips = {
  getAll: () => getAll<Trip>('trips'),
  get:    (id: string) => getById<Trip>('trips', id),
  save:   (trip: Trip) => upsert('trips', trip),
  delete: (id: string) => remove('trips', id),
};

// ── Collection services ────────────────────────────────────

export const days           = createService<TripDay>('days');
export const activities     = createService<Activity>('activities');
export const flights        = createService<Flight>('flights');
export const accommodations = createService<Accommodation>('accommodations');
export const travelers      = createService<Traveler>('travelers');

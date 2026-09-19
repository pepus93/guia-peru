import { writable } from 'svelte/store';
import type { Activity, Flight, Accommodation, BoardingPass } from '$lib/models/types';

// ── Active tab ─────────────────────────────────────────────

export type Tab = 'dias' | 'vuelos' | 'hoteles' | 'planes' | 'info';
export const activeTab = writable<Tab>('dias');

// ── Modal ──────────────────────────────────────────────────

export type ModalKind = 'activity' | 'flight' | 'hotel';

interface ModalState {
  open: boolean;
  kind: ModalKind | null;
  data: Activity | Flight | Accommodation | null;
}

const _modal = writable<ModalState>({ open: false, kind: null, data: null });
export const modal = { subscribe: _modal.subscribe };

export function openModal(kind: ModalKind, data?: Activity | Flight | Accommodation | null) {
  _modal.set({ open: true, kind, data: data ?? null });
}

export function closeModal() {
  _modal.set({ open: false, kind: null, data: null });
}

// ── Boarding pass modal ────────────────────────────────────

interface BpModalState {
  open: boolean;
  flight: Flight | null;
  travelerId: 'pepe' | 'sunta' | null;
  existing: BoardingPass | null;
}

const _bpModal = writable<BpModalState>({ open: false, flight: null, travelerId: null, existing: null });
export const bpModal = { subscribe: _bpModal.subscribe };

export function openBpModal(flight: Flight, travelerId: 'pepe' | 'sunta', existing?: BoardingPass) {
  _bpModal.set({ open: true, flight, travelerId, existing: existing ?? null });
}

export function closeBpModal() {
  _bpModal.set({ open: false, flight: null, travelerId: null, existing: null });
}

// ── Deep link flash ────────────────────────────────────────

export const flashId = writable<string | null>(null);

export function flashElement(id: string) {
  flashId.set(id);
  setTimeout(() => flashId.set(null), 2000);
}

// ── Clock ──────────────────────────────────────────────────

export const peruTime  = writable('--:--');
export const spainTime = writable('--:--');
export const timeDiff  = writable('');

export function startClocks() {
  function tick() {
    const now = new Date();
    const fmt = (tz: string) =>
      now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', timeZone: tz });

    const peruH  = +now.toLocaleString('en', { hour: 'numeric', hour12: false, timeZone: 'America/Lima' });
    const spainH = +now.toLocaleString('en', { hour: 'numeric', hour12: false, timeZone: 'Europe/Madrid' });
    const diff   = spainH - peruH;
    const sign   = diff >= 0 ? '+' : '';

    peruTime.set(fmt('America/Lima'));
    spainTime.set(fmt('Europe/Madrid'));
    timeDiff.set(`ES ${sign}${diff}h`);
  }
  tick();
  return setInterval(tick, 30_000);
}

import type { Accommodation, InfoBadge } from './types';
import { mapsUrl } from '$lib/utils/maps';
import { dmToDate } from '$lib/utils/dates';

export class AccommodationModel {
  constructor(readonly data: Accommodation) {}

  get mapsUrl()       { return mapsUrl(this.data.addr); }
  get checkInLabel()  { return `Check-in ${this.data.checkIn}`; }
  get checkOutLabel() { return `Check-out ${this.data.checkOut}`; }

  get nights() {
    const from = dmToDate(this.data.startDm);
    const to   = dmToDate(this.data.endDm);
    return Math.round((to.getTime() - from.getTime()) / 86_400_000);
  }

  // ── Info badges ───────────────────────────────────────────

  get infoBadges(): InfoBadge[] {
    const b: InfoBadge[] = [];
    const notes = this.data.notes?.toLowerCase() ?? '';

    if (notes.includes('desayuno'))
      b.push({ label: '🍳 Desayuno incl.', cls: 'pill-green' });

    const n = this.nights;
    b.push({ label: `🌙 ${n} ${n === 1 ? 'noche' : 'noches'}`, cls: 'pill-info' });
    b.push({ label: `🔑 ${this.data.checkIn}`, cls: 'pill-info' });
    b.push({ label: `🚪 ${this.data.checkOut}`, cls: 'pill-info' });

    return b;
  }
}

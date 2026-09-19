import type { Accommodation } from './types';
import type { InfoBadge } from './ActivityModel';
import { mapsUrl } from '$lib/utils/maps';

export class AccommodationModel {
  constructor(readonly data: Accommodation) {}

  get mapsUrl()       { return mapsUrl(this.data.addr); }
  get checkInLabel()  { return `Check-in ${this.data.checkIn}`; }
  get checkOutLabel() { return `Check-out ${this.data.checkOut}`; }

  // ── Info badges ───────────────────────────────────────────

  get infoBadges(): InfoBadge[] {
    const b: InfoBadge[] = [];

    // Numeric score (e.g. Booking.com score)
    if (this.data.rating)
      b.push({ label: `${this.data.rating} / 10`, cls: 'pill-green' });

    // Breakfast — detect in notes
    const notes = this.data.notes?.toLowerCase() ?? '';
    if (notes.includes('desayuno'))
      b.push({ label: '🍳 Desayuno incl.', cls: 'pill-green' });

    // Check-in window as pill
    b.push({ label: `🔑 ${this.data.checkIn}`, cls: 'pill-info' });

    return b;
  }
}

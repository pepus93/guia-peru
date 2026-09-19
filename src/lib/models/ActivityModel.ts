import type { Activity } from './types';
import { ACTIVITY_TYPES } from './types';
import { mapsUrl } from '$lib/utils/maps';

export interface InfoBadge {
  label: string;
  cls: 'pill-info' | 'pill-green' | 'pill-sky' | 'pill-terra' | 'pill-warn' | 'pill-gold';
}

export class ActivityModel {
  constructor(readonly data: Activity) {}

  get typeInfo() {
    return ACTIVITY_TYPES[this.data.type] ?? { icon: '📌', bg: 'rgba(42,26,18,.07)', label: this.data.type };
  }

  get mapsUrl()  { return this.data.mapsQuery  ? mapsUrl(this.data.mapsQuery)  : ''; }
  get meetUrl()  { return this.data.meetQuery  ? mapsUrl(this.data.meetQuery)  : ''; }
  get endUrl()   { return this.data.endQuery   ? mapsUrl(this.data.endQuery)   : ''; }

  get timeLabel() {
    const parts = [this.data.time, this.data.duration].filter(Boolean);
    return parts.join(' · ');
  }

  get hasMaps()  { return !!(this.mapsUrl || this.meetUrl || this.endUrl); }
  get hasPhone() { return !!this.data.tel; }

  // ── Info badges — defined per type ───────────────────────

  get infoBadges(): InfoBadge[] {
    const b: InfoBadge[] = [];
    const note = this.data.note?.toLowerCase() ?? '';

    // Duration — universal
    if (this.data.duration)
      b.push({ label: this.data.duration, cls: 'pill-info' });

    // Booking confirmed
    if (this.data.bookingUrl)
      b.push({ label: '🎫 Reservado', cls: 'pill-green' });

    // Type-specific logic
    switch (this.data.type) {
      case 'tour':
        if (note.includes('gratis') || note.includes('gratuito'))
          b.push({ label: 'Gratis', cls: 'pill-green' });
        else if (note.includes('propina'))
          b.push({ label: 'Propina voluntaria', cls: 'pill-info' });
        else if (note.includes('incluido') || note.includes('included'))
          b.push({ label: 'Incluido', cls: 'pill-green' });
        // Agency name: first segment before · in note
        if (this.data.note?.includes('·')) {
          const agency = this.data.note.split('·')[0].trim();
          if (agency.length > 0 && agency.length <= 20)
            b.push({ label: agency, cls: 'pill-sky' });
        }
        break;

      case 'restaurant':
        if (note.includes('s/') || note.includes('sol') || note.includes('€'))
          b.push({ label: this._extractPrice(), cls: 'pill-info' });
        if (note.includes('reserva') || this.data.bookingUrl)
          b.push({ label: 'Reserva recomendada', cls: 'pill-warn' });
        break;

      case 'museo':
        if (note.includes('gratis') || note.includes('gratuito'))
          b.push({ label: 'Entrada gratuita', cls: 'pill-green' });
        else if (note.match(/s\/\s?\d+|€\s?\d+|\d+\s*sol/i))
          b.push({ label: this._extractPrice(), cls: 'pill-info' });
        break;

      case 'transporte':
        if (this.data.duration)
          b.push({ label: `🚌 ${this.data.duration}`, cls: 'pill-info' });
        break;
    }

    return b;
  }

  private _extractPrice(): string {
    const match = this.data.note?.match(/S\/\s?\d+[\d–\-]*|€\s?\d+[\d–\-]*|\d+[\d–\-]*\s*sol/i);
    return match ? match[0].trim() : '';
  }
}

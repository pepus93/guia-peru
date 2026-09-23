import type { Activity, InfoBadge } from './types';
import { mapsUrl } from '$lib/utils/maps';
import { BaseDayModel } from './BaseDayModel';

function parseDurationMins(s: string): number {
  s = s.toLowerCase().replace(/aprox\.?\s*/g, '').trim();
  let total = 0;
  const hMatch = s.match(/(\d+)\s*h/);
  const mMatch = s.match(/(\d+)\s*m(?:in)?/);
  if (hMatch) total += parseInt(hMatch[1]) * 60;
  if (mMatch) total += parseInt(mMatch[1]);
  return total;
}

export class ActivityModel extends BaseDayModel<Activity> {
  // meetUrl, endUrl y timeLabel heredados de BaseDayModel

  get estimatedEndTime(): string {
    const { time, duration } = this.data;
    if (!time || !duration) return '';
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '';
    const dMins = parseDurationMins(duration);
    if (!dMins) return '';
    const total = h * 60 + m + dMins;
    const eH = Math.floor(total / 60) % 24;
    const eM = total % 60;
    return `~${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`;
  }

  get telHref() { return this.data.providerTel ? `tel:${this.data.providerTel}` : ''; }

  get waHref() {
    if (!this.data.providerTel) return '';
    const num = this.data.providerTel.replace(/\D/g, '');
    return `https://wa.me/${num}`;
  }

  get mapsUrl()  { return this.data.mapsQuery ? mapsUrl(this.data.mapsQuery) : ''; }
  get hasMaps()  { return !!(this.mapsUrl || this.meetUrl || this.endUrl); }
  get hasPhone() { return !!this.data.tel; }

  // ── Info badges — definidos por tipo ────────────────────────

  get infoBadges(): InfoBadge[] {
    const b: InfoBadge[] = [];
    const note = this.data.note?.toLowerCase() ?? '';

    if (this.data.bookingUrl)
      b.push({ label: 'Reservado', variant: 'green' });

    switch (this.data.type) {
      case 'tour':
        if (note.includes('gratis') || note.includes('gratuito'))
          b.push({ label: 'Gratis', variant: 'green' });
        else if (note.includes('propina'))
          b.push({ label: 'Propina voluntaria', variant: 'info' });
        else if (note.includes('incluido') || note.includes('included'))
          b.push({ label: 'Incluido', variant: 'green' });
        if (this.data.note?.includes('·')) {
          const agency = this.data.note.split('·')[0].trim();
          if (agency.length > 0 && agency.length <= 20)
            b.push({ label: agency, variant: 'sky' });
        }
        break;

      case 'restaurant':
        if (note.includes('s/') || note.includes('sol') || note.includes('€'))
          b.push({ label: this._extractPrice(), variant: 'info' });
        if (note.includes('reserva') || this.data.bookingUrl)
          b.push({ label: 'Reserva recomendada', variant: 'warn' });
        break;

      case 'museo':
        if (note.includes('gratis') || note.includes('gratuito'))
          b.push({ label: 'Entrada gratuita', variant: 'green' });
        else if (note.match(/s\/\s?\d+|€\s?\d+|\d+\s*sol/i))
          b.push({ label: this._extractPrice(), variant: 'info' });
        break;

      case 'transporte':
        if (this.data.duration)
          b.push({ label: this.data.duration, variant: 'info' });
        break;

      case 'excursion':
        if (this.data.bookingCode)
          b.push({ label: this.data.bookingCode, variant: 'green' });
        if (this.data.price)
          b.push({ label: this.data.price, variant: 'info' });
        break;
    }

    return b;
  }

  private _extractPrice(): string {
    const match = this.data.note?.match(/S\/\s?\d+[\d–\-]*|€\s?\d+[\d–\-]*|\d+[\d–\-]*\s*sol/i);
    return match ? match[0].trim() : '';
  }
}

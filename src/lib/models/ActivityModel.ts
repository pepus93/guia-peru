import type { Activity, InfoBadge } from './types';
import { ACTIVITY_TYPES } from './types';
import { mapsUrl } from '$lib/utils/maps';
import { BaseDayModel } from './BaseDayModel';

export class ActivityModel extends BaseDayModel<Activity> {
  // meetUrl, endUrl y timeLabel heredados de BaseDayModel

  get telHref() { return this.data.providerTel ? `tel:${this.data.providerTel}` : ''; }

  get waHref() {
    if (!this.data.providerTel) return '';
    const num = this.data.providerTel.replace(/\D/g, '');
    return `https://wa.me/${num}`;
  }

  get typeInfo() {
    return ACTIVITY_TYPES[this.data.type] ?? { icon: '📌', bg: 'rgba(42,26,18,.07)', label: this.data.type };
  }

  get mapsUrl()  { return this.data.mapsQuery ? mapsUrl(this.data.mapsQuery) : ''; }
  get hasMaps()  { return !!(this.mapsUrl || this.meetUrl || this.endUrl); }
  get hasPhone() { return !!this.data.tel; }

  // ── Info badges — definidos por tipo ────────────────────────

  get infoBadges(): InfoBadge[] {
    const b: InfoBadge[] = [];
    const note = this.data.note?.toLowerCase() ?? '';

    if (this.data.duration)
      b.push({ label: this.data.duration, cls: 'pill-info' });

    if (this.data.bookingUrl)
      b.push({ label: 'Reservado', cls: 'pill-green' });

    switch (this.data.type) {
      case 'tour':
        if (note.includes('gratis') || note.includes('gratuito'))
          b.push({ label: 'Gratis', cls: 'pill-green' });
        else if (note.includes('propina'))
          b.push({ label: 'Propina voluntaria', cls: 'pill-info' });
        else if (note.includes('incluido') || note.includes('included'))
          b.push({ label: 'Incluido', cls: 'pill-green' });
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
          b.push({ label: this.data.duration, cls: 'pill-info' });
        break;

      case 'excursion':
        if (this.data.bookingCode)
          b.push({ label: this.data.bookingCode, cls: 'pill-green' });
        if (this.data.price)
          b.push({ label: this.data.price, cls: 'pill-info' });
        break;
    }

    return b;
  }

  private _extractPrice(): string {
    const match = this.data.note?.match(/S\/\s?\d+[\d–\-]*|€\s?\d+[\d–\-]*|\d+[\d–\-]*\s*sol/i);
    return match ? match[0].trim() : '';
  }
}

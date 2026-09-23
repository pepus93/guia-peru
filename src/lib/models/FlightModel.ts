import type { Flight, InfoBadge } from './types';

export class FlightModel {
  constructor(readonly data: Flight) {}

  get isInternational() { return !!this.data.intl; }
  get routeLabel()      { return `${this.data.from} → ${this.data.to}`; }
  get timeLabel()       { return `${this.data.dep} → ${this.data.arr}`; }
  get typeLabel()       { return this.isInternational ? 'Internacional' : 'Vuelo interno'; }
  get earlyLabel()      { return this.isInternational ? '3h antes · vuelo internacional' : '1h 30min antes · vuelo interno'; }

  get flightRadar24Url() {
    return this.data.code
      ? `https://www.flightradar24.com/search?term=${encodeURIComponent(this.data.code)}`
      : '';
  }

  // ── Info badges ───────────────────────────────────────────

  get infoBadges(): InfoBadge[] {
    const b: InfoBadge[] = [];

    // Direct / connection
    if (this.data.stops) {
      const isDirect = /directo/i.test(this.data.stops);
      b.push({
        label: isDirect ? 'Directo' : this.data.stops,
        variant:   isDirect ? 'green' : 'warn',
      });
    }

    // Duration — extracted from note field ("Duración 12h 55m" or "1h 32 min")
    const dur = this._parseDuration();
    if (dur) b.push({ label: `Duración ${dur}`, variant: 'info' });

    // Airline code
    if (this.data.code)
      b.push({ label: this.data.code, variant: 'info' });

    return b;
  }

  private _parseDuration(): string {
    if (this.data.duration) return this.data.duration;
    if (!this.data.note) return '';
    const match = this.data.note.match(/(\d+h\s?\d*\s?m(?:in)?|\d+h)/i);
    return match ? match[0].replace(/\s+/g, '') : '';
  }
}

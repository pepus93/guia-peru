import type { TripDay, BadgeType } from './types';
import { dmToDow, dmToLabel, dmToMonth, todayDm } from '$lib/utils/dates';

export const BADGE_MAP: Record<BadgeType, { cls: string; icon: string; text: string }> = {
  fly:  { cls: 'b-fly',  icon: 'plane',          text: 'Vuelo' },
  bed:  { cls: 'b-bed',  icon: 'bed',             text: 'Dormir' },
  act:  { cls: 'b-act',  icon: 'compass',         text: 'Planes' },
  warn: { cls: 'b-warn', icon: 'alert-triangle',  text: 'Ojo' },
};

// Gradientes base por ciudad — fallback si no hay lugar específico
const CITY_GRADIENT: Record<string, string> = {
  lima:     'linear-gradient(175deg, #e8d8c0 0%, #d0b888 100%)',
  arequipa: 'linear-gradient(175deg, #f0e0c8 0%, #d89858 100%)',
  cusco:    'linear-gradient(175deg, #e4a87a 0%, #c07848 100%)',
  selva:    'linear-gradient(175deg, #aacca0 0%, #78b080 100%)',
};

// Gradientes por lugar/actividad — prioridad sobre ciudad
// El orden importa: los más específicos primero
const PLACE_GRADIENTS: Array<[RegExp, string]> = [
  // Montaña de 7 Colores — Vinicunca: colores reales del mineral
  [/vinicunca|7 col|siete col/,
    'linear-gradient(175deg, #f0a898 0%, #f0c870 18%, #e4ec90 36%, #a8d8c8 54%, #a8a0d8 72%, #d8a0c8 100%)'],
  // Machu Picchu — ruinas en la niebla, selva nubosa
  [/machu picchu/,
    'linear-gradient(175deg, #a8c898 0%, #c0d8b0 55%, #d4e8cc 100%)'],
  // Salkantay trek — tierra → piedra → nieve → cielo
  [/salkantay/,
    'linear-gradient(175deg, #c0a870 0%, #d4c4a0 38%, #e4dcd0 68%, #b8cce0 100%)'],
  // Ausangate / 7 lagunas — azul glaciar
  [/ausangate|lagunas/,
    'linear-gradient(175deg, #88b8d4 0%, #b4d4e4 52%, #d4ecf4 100%)'],
  // Valle del Colca — cañón dramático, cóndores
  [/colca|cañón|canon/,
    'linear-gradient(175deg, #d8b890 0%, #c4a060 50%, #cca868 100%)'],
  // Valle Sagrado — campos dorados, terrazas verdes
  [/valle sagrado/,
    'linear-gradient(175deg, #e0c860 0%, #c4c860 42%, #8cb860 100%)'],
];

export class TripDayModel {
  constructor(readonly data: TripDay) {}

  get dow()          { return dmToDow(this.data.d); }
  get dayNum()       { return this.data.d % 100; }
  get monthLabel()   { return dmToMonth(this.data.d); }
  get dateLabel()    { return dmToLabel(this.data.d); }
  get cityGradient() {
    const t = [this.data.title, this.data.sub, this.data.place].join(' ').toLowerCase();
    for (const [re, grad] of PLACE_GRADIENTS) {
      if (re.test(t)) return grad;
    }
    return CITY_GRADIENT[this.data.city] ?? CITY_GRADIENT.lima;
  }

  get badgeInfos() {
    return this.data.badges.map(b => ({ ...BADGE_MAP[b], type: b }));
  }

  get isPast()  { return this.data.d < todayDm(); }
  isToday()     { return this.data.d === todayDm(); }
}

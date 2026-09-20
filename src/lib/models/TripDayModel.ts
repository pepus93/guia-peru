import type { TripDay, BadgeType } from './types';
import { dmToDow, dmToLabel, dmToMonth, todayDm } from '$lib/utils/dates';

const BADGE_MAP: Record<BadgeType, { cls: string; icon: string; text: string }> = {
  fly:  { cls: 'b-fly',  icon: 'plane',          text: 'Vuelo' },
  bed:  { cls: 'b-bed',  icon: 'bed',             text: 'Dormir' },
  act:  { cls: 'b-act',  icon: 'compass',         text: 'Planes' },
  warn: { cls: 'b-warn', icon: 'alert-triangle',  text: 'Ojo' },
};

const CITY_GRADIENT: Record<string, string> = {
  lima:     'linear-gradient(160deg,#e8dcc8,#ddc9a8)',
  arequipa: 'linear-gradient(160deg,#f0d9c0,#e6b98f)',
  cusco:    'linear-gradient(160deg,#e4cdb6,#c99a76)',
  selva:    'linear-gradient(160deg,#cfe0cb,#9cc09a)',
};

export class TripDayModel {
  constructor(readonly data: TripDay) {}

  get dow()          { return dmToDow(this.data.d); }
  get dayNum()       { return this.data.d % 100; }
  get monthLabel()   { return dmToMonth(this.data.d); }
  get dateLabel()    { return dmToLabel(this.data.d); }
  get cityGradient() { return CITY_GRADIENT[this.data.city] ?? CITY_GRADIENT.lima; }

  get badgeInfos() {
    return this.data.badges.map(b => ({ ...BADGE_MAP[b], type: b }));
  }

  get isPast()  { return this.data.d < todayDm(); }
  isToday()     { return this.data.d === todayDm(); }
}

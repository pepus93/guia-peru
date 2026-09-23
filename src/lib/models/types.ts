// ── CITY ────────────────────────────────────────────────────
export type City = 'lima' | 'arequipa' | 'cusco' | 'selva';

// ── ACTIVITY TYPE ─────────────────────────────────────────────
export type ActivityType =
  | 'tour' | 'restaurant' | 'museo' | 'transporte'
  | 'mirador' | 'playa' | 'compras' | 'ocio' | 'excursion';

// ── INFO BADGE ────────────────────────────────────────────────
export interface InfoBadge {
  label: string;
  variant: 'info' | 'green' | 'sky' | 'terra' | 'warn' | 'gold';
}

// ── BASE ACTIVITY ─────────────────────────────────────────────
// Campos comunes a Activity y Excursion (ambos son elementos de un día concreto)
export interface BaseActivity {
  id: string;
  tripId: string;
  dayDm: number;
  endDayDm?: number;   // para planes multi-día (p.ej. excursión que abarca 2 días)
  city: City;
  name: string;
  time?: string;
  duration?: string;
  note?: string;
  meet?: string;
  meetQuery?: string;
  end?: string;
  endQuery?: string;
}

// ── ACTIVITY ─────────────────────────────────────────────────
export interface Activity extends BaseActivity {
  type: ActivityType;
  addr?: string;
  tel?: string;
  mapsQuery?: string;
  bookingUrl?: string;
  // campos de excursión/tour organizado (opcionales)
  bookingCode?: string;
  pin?: string;
  provider?: string;
  providerTel?: string;
  price?: string;
  includes?: string[];
  notIncludes?: string[];
  days?: ExcursionDay[];
  cancelBefore?: string;
  warn?: string;
}

// ── FLIGHT ───────────────────────────────────────────────────
export interface FlightTransport {
  how: string;
}

export interface BoardingPass {
  travelerId: 'pepe' | 'sunta';
  seat?: string;
  gate?: string;
  terminal?: string;
  boardingTime?: string;
  locator?: string;
}

export interface Flight {
  id: string;
  tripId: string;
  date: string;
  dm: number;
  dow: string;
  intl?: boolean;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  dep: string;
  arr: string;
  airline: string;
  code?: string;
  price?: string;
  note?: string;
  duration?: string;
  stops?: string;
  transport?: FlightTransport;
  boardingPasses?: BoardingPass[];
}

// ── ACCOMMODATION ─────────────────────────────────────────────
export interface Accommodation {
  id: string;
  tripId: string;
  name: string;
  city: City;
  dates: string;
  startDm: number;
  endDm: number;
  stars?: number;
  rating?: number;
  addr: string;
  mapsQuery?: string;
  tel: string;
  checkIn: string;
  checkOut: string;
  breakfast?: boolean;
  notes?: string;
}

// ── EXCURSION DAY (itinerario multi-día) ──────────────────────
export interface ExcursionDay {
  title: string;
  sub?: string;
}

// ── TRIP DAY ──────────────────────────────────────────────────
export type BadgeType = 'fly' | 'bed' | 'act' | 'warn';

export interface TripDay {
  id: string;
  tripId: string;
  d: number;
  city: City;
  place: string;
  title: string;
  sub: string;
  flightIds?: string[];
  stayId?: string;
  excursionId?: string;
  act?: string[];
  warn?: string;
  badges: BadgeType[];
}

// ── TRAVELER ──────────────────────────────────────────────────
export interface Traveler {
  id: string;
  tripId: string;
  name: string;
  nickname: string;
  dni: string;
  born: string;
  dniValid: string;
  passport: string;
  passportValid: string;
  dniImages?: string[];
  passportImg?: string;
}

// ── TRIP ──────────────────────────────────────────────────────
export interface Trip {
  id: string;
  name: string;
  subtitle: string;
  startDm: number;
  endDm: number;
  totalDays: number;
}

// ── DAY ENTRY STYLES ──────────────────────────────────────
export type DayEntryKind = 'flight' | 'hotel' | 'plan';

// ── CITY INFO ─────────────────────────────────────────────────
export interface CityInfo {
  alt: string;
  temp: string;
  tip: string;
}

// ── INSURANCE ─────────────────────────────────────────────────
export interface InsuranceCoverage {
  label: string;
  value: string;
  key?: boolean;
}
export interface InsuranceContact {
  label: string;
  tel?: string;
  value?: string;
  type: 'tel' | 'whatsapp' | 'email';
  note?: string;
}
export interface Insurance {
  product: string;
  company: string;
  broker: string;
  policy: string;
  tripNumber: string;
  amount: string;
  period: string;
  scope: string;
  contacts: InsuranceContact[];
  coverages: InsuranceCoverage[];
  docs: { label: string; file: string }[];
}

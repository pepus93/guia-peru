// ── CITY ────────────────────────────────────────────────────
export type City = 'lima' | 'arequipa' | 'cusco' | 'selva';

// ── ACTIVITY ─────────────────────────────────────────────────
export type ActivityType =
  | 'tour' | 'restaurant' | 'museo' | 'transporte'
  | 'mirador' | 'playa' | 'compras' | 'ocio';

export const ACTIVITY_TYPES: Record<ActivityType, { icon: string; bg: string; label: string }> = {
  tour:       { icon: '🎭', bg: 'rgba(63,125,100,.14)',  label: 'Tour' },
  restaurant: { icon: '🍽️', bg: 'rgba(224,168,62,.18)', label: 'Restaurante' },
  museo:      { icon: '🏛️', bg: 'rgba(58,110,165,.14)', label: 'Museo' },
  transporte: { icon: '🚌', bg: 'rgba(217,139,69,.18)', label: 'Transporte' },
  mirador:    { icon: '🔭', bg: 'rgba(63,125,100,.12)', label: 'Mirador' },
  playa:      { icon: '🏖️', bg: 'rgba(58,110,165,.12)', label: 'Playa' },
  compras:    { icon: '🛍️', bg: 'rgba(198,90,52,.12)',  label: 'Compras' },
  ocio:       { icon: '🎉', bg: 'rgba(224,168,62,.14)', label: 'Ocio' },
};

export interface Activity {
  id: string;
  tripId: string;
  dayDm: number;
  city: City;
  type: ActivityType;
  name: string;
  time?: string;
  duration?: string;
  note?: string;
  meet?: string;
  end?: string;
  addr?: string;
  tel?: string;
  mapsQuery?: string;
  meetQuery?: string;
  endQuery?: string;
  bookingUrl?: string;
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
  tel: string;
  checkIn: string;
  checkOut: string;
  notes?: string;
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
  flightId?: string;
  stayId?: string;
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

// ── CITY ────────────────────────────────────────────────────
export type City = 'lima' | 'arequipa' | 'cusco' | 'selva';

export const CITY_LABELS: Record<City, string> = {
  lima:     'Lima',
  arequipa: 'Arequipa',
  cusco:    'Cusco',
  selva:    'Amazonia',
};

export const CITY_COLORS: Record<City, string> = {
  lima:     'var(--sky)',
  arequipa: 'var(--terra)',
  cusco:    'var(--jade)',
  selva:    '#5a9a4a',
};

// ── ACTIVITY TYPE ─────────────────────────────────────────────
export type ActivityType =
  | 'tour' | 'restaurant' | 'museo' | 'transporte'
  | 'mirador' | 'playa' | 'compras' | 'ocio' | 'excursion';

export const ACTIVITY_TYPES: Record<ActivityType, { icon: string; bg: string; label: string; color: string }> = {
  tour:       { icon: 'star',         bg: 'rgba(63,125,100,.14)',  label: 'Tour',        color: 'var(--jade)' },
  restaurant: { icon: 'utensils',     bg: 'rgba(224,168,62,.18)', label: 'Restaurante', color: 'var(--clay)' },
  museo:      { icon: 'landmark',     bg: 'rgba(58,110,165,.14)', label: 'Museo',       color: 'var(--sky)' },
  transporte: { icon: 'bus',          bg: 'rgba(217,139,69,.18)', label: 'Transporte',  color: 'var(--ink-soft)' },
  mirador:    { icon: 'eye',          bg: 'rgba(63,125,100,.12)', label: 'Mirador',     color: 'var(--jade)' },
  playa:      { icon: 'waves',        bg: 'rgba(58,110,165,.12)', label: 'Playa',       color: 'var(--sky)' },
  compras:    { icon: 'shopping-bag', bg: 'rgba(198,90,52,.12)',  label: 'Compras',     color: 'var(--terra)' },
  ocio:       { icon: 'music',        bg: 'rgba(224,168,62,.14)', label: 'Ocio',        color: '#c08a14' },
  excursion:  { icon: 'mountain',     bg: 'rgba(120,80,160,.14)', label: 'Excursión',   color: '#7850a0' },
};

// ── INFO BADGE ────────────────────────────────────────────────
export interface InfoBadge {
  label: string;
  cls: 'pill-info' | 'pill-green' | 'pill-sky' | 'pill-terra' | 'pill-warn' | 'pill-gold';
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
// Fuente única de verdad para icono/color de cada tipo de entrada en DayCard
export type DayEntryKind = 'flight' | 'hotel' | 'plan';

export const DAY_ENTRY_STYLES: Record<DayEntryKind, { icon: string; iconBg: string; iconColor: string; itemBg: string }> = {
  flight: { icon: 'plane',   iconBg: 'rgba(58,110,165,.14)',  iconColor: 'var(--sky)',  itemBg: 'rgba(58,110,165,.06)'  },
  hotel:  { icon: 'bed',     iconBg: 'rgba(63,125,100,.14)',  iconColor: 'var(--jade)', itemBg: 'rgba(63,125,100,.06)'  },
  plan:   { icon: 'compass', iconBg: 'rgba(120,80,160,.14)',  iconColor: 'var(--lila)', itemBg: 'rgba(120,80,160,.06)' },
};

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

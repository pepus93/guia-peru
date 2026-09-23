import type { City, ActivityType, DayEntryKind } from '$lib/models/types';

// ── CITY ─────────────────────────────────────────────────────
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
  selva:    'var(--selva)',
};

// ── ACTIVITY TYPES ────────────────────────────────────────────
export const ACTIVITY_TYPES: Record<ActivityType, { icon: string; bg: string; label: string; color: string }> = {
  tour:       { icon: 'star',         bg: 'color-mix(in srgb, var(--jade)     14%, transparent)', label: 'Tour',        color: 'var(--jade)'     },
  restaurant: { icon: 'utensils',     bg: 'color-mix(in srgb, var(--gold)     18%, transparent)', label: 'Restaurante', color: 'var(--clay)'     },
  museo:      { icon: 'landmark',     bg: 'color-mix(in srgb, var(--sky)      14%, transparent)', label: 'Museo',       color: 'var(--sky)'      },
  transporte: { icon: 'bus',          bg: 'color-mix(in srgb, var(--clay)     18%, transparent)', label: 'Transporte',  color: 'var(--ink-soft)' },
  mirador:    { icon: 'eye',          bg: 'color-mix(in srgb, var(--jade)     12%, transparent)', label: 'Mirador',     color: 'var(--jade)'     },
  playa:      { icon: 'waves',        bg: 'color-mix(in srgb, var(--sky)      12%, transparent)', label: 'Playa',       color: 'var(--sky)'      },
  compras:    { icon: 'shopping-bag', bg: 'color-mix(in srgb, var(--terra)    12%, transparent)', label: 'Compras',     color: 'var(--terra)'    },
  ocio:       { icon: 'music',        bg: 'color-mix(in srgb, var(--gold-mid) 14%, transparent)', label: 'Ocio',        color: 'var(--gold-mid)' },
  excursion:  { icon: 'mountain',     bg: 'color-mix(in srgb, var(--lila)     14%, transparent)', label: 'Excursión',   color: 'var(--lila)'     },
};

// ── DAY ENTRY STYLES ──────────────────────────────────────────
export const DAY_ENTRY_STYLES: Record<DayEntryKind, { icon: string; iconBg: string; iconColor: string; itemBg: string }> = {
  flight: { icon: 'plane',   iconBg: 'color-mix(in srgb, var(--sky)  14%, transparent)', iconColor: 'var(--sky)',  itemBg: 'color-mix(in srgb, var(--sky)  6%, transparent)' },
  hotel:  { icon: 'bed',     iconBg: 'color-mix(in srgb, var(--jade) 14%, transparent)', iconColor: 'var(--jade)', itemBg: 'color-mix(in srgb, var(--jade) 6%, transparent)' },
  plan:   { icon: 'compass', iconBg: 'color-mix(in srgb, var(--lila) 14%, transparent)', iconColor: 'var(--lila)', itemBg: 'color-mix(in srgb, var(--lila) 6%, transparent)' },
};

// ── CARD ACCENTS ──────────────────────────────────────────────
// Color característico por tipo de entidad — usado en flashColor, border hover, etc.
export const CARD_ACCENT = {
  flight:        'var(--sky)',
  accommodation: 'var(--jade)',
  activity:      'var(--lila)',
} as const;

export const FLASH_COLOR = {
  flight:        'var(--sky)',
  accommodation: 'var(--jade)',
  activity:      'var(--lila)',
} as const;

// ── PAGE THEMES ───────────────────────────────────────────────
// Acento y patrón SVG de fondo por pestaña
export const PAGE_THEME = {
  hoteles: { accent: 'var(--jade)', pattern: '' },
  vuelos:  { accent: 'var(--sky)',  pattern: '' },
  planes:  { accent: 'var(--lila)', pattern: '' },
  cambio:  { accent: 'var(--clay)', pattern: '' },
  dias:    { accent: null,          pattern: '' },
} as const;

const DAYS_ES  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function dmToDate(dm: number): Date {
  const d = dm % 100;
  const m = Math.floor(dm / 100) - 1;
  return new Date(2026, m, d);
}

export function dmToDow(dm: number): string {
  return DAYS_ES[dmToDate(dm).getDay()];
}

export function dmToLabel(dm: number): string {
  const date = dmToDate(dm);
  return `${date.getDate()} ${MONTHS_ES[date.getMonth()]}`;
}

export function daysUntil(dm: number): number {
  const target = dmToDate(dm);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

export function todayDm(): number {
  const d = new Date();
  return (d.getMonth() + 1) * 100 + d.getDate();
}

// "12 oct" para un día, "12–15 oct" para un rango del mismo mes
export function dmToDateRange(from: number, to?: number): string {
  if (!to || to === from) return dmToLabel(from);
  const fromDate = dmToDate(from);
  const toDate   = dmToDate(to);
  if (fromDate.getMonth() === toDate.getMonth()) {
    return `${fromDate.getDate()}–${toDate.getDate()} ${MONTHS_ES[fromDate.getMonth()]}`;
  }
  return `${dmToLabel(from)} – ${dmToLabel(to)}`;
}

export function countdownLabel(dm: number): string {
  const n = daysUntil(dm);
  if (n < 0)  return 'En curso';
  if (n === 0) return '¡Hoy!';
  if (n === 1) return 'Mañana';
  return `${n} días`;
}

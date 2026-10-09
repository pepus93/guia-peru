import type { BaseActivity } from './types';
import { mapsUrl } from '$lib/utils/maps';
import { dmToDateRange } from '$lib/utils/dates';

// Clase base genérica para cualquier elemento anclado a un día del viaje.
// ActivityModel y ExcursionModel la extienden con <T extends BaseActivity>.
export class BaseDayModel<T extends BaseActivity> {
  constructor(readonly data: T) {}

  get meetUrl() { const q = this.data.meetQuery ?? this.data.meet; return q ? mapsUrl(q) : ''; }
  get endUrl()  { const q = this.data.endQuery  ?? this.data.end;  return q ? mapsUrl(q) : ''; }

  get timeLabel() {
    return [this.data.time, this.data.duration].filter(Boolean).join(' · ');
  }

  // "12 oct" o "12–15 oct" si es un plan multi-día
  get dateLabel() {
    return dmToDateRange(this.data.dayDm, this.data.endDayDm);
  }
}

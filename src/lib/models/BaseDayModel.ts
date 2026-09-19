import type { BaseActivity } from './types';
import { mapsUrl } from '$lib/utils/maps';
import { dmToDateRange } from '$lib/utils/dates';

// Clase base genérica para cualquier elemento anclado a un día del viaje.
// ActivityModel y ExcursionModel la extienden con <T extends BaseActivity>.
export class BaseDayModel<T extends BaseActivity> {
  constructor(readonly data: T) {}

  get meetUrl()  { return this.data.meetQuery ? mapsUrl(this.data.meetQuery) : ''; }
  get endUrl()   { return this.data.endQuery  ? mapsUrl(this.data.endQuery)  : ''; }

  get timeLabel() {
    return [this.data.time, this.data.duration].filter(Boolean).join(' · ');
  }

  // "12 oct" o "12–15 oct" si es un plan multi-día
  get dateLabel() {
    return dmToDateRange(this.data.dayDm, this.data.endDayDm);
  }
}

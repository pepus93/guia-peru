import type { Accommodation } from './types';
import { mapsUrl } from '$lib/utils/maps';
import { dmToDate } from '$lib/utils/dates';

export class AccommodationModel {
  constructor(readonly data: Accommodation) {}

  get mapsUrl() { return mapsUrl(this.data.mapsQuery ?? this.data.name); }

  get nights() {
    const from = dmToDate(this.data.startDm);
    const to   = dmToDate(this.data.endDm);
    return Math.round((to.getTime() - from.getTime()) / 86_400_000);
  }
}

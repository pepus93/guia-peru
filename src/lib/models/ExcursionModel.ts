import type { Excursion } from './types';
import { BaseDayModel } from './BaseDayModel';

export class ExcursionModel extends BaseDayModel<Excursion> {
  // meetUrl, endUrl y timeLabel heredados de BaseDayModel

  get telHref() { return `tel:${this.data.providerTel}`; }

  get waHref() {
    const num = this.data.providerTel.replace(/\D/g, '');
    return `https://wa.me/${num}`;
  }
}

import type { PlurkDto } from './plurk.dto';

export class PlurksDto {
  plurks: PlurkDto[];

  constructor() {
    this.plurks = [];
  }
}

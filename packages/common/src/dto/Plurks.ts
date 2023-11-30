import BaseDto from './Base';
import type { PlurkDto } from './Plurk';

export class PlurksDto extends BaseDto {
  plurks!: PlurkDto[];

  constructor(args: Record<string, unknown> = {}) {
    super({
      plurks: [],
      ...args,
    });
  }
}
export default PlurksDto;

import { BaseDto } from './base.dto';
import type { PlurkDto } from './plurk.dto';

export class PlurksDto extends BaseDto {
  plurks!: PlurkDto[];

  constructor(args: Record<string, unknown> = {}) {
    super({
      plurks: [],
      ...args,
    });
  }
}

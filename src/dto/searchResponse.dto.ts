import { BaseDto } from './base.dto';
import type { PlurkDto } from './plurk.dto';

export class SearchResponseDto extends BaseDto {
  plurks!: PlurkDto[];
  counts!: number;
  firstTimestamp?: Date;
  firstTimestampStr?: string;
  lastTimestamp?: Date;
  lastTimestampStr?: string;
  next?: string;

  constructor(args: Record<string, unknown> = {}) {
    super({
      plurks: [],
      counts: 0,
      ...args,
    });
  }
}

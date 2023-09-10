import BaseDto from './base.dto';
import type PlurkDto from './Plurk.dto';

export class SearchResponseDto extends BaseDto {
  request: any;
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
};
export default SearchResponseDto;

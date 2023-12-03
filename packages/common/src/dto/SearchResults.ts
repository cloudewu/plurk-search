import BaseDto from './Base';
import type PlurkDto from './Plurk';

export class SearchResultsDto extends BaseDto {
  request?: Record<string, unknown>;
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
export default SearchResultsDto;

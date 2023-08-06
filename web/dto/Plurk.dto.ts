import { BaseDto } from './base.dto';
import type { PlurkType } from './PlurkType.enum';
import type { PlurkUserDto } from './PlurkUser.dto';

export class PlurkDto extends BaseDto {
  id?: number;
  link: string;
  ownerId?: number;
  owner?: PlurkUserDto;
  plurkType?: PlurkType;
  content?: string;
  content_html?: string;
  postTime?: Date;
  lastEditTime?: Date;
}

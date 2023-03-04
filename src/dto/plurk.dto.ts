import { BaseDto } from './base.dto';
import type { PlurkType } from './plurk-type.enum';
import type { PlurkUserDto } from './plurk-user.dto';

export class PlurkDto extends BaseDto {
  id?: number;
  ownerId?: number;
  owner?: PlurkUserDto;
  plurkType?: PlurkType;
  content?: string;
  content_html?: string;
}

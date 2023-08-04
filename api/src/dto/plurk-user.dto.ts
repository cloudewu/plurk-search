import { BaseDto } from './base.dto';

export class PlurkUserDto extends BaseDto {
  id?: number;
  nickName?: string;
  displayName?: string;
}

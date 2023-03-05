import { BaseDto } from './base.dto';

export class AuthRequestDto extends BaseDto {
  token!: string;
  code!: string;
}

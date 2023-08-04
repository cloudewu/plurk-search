import { BaseDto } from './base.dto';

export class AuthDetail extends BaseDto {
  token!: string;
  secret!: string;
}

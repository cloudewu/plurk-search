import { BaseDto } from './base.dto';

export class AuthResponseDto extends BaseDto {
  authLink!: string;
  token!: string;
}

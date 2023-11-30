import BaseDto from '@plurk-search/common/dto/Base';

export class AuthDetail extends BaseDto {
  token!: string;
  secret!: string;
}

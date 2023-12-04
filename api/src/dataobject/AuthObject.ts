import BaseDto from '@plurk-search/common/dto/Base';

export class AuthObject extends BaseDto {
  token!: string;
  secret!: string;
}

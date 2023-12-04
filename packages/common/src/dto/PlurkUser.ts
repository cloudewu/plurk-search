import BaseDto from './Base';

export class PlurkUserDto extends BaseDto {
  id?: number;
  nickName?: string;
  displayName?: string;
};
export default PlurkUserDto;

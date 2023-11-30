import type PlurkType from '@plurk-search/common/enum/PlurkType';
import BaseDto from './Base';
import type PlurkUserDto from './PlurkUser';

export class PlurkDto extends BaseDto {
  id?: number;
  link!: string;
  ownerId?: number;
  owner?: PlurkUserDto;
  plurkType?: PlurkType;
  content?: string;
  contentHtml?: string;
  postTime?: Date;
  lastEditTime?: Date;
};
export default PlurkDto;

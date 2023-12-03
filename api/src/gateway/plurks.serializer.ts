import { Injectable } from '@nestjs/common';
import { PlurkDto } from '@plurk-search/common/dto/Plurk';
import { PlurkUserDto } from '@plurk-search/common/dto/PlurkUser';
import { PlurkType } from '@plurk-search/common/enum/PlurkType';
import { isNullish } from '~api/common/util';

@Injectable()
export class PlurksSerializer {
  PLURK_BASE_URL = 'https://www.plurk.com/p/';

  public serialize(apiResponse: any): PlurkDto[] {
    const userMap: Map<number, PlurkUserDto> = this.serializePlurkUsers(apiResponse.plurk_users);
    const plurks: PlurkDto[] = this.serializePlurks(apiResponse.plurks, userMap);
    return plurks;
  }

  private serializePlurkUsers(userMap: any): Map<number, PlurkUserDto> {
    const userDtoMap = new Map<number, PlurkUserDto>();
    for (const userIdStr in userMap) {
      const userId = Number.parseInt(userIdStr);
      const user = this.serializePlurkUser(userId, userMap[userIdStr]);
      if (user !== null) {
        userDtoMap.set(userId, user);
      }
    }
    return userDtoMap;
  }

  private serializePlurks(plurkMap: any, userMap: Map<number, PlurkUserDto>): PlurkDto[] {
    const plurks = [];
    for (const plurkIndex in plurkMap) {
      const plurk = this.serializePlurk(plurkMap[plurkIndex]);
      if (plurk === null) continue;

      if (plurk.ownerId !== undefined) {
        plurk.owner = userMap.get(plurk.ownerId);
      }
      plurks.push(plurk);
    }
    return plurks;
  }

  private serializePlurk(plurkObj: any): PlurkDto | null {
    if (isNullish(plurkObj)) {
      return null;
    }

    const encodedPlurkId: undefined | string = plurkObj.plurk_id?.toString(36);
    const plurkLink = encodedPlurkId != null ? this.PLURK_BASE_URL + encodedPlurkId : null;

    const plurk = new PlurkDto({
      id: plurkObj.plurk_id,
      link: plurkLink,
      ownerId: plurkObj.owner_id,
      plurkType: this.serializePlurkType(plurkObj.plurk_type),
      contentHtml: plurkObj.content,
      content: plurkObj.content_raw,
      postTime: isNullish(plurkObj.posted) ? null : new Date(plurkObj.posted),
      lastEditTime: isNullish(plurkObj.last_edited) ? null : new Date(plurkObj.last_edited),
    });
    return plurk;
  }

  private serializePlurkUser(userId: number, userObj: any): PlurkUserDto | null {
    if (isNullish(userObj)) {
      return null;
    }

    const user = new PlurkUserDto({
      id: userObj.id,
      nickName: userObj.nick_name,
      displayName: userObj.display_name,
    });
    return user;
  }

  private serializePlurkType(type: string): PlurkType {
    const typeId = Number.parseInt(type);

    switch (typeId) {
      case 0:
        return PlurkType.PUBLIC;
      case 1:
        return PlurkType.PRIVATE;
      case 4:
        return PlurkType.ANONYMOUS;
      default:
        return PlurkType.UNKNOWN;
    }
  }
}

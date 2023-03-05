import { Injectable } from '@nestjs/common';
import { isNullish } from '../common/util';
import { PlurkType } from '../dto/plurk-type.enum';
import { PlurkUserDto } from '../dto/plurk-user.dto';
import { PlurkDto } from '../dto/plurk.dto';
import { PlurksDto } from '../dto/plurks.dto';

@Injectable()
export class PlurksSerializer {
  public serialize(apiResponse: any) {
    const userMap: Map<number, PlurkUserDto> = this.serializePlurkUsers(apiResponse.plurk_users);
    const plurks: PlurksDto = this.serializePlurks(apiResponse.plurks, userMap);
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

  private serializePlurks(plurkMap: any, userMap: Map<number, PlurkUserDto>): PlurksDto {
    const plurks = new PlurksDto();
    for (const plurkIndex in plurkMap) {
      const plurk = this.serializePlurk(plurkMap[plurkIndex]);
      if (plurk === null) continue;

      if (plurk.ownerId !== undefined) {
        plurk.owner = userMap.get(plurk.ownerId);
      }
      plurks.plurks.push(plurk);
    }
    return plurks;
  }

  private serializePlurk(plurkObj: any): PlurkDto | null {
    if (isNullish(plurkObj)) {
      return null;
    }

    const plurk = new PlurkDto({
      id: plurkObj.plurk_id,
      ownerId: plurkObj.owner_id,
      plurkType: this.serializePlurkType(plurkObj.plurk_type),
      content_html: plurkObj.content,
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

  private serializePlurkType(type: string) {
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

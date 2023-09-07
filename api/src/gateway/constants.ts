import { PlurkType } from '../dto/plurk-type.enum';
import { PlurkUserDto } from '../dto/plurk-user.dto';
import { PlurkDto } from '../dto/plurk.dto';
import { PlurksDto } from '../dto/plurks.dto';

export const mockApiResponse = {
  plurks: [
    {
      owner_id: 99999,
      plurk_id: 1000000000,
      user_id: 99999,
      posted: '2023-03-05T00:00:00.000Z',
      replurker_id: 10000000,
      qualifier: 'whispers',
      content: 'Content <br/> Content',
      content_raw: 'Content \n Content',
      lang: 'tr_ch',
      response_count: 30,
      limited_to: null,
      excluded: null,
      no_comments: 0,
      plurk_type: 4,
      is_unread: 1,
      last_edited: null,
      porn: false,
      publish_to_followers: false,
      with_poll: false,
      coins: 0,
      has_gift: false,
      replurked: false,
      replurkers_count: 700,
      replurkable: true,
      favorite_count: 300,
      anonymous: true,
      responded: 0,
      favorite: false,
      bookmark: false,
      mentioned: 0,
      qualifier_translated: '偷偷說',
    },
    {
      owner_id: 1000000,
      plurk_id: 1500000000,
      user_id: 9000000,
      posted: '2023-03-04T00:00:00.000Z',
      replurker_id: null,
      qualifier: ':',
      content: 'content <br/> content',
      content_raw: 'content \n content',
      lang: 'tr_ch',
      response_count: 5,
      limited_to: null,
      excluded: null,
      no_comments: 1,
      plurk_type: 0,
      is_unread: 0,
      last_edited: null,
      porn: false,
      publish_to_followers: true,
      with_poll: false,
      coins: 0,
      has_gift: false,
      replurked: false,
      replurkers_count: 0,
      replurkable: false,
      favorite_count: 0,
      anonymous: false,
      responded: 0,
      favorite: false,
      bookmark: false,
      mentioned: 0,
      qualifier_translated: '',
    },
  ],
  plurk_users: {
    99999: {
      id: 99999,
      nick_name: 'anonymous',
      display_name: 'ಠ_ಠ',
      avatar: 4626258,
      premium: false,
      date_of_birth: null,
      status: 'active',
      name_color: 'AE00B0',
      bday_privacy: 0,
      birthday: {
        year: null,
        month: null,
        day: null,
      },
      _version: 'mini',
    },
    1000000: {
      id: 1000000,
      nick_name: 'plurk id',
      display_name: 'display name',
      avatar: 60000000,
      premium: true,
      date_of_birth: null,
      status: 'active',
      name_color: 'BA8FBE',
      bday_privacy: 0,
      birthday: {
        year: null,
        month: null,
        day: null,
      },
      _version: 'mini',
    },
  },
};

export const expectedSerializedResult = new PlurksDto({
  plurks: [
    new PlurkDto({
      id: 1000000000,
      link: 'https://www.plurk.com/p/gjdgxs',
      ownerId: 99999,
      owner: new PlurkUserDto({
        id: 99999,
        nickName: 'anonymous',
        displayName: 'ಠ_ಠ',
      }),
      plurkType: PlurkType.ANONYMOUS,
      content: 'Content \n Content',
      contentHtml: 'Content <br/> Content',
      postTime: new Date('2023-03-05T00:00:00.000Z'),
      lastEditTime: null,
    }),
    new PlurkDto({
      id: 1500000000,
      link: 'https://www.plurk.com/p/ot27eo',
      ownerId: 1000000,
      owner: new PlurkUserDto({
        id: 1000000,
        nickName: 'plurk id',
        displayName: 'display name',
      }),
      plurkType: PlurkType.PUBLIC,
      content: 'content \n content',
      contentHtml: 'content <br/> content',
      postTime: new Date('2023-03-04T00:00:00.000Z'),
      lastEditTime: null,
    }),
  ],
});

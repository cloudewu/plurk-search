import { maskJSON2 } from 'maskdata';

export function maskSecrets<T extends Record<string, unknown>>(obj: T): T {
  const fileredObj = maskJSON2(obj, {
    passwordMaskOptions: {
      maskWith: '*',
      maxMaskedCharacters: 5,
    },
    passwordFields: [
      // auth
      'token',
      'secret',
      // plurk
      'plurks[*].content',
      'plurks[*].content_raw',
      // user info - masking all fields for now
      'plurk_users.*',
      // 'plurk_users.*.nick_name',
      // 'plurk_users.*.display_name',
    ],
  });
  return fileredObj;
};

export default maskSecrets;

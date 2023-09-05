'use server';

import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

type CookieSetting = Omit<ResponseCookie, 'name'> & { value: string };

/**
 * Add all keys & values from `added` objects, and remove all keys in `removed`.
 * If a key is given in both `added` and `removed`, adding is performed before removing.
 *
 * Note: this method can only be used in route handlers and server actions.
 * @param added - the key-value or key-option pairs that should be added into cookies.
 * @param removed - an array of key names that should be removed from cookies
 * @example updateCookies({ addKey: addValue })
 * @example updateCookies({ addKey: { value: addValue, secure: true } })
 * @example updateCookies({ addKey: addValue }, [removedKey])
 * @example updateCookies({}, [removedKey])
 */
export default async function updateCookies(
  added: Record<string, string | CookieSetting > = {},
  removed: string[] = [],
) {
  const cookie = cookies();

  for (const key in added) {
    const value = added[key];
    if (typeof value === 'string') {
      cookie.set(key, value);
    } else {
      const { value: cookieValue , ...options } = value;
      cookie.set(key, cookieValue, options);
    }
  }
  for (const key of removed) {
    cookie.delete(key);
  }
};

'use server';

import { cookies } from 'next/headers';
import { COOKIE_AUTH_TOKEN, COOKIE_TOKEN } from '../consts/const';

export default async function removeTokenFromCookies() {
  const cookie = cookies();
  cookie.delete(COOKIE_TOKEN);
  cookie.delete(COOKIE_AUTH_TOKEN);
}

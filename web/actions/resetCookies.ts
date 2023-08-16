'use server';

import { cookies } from 'next/headers';
import { COOKIE_LOGIN_TOKEN, COOKIE_TOKEN } from '../consts/const';

export default async function resetCookies() {
  const cookie = cookies();
  cookie.delete(COOKIE_TOKEN);
  cookie.delete(COOKIE_LOGIN_TOKEN);
}

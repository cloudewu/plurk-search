'use server';

import { COOKIE_AUTH_TOKEN, COOKIE_TOKEN } from '@/consts/const';
import { cookies } from 'next/headers';

export default async function addTokenToCookies(token: string, isTemp?: boolean) {
  const cookie = cookies();
  cookie.set(isTemp ? COOKIE_AUTH_TOKEN : COOKIE_TOKEN, token);
  if (!isTemp) {
    cookie.delete(COOKIE_AUTH_TOKEN);
  }
}

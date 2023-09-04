'use server';

import { COOKIE_TOKEN } from '@/consts/const';
import { cookies } from 'next/headers';

export default async function addTokenToCookies(token: string) {
  const cookie = cookies();
  const sevenDays = 7 * 24 * 60 * 60;
  cookie.set(COOKIE_TOKEN, token, { secure: true, maxAge: sevenDays });
};

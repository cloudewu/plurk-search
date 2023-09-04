'use server';

import { COOKIE_TOKEN } from '@/consts/const';
import { cookies } from 'next/headers';

export default async function removeTokenFromCookies() {
  const cookie = cookies();
  cookie.delete(COOKIE_TOKEN);
}

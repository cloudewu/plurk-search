import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_TOKEN } from '~web/constants';

export default function HomePage() {
  const hasToken = cookies().has(COOKIE_TOKEN);

  if (hasToken) {
    redirect('/search');
  } else {
    redirect('/auth');
  }
};

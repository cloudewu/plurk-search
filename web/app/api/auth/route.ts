import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_AUTH_TOKEN } from '../../../consts/const';

const API = process.env.API ?? '';

export async function GET() {
  const res = await fetch(`${API}/auth`);
  const data = await res.json();
  // const data = await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(mockGetAuthResponse)
  //   }, 1000);
  // });

  console.log(data);

  return NextResponse.json(data);
};

export async function POST(request: NextRequest) {
  const authToken = request.cookies.get(COOKIE_AUTH_TOKEN);
  const body = await request.text();
  if (authToken == null) {
    throw Error('invalid token');
  }

  const res = await fetch(`${API}/auth`, {
    method: 'POST',
    headers: {
      Authorization: authToken.value,
      'Content-Type': 'application/json',
    },
    body,
    // @ts-expect-error: https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1483
    duplex: 'half',
  });
  const data = await res.text();
  // const data = await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('token awerfawefawerfaw')
  //   }, 1000);
  // });

  console.log(data);

  return NextResponse.json(data);
};

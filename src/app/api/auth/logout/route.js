import { NextResponse } from 'next/server';

export const GET = async (request) => {
  const response = NextResponse.redirect(new URL('/login', request.url));

  response.cookies.set('accessToken', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  response.cookies.set('refreshToken', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  response.headers.set('Cache-Control', 'no-store, max-age=0');

  return response;
};

import config from '@/envConfig';
import jwt from 'jsonwebtoken';
import { SignJWT } from 'jose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';



export function generateAccessToken(user) {
  return jwt.sign(user, config.JWT_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(user) {
  const secret = new TextEncoder().encode(config.REFRESH_TOKEN_SECRET);
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyRefreshToken(token) {
  const secret = new TextEncoder().encode(config.REFRESH_TOKEN_SECRET);
  return jwtVerify(token, secret);
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

export function setCookie(name, value, options = {}) {
  const stringValue = typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);

  const cookieOptions = {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? process.env.NODE_ENV === 'production',
    sameSite: options.sameSite ?? 'strict',
    path: options.path ?? '/',
    maxAge: options.maxAge,
  };
  cookies().set(name, stringValue, cookieOptions);
}

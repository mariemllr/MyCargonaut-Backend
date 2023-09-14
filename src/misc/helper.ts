import { hash } from 'bcrypt';
import { ROUNDS } from './constants';
import { JwtService } from '@nestjs/jwt';

export function getPayloadFromToken(token: string): { [key: string]: string } {
  return JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
  );
}

export function getEmailFromToken(token: string): string {
  return getPayloadFromToken(token).Email;
}

export function getEmailFromCookie(cookie: string): string {
  return getPayloadFromToken(getTokenFromCookie(cookie)).email;
}

export function getTokenFromCookie(cookie: string): string | null {
  return (
    cookie
      .split('; ')
      .find((cookie) => cookie.split('=')[0] === 'token')
      .split('=')[1] ?? null
  );
}

export async function hashUserPassword(password: string): Promise<string> {
  return hash(password, ROUNDS);
}

export async function generateToken(email: string) {
  return new JwtService().sign({ email });
}

import { join } from 'path';

export const ROUNDS = 13 as const;

export const PASSWORD_OPTIONS = {
  minLength: 8,
  minNumbers: 1,
  minLowercase: 0,
  minUppercase: 0,
  minSymbols: 0,
} as const;

export const MAX_USER_IMAGE_FILE_SIZE = 5_000_000;
export const USER_IMAGE_LOCATION = join('public', 'userImages');

export enum Status {
  statusDone,
  statusCollected,
  statusEnRoute,
  statusPending
}
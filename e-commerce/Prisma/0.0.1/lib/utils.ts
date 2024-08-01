import { twMerge } from 'tailwind-merge';
import { cache as reactCache } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { unstable_cache as nextCache } from 'next/cache';

import { CURRENCY_FORMATTER, NUMBER_FORMATTER } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export async function isValidPassword(
  password: string,
  hashedPassword: string
) {
  return (await hashPassword(password)) === hashedPassword;
}

async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    'SHA-512',
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString('base64');
}

export function cache<T extends (...args: any[]) => Promise<any>>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}

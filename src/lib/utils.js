import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function dateToISOLikeButLocal(date) {
  const offset = date.getTimezoneOffset();
  const dateWithOffset = new Date(date.getTime() - (offset * 60 * 1000));
  return dateWithOffset.toISOString().split('T')[0];
}
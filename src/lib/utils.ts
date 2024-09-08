import { sendGAEvent } from '@next/third-parties/google';
import { Extras } from '@sentry/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sendEvent(event: string, extras?: Extras) {
  sendGAEvent('event', event, {
    ...extras,
  });
}

export function isBrowserSupported() {
  return (
    typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  );
}

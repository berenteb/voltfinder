import { sendGAEvent } from '@next/third-parties/google';
import { type ClassValue, clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sendEvent(event: string, extras?: Record<string, any>) {
  sendGAEvent('event', event, {
    ...extras,
  });
}

export function isBrowserSupported() {
  return (
    typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  );
}

export function useCopyButtonBehavior(text: string) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const to = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(to);
    }
  }, [copied]);

  return { copied, onCopy };
}

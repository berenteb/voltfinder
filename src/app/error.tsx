'use client';

import { useEffect } from 'react';

import { ErrorScreen } from '@/components/error-screen';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <ErrorScreen error={error} onReset={reset} />;
}

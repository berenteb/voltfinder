import { TbExclamationCircle } from 'react-icons/tb';

import { Button } from '@/components/button';

interface ErrorScreenProps {
  error?: Error | string;
  onReset?: () => void;
}

export function ErrorScreen({ error, onReset }: ErrorScreenProps) {
  return (
    <div className='flex items-center justify-center gap-5 bg-slate-900 text-red-500 h-full flex-col'>
      <TbExclamationCircle size={100} />
      <h1 className='text-5xl'>Hiba történt :(</h1>
      {error && <p className='text-white/50 line-clamp-5'>{error instanceof Error ? error.message : error}</p>}
      {onReset && <Button onClick={onReset}>Újra</Button>}
    </div>
  );
}

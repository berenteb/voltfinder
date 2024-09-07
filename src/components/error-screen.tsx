import { TbExclamationCircle, TbReload } from 'react-icons/tb';

import { Button } from '@/components/button';

interface ErrorScreenProps {
  onReset?: () => void;
}

export function ErrorScreen({ onReset }: ErrorScreenProps) {
  return (
    <div className='flex items-center justify-center gap-5 bg-slate-900 text-red-500 h-full flex-col'>
      <TbExclamationCircle size={100} />
      <h1 className='text-5xl'>Hiba történt :(</h1>
      <p className='text-slate-500'>
        A hibáról értesítettük a fejlesztőket. Kérlek nézz vissza később, vagy próbáld újra!
      </p>
      {onReset && (
        <Button onClick={onReset}>
          <TbReload /> Újra
        </Button>
      )}
    </div>
  );
}

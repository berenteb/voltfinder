import { useMemo } from 'react';
import { TbBolt } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import { MobilitiData } from '@/types/mobiliti.types';

interface ChargerMarkerProps {
  data: MobilitiData;
  onClick: () => void;
}

export function ChargerMarker({ data, onClick }: ChargerMarkerProps) {
  const powerColor = useMemo(() => (data.evses ? Math.max(...data.evses.map((e) => e.power ?? 0)) : 0), [data.evses]);
  return (
    <div className='relative pointer-events-auto z-0'>
      <button
        onClick={onClick}
        className={cn(
          'translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center text-green-200 text-sm font-bold bg-green-500 border-2 border-green-200 shadow-md',
          {
            'bg-yellow-500 text-yellow-200 border-yellow-200': powerColor >= 50000,
            'bg-blue-500 text-blue-200 border-blue-200': powerColor >= 100000,
          }
        )}
      >
        <TbBolt size={20} />
      </button>
    </div>
  );
}

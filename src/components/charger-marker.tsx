import { TbBolt, TbHeartFilled } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import { ChargerViewModel } from '@/types/charger-view-model.types';

interface ChargerMarkerProps {
  data: ChargerViewModel;
  onClick: () => void;
}

export function ChargerMarker({ data, onClick }: ChargerMarkerProps) {
  return (
    <div className='relative pointer-events-auto z-0'>
      <button
        onClick={onClick}
        className={cn(
          'translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center text-green-200 text-sm font-bold bg-green-500 border-2 border-green-200 shadow-md',
          {
            'bg-yellow-500 text-yellow-200 border-yellow-200': data.maxPowerKw >= 50,
            'bg-blue-500 text-blue-200 border-blue-200': data.maxPowerKw >= 100,
          }
        )}
      >
        <TbBolt size={20} />
      </button>
      {data.isFavorite && (
        <div className='absolute top-3 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold'>
          <TbHeartFilled size={12} />
        </div>
      )}
    </div>
  );
}

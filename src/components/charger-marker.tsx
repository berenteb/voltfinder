import { useMemo } from 'react';
import { TbBolt, TbHeartFilled } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import { ChargerViewModel } from '@/types/charger-view-model.types';

interface ChargerMarkerProps {
  data: ChargerViewModel;
  onClick: () => void;
  focused?: boolean;
}

export function ChargerMarker({ data, onClick, focused }: ChargerMarkerProps) {
  const status = useMemo(() => getChargerStatus(data), [data]);
  return (
    <button onClick={onClick} className='relative pointer-events-auto z-0'>
      {focused && (
        <div
          className={cn('absolute top-1/2 w-full h-full rounded-full pulse-dot bg-green-500', {
            'bg-yellow-500': data.maxPowerKw >= 50,
            'bg-blue-500': data.maxPowerKw >= 100,
          })}
        />
      )}

      <div
        className={cn(
          'translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center text-green-200 text-sm font-bold bg-green-500 border-2 border-green-200 shadow-md',
          {
            'bg-yellow-500 text-yellow-200 border-yellow-200': data.maxPowerKw >= 50,
            'bg-blue-500 text-blue-200 border-blue-200': data.maxPowerKw >= 100,
          }
        )}
      >
        <TbBolt size={20} />
      </div>
      {data.isFavorite && (
        <div className='absolute top-3 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold'>
          <TbHeartFilled size={12} />
        </div>
      )}
      <div
        className={cn(
          'absolute top-3 -left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white',
          {
            'bg-green-500': status === ChargerStatus.Free,
            'bg-yellow-500': status === ChargerStatus.Occupied,
            'bg-red-500': status === ChargerStatus.Full,
            'bg-gray-500': status === ChargerStatus.Unknown,
          }
        )}
      >
        {data.chargePoints.length ?? '?'}
      </div>
    </button>
  );
}

enum ChargerStatus {
  Free = 'free',
  Occupied = 'occupied',
  Full = 'full',
  Unknown = 'unknown',
}

function getChargerStatus(charger: ChargerViewModel): ChargerStatus {
  const chargePoints = charger.chargePoints.filter((cp) => cp.status !== 'UNKNOWN');
  if (chargePoints.length === 0) return ChargerStatus.Unknown;

  if (chargePoints.every((cp) => cp.status === 'AVAILABLE')) {
    return ChargerStatus.Free;
  }

  if (chargePoints.every((cp) => cp.status === 'CHARGING')) {
    return ChargerStatus.Full;
  }

  if (chargePoints.some((cp) => cp.status === 'CHARGING')) {
    return ChargerStatus.Occupied;
  }

  return ChargerStatus.Unknown;
}

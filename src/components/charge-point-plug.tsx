import { PlugIcon } from '@/components/icons/plug-icon';
import { StatusMap } from '@/lib/charger.utils';
import { cn } from '@/lib/utils';
import { ChargePointEvse } from '@/types/charge-point.types';
import { Evse } from '@/types/mobiliti.types';

interface ChargePointPlugProps {
  evse: Evse;
  evseDetails: ChargePointEvse | undefined;
}

export function ChargePointPlug({ evse, evseDetails }: ChargePointPlugProps) {
  return (
    <div key={evse.evseId} className='flex items-center justify-between border border-slate-200 p-1 rounded-lg'>
      <div className='flex items-center space-x-2'>
        <div
          className={cn('items-center flex flex-col bg-slate-500 rounded-md p-2 text-white', {
            'bg-green-500': evseDetails?.status === 'AVAILABLE',
            'bg-blue-500': evseDetails?.status === 'CHARGING',
          })}
        >
          {evse.plugType && <PlugIcon fill='white' height={30} width={30} type={evse.plugType} />}
        </div>
        <div>
          <p>{evse.plugType}</p>
          <p className='text-slate-500 text-xs'>{StatusMap[evseDetails?.status ?? ''] ?? evseDetails?.status}</p>
        </div>
      </div>
      <div className='items-end flex flex-col'>
        <p>{evse.power ? evse.power / 1000 : '?'} kW</p>
        <p className='text-slate-500 text-xs'>{evse.currentType}</p>
      </div>
    </div>
  );
}

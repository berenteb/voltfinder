import { PlugIcon } from '@/components/icons/plug-icon';
import { PlugTypeLabels, StatusMap } from '@/lib/charger.utils';
import { cn } from '@/lib/utils';
import { ConnectorViewModel } from '@/types/charger-view-model.types';

interface ChargePointPlugProps {
  plug: ConnectorViewModel;
  status: string;
}

export function ChargePointConnector({ plug, status }: ChargePointPlugProps) {
  return (
    <div className='flex items-center justify-between border border-slate-200 p-1 rounded-lg bg-white'>
      <div className='flex items-center space-x-2'>
        <div
          className={cn('items-center flex flex-col bg-slate-500 rounded-md p-2 text-white', {
            'bg-green-500': status === 'AVAILABLE',
            'bg-blue-500': status === 'CHARGING',
          })}
        >
          {plug.plugType && <PlugIcon fill='white' height={30} width={30} type={plug.plugType} />}
        </div>
        <div>
          <p>{PlugTypeLabels[plug.plugType]}</p>
          <p className='text-slate-500 text-xs'>{StatusMap[status] ?? status}</p>
        </div>
      </div>
      <div className='items-end flex flex-col'>
        <p>{plug.power} kW</p>
        <p className='text-slate-500 text-xs'>{plug.currentType}</p>
      </div>
    </div>
  );
}

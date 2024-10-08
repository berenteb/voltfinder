import { Fragment } from 'react';

import { ConnectorViewModel } from '@/common/types/charger-view-model.types';
import { DcsPriceComponent, DcsPriceElement, DcsPriceItem } from '@/common/types/dcs-price.types';
import { PlugIcon } from '@/components/icons/plug-icon';
import { Skeleton } from '@/components/skeleton';
import { PlugTypeLabels, StatusMap } from '@/lib/charger.utils';
import { cn } from '@/lib/utils';

interface ChargePointPlugProps {
  plug: ConnectorViewModel;
  price?: DcsPriceItem;
  priceLoading?: boolean;
  status: string;
}

export function ChargePointConnector({ plug, status, price, priceLoading }: ChargePointPlugProps) {
  return (
    <div className='bg-slate-200 rounded-lg'>
      <div className='flex items-center justify-between border-2 border-slate-200 p-1 rounded-lg bg-white w-60'>
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
      {priceLoading && !price && (
        <div className='p-1 space-y-0.5'>
          <Skeleton />
          <Skeleton />
        </div>
      )}
      {price && (
        <div className='p-1 rounded-b-lg'>
          {price.elements.map((element, index) => (
            //eslint-disable-next-line react/no-array-index-key
            <Fragment key={index}>
              {index !== 0 && <hr className='border-slate-300 rounded-full' />}
              <PriceElement price={element} />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function PriceElement({ price }: { price: DcsPriceElement }) {
  return (
    <div>
      {price.price_components.map((component, index) => (
        //eslint-disable-next-line react/no-array-index-key
        <p key={index}>
          {component.price} Ft {getStepSizeLabel(component)}
        </p>
      ))}

      <p className='text-slate-500 text-xs'>
        {price.restrictions?.min_duration ? `Ennyi után: ${price.restrictions.min_duration / 60} perc - ` : ''}BMW
        Charging
      </p>
    </div>
  );
}

function getStepSizeLabel(component: DcsPriceComponent) {
  const labelBase = component.step_size === 1 ? '' : `${component.step_size} `;
  if (component.type === 'ENERGY') {
    return `/ ${labelBase}kWh`;
  } else if (component.type === 'TIME') {
    return `/ ${labelBase} perc`;
  } else if (component.type === 'FLAT') {
    return '/ alkalom';
  } else {
    return '';
  }
}

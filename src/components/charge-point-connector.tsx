import { Fragment } from 'react';

import { PlugIcon } from '@/components/icons/plug-icon';
import { PlugTypeLabels, StatusMap } from '@/lib/charger.utils';
import { cn } from '@/lib/utils';
import { ConnectorViewModel } from '@/types/charger-view-model.types';
import { DcsPriceComponent, DcsPriceElement, DcsPriceItem } from '@/types/dcs-price.types';

interface ChargePointPlugProps {
  plug: ConnectorViewModel;
  price?: DcsPriceItem;
  status: string;
}

export function ChargePointConnector({ plug, status, price }: ChargePointPlugProps) {
  return (
    <div className='bg-slate-200 rounded-lg'>
      <div className='flex items-center justify-between border-2 border-slate-200 p-1 rounded-lg bg-white'>
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
      {price && (
        <div className='p-1 rounded-b-lg'>
          {price.elements.map((element, index) => (
            <Fragment key={index}>
              {index !== 0 && <hr className='border-slate-300 rounded-full' />}
              <PriceElement key={index} price={element} />
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

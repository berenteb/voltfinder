import { ChargePointConnector } from '@/components/charge-point-connector';
import { ChargePointViewModel } from '@/types/charger-view-model.types';
import { DcsPriceItem } from '@/types/dcs-price.types';

interface ChargePointProps {
  index: number;
  data: ChargePointViewModel;
  prices: DcsPriceItem[];
}

export function ChargePoint({ data, index, prices }: ChargePointProps) {
  return (
    <div>
      <p>{index}. állás</p>
      <p className='text-slate-500 text-sm'>{data.evseId}</p>
      <div className='flex gap-1'>
        {data.connectors.map((connector) => (
          <ChargePointConnector
            key={connector.plugType}
            plug={connector}
            status={data.status}
            price={prices.find(
              (p) =>
                p.price_identifier.power_type === connector.currentType && p.price_identifier.power === connector.power
            )}
          />
        ))}
      </div>
    </div>
  );
}

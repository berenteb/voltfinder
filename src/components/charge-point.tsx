import { ChargePointViewModel } from '@/common/types/charger-view-model.types';
import { DcsPriceItem } from '@/common/types/dcs-price.types';
import { ChargePointConnector } from '@/components/charge-point-connector';

interface ChargePointProps {
  index: number;
  data: ChargePointViewModel;
  prices: DcsPriceItem[];
  priceLoading?: boolean;
}

export function ChargePoint({ data, index, prices, priceLoading }: ChargePointProps) {
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
            priceLoading={priceLoading}
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

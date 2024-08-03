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
    <div className='space-y-1'>
      <p>{index}. állás</p>
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
  );
}

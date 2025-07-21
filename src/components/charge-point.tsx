import { ChargePointViewModel } from '@/common/types/charger-view-model.types';
import { ChargePointConnector } from '@/components/charge-point-connector';

interface ChargePointProps {
  index: number;
  data: ChargePointViewModel;
}

export function ChargePoint({ data, index }: ChargePointProps) {
  return (
    <div>
      <p>{index}. állás</p>
      <p className='text-slate-500 text-sm'>{data.evseId}</p>
      <div className='flex gap-1'>
        {data.connectors.map((connector) => (
          <ChargePointConnector key={connector.plugType} plug={connector} status={data.status} />
        ))}
      </div>
    </div>
  );
}

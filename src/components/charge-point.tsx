import { ChargePointConnector } from '@/components/charge-point-connector';
import { ChargePointViewModel } from '@/types/charger-view-model.types';

interface ChargePointProps {
  index: number;
  data: ChargePointViewModel;
}

export function ChargePoint({ data, index }: ChargePointProps) {
  return (
    <div>
      <p>{index}. állás</p>
      {data.connectors.map((connector) => (
        <ChargePointConnector key={connector.plugType} plug={connector} status={data.status} />
      ))}
    </div>
  );
}

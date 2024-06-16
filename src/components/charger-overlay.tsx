import { ChargePointPlug } from '@/components/charge-point-plug';
import { useChargePointDetails } from '@/hooks/use-charge-point-details';
import { MobilitiData } from '@/types/mobiliti.types';

interface ChargerOverlayProps {
  data: MobilitiData;
}

export function ChargerOverlay({ data }: ChargerOverlayProps) {
  const chargePointDetails = useChargePointDetails(
    data.ocpi?.stationId?.countryCode ?? 'HU',
    data.ocpi?.stationId?.partyId ?? '',
    data.ocpi?.stationId?.locationId ?? ''
  );

  return (
    <div className='bg-white shadow-md rounded-md p-2 w-60 space-y-2'>
      <h2 className='font-bold'>{data.name}</h2>
      <p className='text-slate-500'>{data.address}</p>
      {data.evses?.map((evse) => (
        <ChargePointPlug
          key={evse.evseId}
          evse={evse}
          evseDetails={chargePointDetails?.data?.evses?.find((e) => e.evseId === evse.evseId)}
        />
      ))}
      <p className='italic text-slate-500'>{data.operator?.name ?? data.ocpi?.stationId?.partyId}</p>
    </div>
  );
}

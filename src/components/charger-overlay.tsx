import { useEffect, useState } from 'react';
import { TbCopy, TbCopyCheck } from 'react-icons/tb';

import { ChargePointPlug } from '@/components/charge-point-plug';
import { useChargePointDetails } from '@/hooks/use-charge-point-details';
import { MobilitiData } from '@/types/mobiliti.types';

interface ChargerOverlayProps {
  data: MobilitiData;
}

export function ChargerOverlay({ data }: ChargerOverlayProps) {
  const [copied, setCopied] = useState(false);
  const chargePointDetails = useChargePointDetails(
    data.ocpi?.stationId?.countryCode ?? 'HU',
    data.ocpi?.stationId?.partyId ?? '',
    data.ocpi?.stationId?.locationId ?? ''
  );

  const onAddressCopy = () => {
    if (!navigator.clipboard || !data.address || !data.city) return;
    navigator.clipboard.writeText(`${data.address}, ${data.city}`);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const to = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(to);
    }
  }, [copied]);

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
      {data.address && data.city && navigator.clipboard && (
        <button
          onClick={onAddressCopy}
          className='bg-blue-500 p-2 rounded-md flex space-x-1 text-white w-fit items-center'
        >
          {copied ? <TbCopyCheck size={20} /> : <TbCopy size={20} />}
          {copied ? 'Másolva' : 'Cím másolása'}
        </button>
      )}
    </div>
  );
}

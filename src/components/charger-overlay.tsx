import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TbCopy, TbCopyCheck, TbHeart, TbHeartFilled } from 'react-icons/tb';

import { Button } from '@/components/button';
import { ChargePointPlug } from '@/components/charge-point-plug';
import { useChargePointDetails } from '@/hooks/use-charge-point-details';
import { cn } from '@/lib/utils';
import { markAsFavorite, removeFromFavorites } from '@/services/storage.service';
import { ChargerViewModel } from '@/types/charger-view-model.types';

interface ChargerOverlayProps {
  data: ChargerViewModel;
}

export function ChargerOverlay({ data }: ChargerOverlayProps) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const chargePointDetails = useChargePointDetails(data.countryCode, data.partyId, data.locationId);

  const onAddressCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(data.fullAddress);
    setCopied(true);
  };

  const onFavoriteClick = () => {
    if (data.isFavorite) {
      removeFromFavorites(data.id);
    } else {
      markAsFavorite(data.id);
    }

    queryClient.setQueryData(['chargePoints'], (chargePoints: ChargerViewModel[] | undefined) =>
      chargePoints?.map((cp) => (cp.id === data.id ? { ...cp, isFavorite: !cp.isFavorite } : cp))
    );
  };

  useEffect(() => {
    if (copied) {
      const to = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(to);
    }
  }, [copied]);

  return (
    <div className='shadow-md rounded-xl p-2 w-60 space-y-2 bg-slate-100'>
      <h2 className='font-bold'>{data.name}</h2>
      <p className='text-slate-500'>{data.fullAddress}</p>
      {data.evses?.map((evse) => (
        <ChargePointPlug
          key={evse.evseId}
          evse={evse}
          evseDetails={chargePointDetails?.data?.evses?.find((e) => e.evseId === evse.evseId)}
        />
      ))}
      <p className='italic text-slate-500'>{data.operatorName}</p>
      <div className='flex space-x-2'>
        {navigator.clipboard && (
          <Button
            onClick={onAddressCopy}
            className='bg-blue-500 p-2 text-white w-fit hover:bg-blue-600 active:bg-blue-600 border-blue-100 flex-1'
          >
            {copied ? <TbCopyCheck size={20} /> : <TbCopy size={20} />}
            {copied ? 'Másolva' : 'Cím másolása'}
          </Button>
        )}
        <Button onClick={onFavoriteClick}>
          {data.isFavorite ? (
            <TbHeartFilled
              size={20}
              className={cn({
                'text-red-500': data.isFavorite,
              })}
            />
          ) : (
            <TbHeart size={20} />
          )}
        </Button>
      </div>
    </div>
  );
}

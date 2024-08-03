import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TbCopy, TbCopyCheck, TbCrosshair, TbHeart, TbHeartFilled } from 'react-icons/tb';

import { Button } from '@/components/button';
import { ChargePoint } from '@/components/charge-point';
import { usePrice } from '@/hooks/use-price';
import { cn } from '@/lib/utils';
import { markAsFavorite, removeFromFavorites } from '@/services/storage.service';
import { ChargerViewModel } from '@/types/charger-view-model.types';

interface ChargerOverlayProps {
  data: ChargerViewModel;
  onCenterClick: () => void;
}

export function ChargerOverlay({ data, onCenterClick }: ChargerOverlayProps) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const price = usePrice(data);

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
    <div className='absolute bottom-0 left-0 right-0 z-10 p-5 w-full'>
      <div className='shadow-md rounded-xl max-w-full w-fit mx-auto p-2 space-y-2 bg-slate-100'>
        <div className='flex justify-between'>
          <div>
            <h2 className='font-bold'>{data.name}</h2>
            <p className='text-slate-500'>{data.operatorName}</p>
          </div>
          <Button onClick={onCenterClick}>
            <TbCrosshair size={20} />
          </Button>
        </div>
        <div className='flex gap-4 overflow-auto -ml-2 -mr-2 px-2'>
          {data.chargePoints?.map((chargePoint, index) => (
            <ChargePoint
              index={index + 1}
              key={chargePoint.id}
              data={chargePoint}
              prices={price.data?.filter((p) => p.price_identifier.charge_point === chargePoint.id) ?? []}
            />
          ))}
        </div>
        <p className='italic text-slate-500'>{data.fullAddress}</p>
        <div className='flex justify-between gap-2'>
          {navigator.clipboard && (
            <Button
              onClick={onAddressCopy}
              className='bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 border-blue-100'
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
    </div>
  );
}

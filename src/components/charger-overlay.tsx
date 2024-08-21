import { sendGAEvent } from '@next/third-parties/google';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TbCopy, TbCopyCheck, TbCrosshair, TbHeart, TbHeartFilled } from 'react-icons/tb';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { Button } from '@/components/button';
import { ChargePoint } from '@/components/charge-point';
import { NotificationButton } from '@/components/notification-button';
import { usePrice } from '@/hooks/use-price';
import { cn } from '@/lib/utils';
import { markAsFavorite, removeFromFavorites } from '@/services/storage.service';

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
    sendGAEvent('event', 'address_copy');
  };

  const onFavoriteClick = () => {
    if (data.isFavorite) {
      sendGAEvent('event', 'remove_favorite');
      removeFromFavorites(data.id);
    } else {
      sendGAEvent('event', 'add_favorite');
      markAsFavorite(data.id);
    }

    queryClient.setQueryData(['chargePoints'], (chargePoints: ChargerViewModel[] | undefined) =>
      chargePoints?.map((cp) => (cp.id === data.id ? { ...cp, isFavorite: !cp.isFavorite } : cp))
    );
  };

  const handleCenterClick = () => {
    sendGAEvent('event', 'center_map', data.id);
    onCenterClick();
  };

  useEffect(() => {
    if (copied) {
      const to = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(to);
    }
  }, [copied]);

  return (
    <div className='absolute bottom-0 left-0 right-0 z-10 p-5 w-full pointer-events-none'>
      <div className='shadow-md rounded-xl max-w-full w-fit mx-auto p-2 space-y-2 bg-slate-100 pointer-events-auto'>
        <div className='flex justify-between'>
          <div>
            <h2 className='font-bold'>{data.name}</h2>
            <p className='text-slate-500'>{data.operatorName}</p>
          </div>
          <div className='flex gap-2 h-fit'>
            <NotificationButton hasNotificationTurnedOn={data.hasNotificationTurnedOn} stationId={data.id} />
            <Button onClick={handleCenterClick}>
              <TbCrosshair size={20} />
            </Button>
          </div>
        </div>
        <div className='flex gap-4 overflow-auto -ml-2 -mr-2 px-2'>
          {data.chargePoints?.map((chargePoint, index) => (
            <ChargePoint
              index={index + 1}
              key={chargePoint.id}
              data={chargePoint}
              prices={price.data?.filter((p) => p.price_identifier.charge_point === chargePoint.id) ?? []}
              priceLoading={price.isLoading}
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

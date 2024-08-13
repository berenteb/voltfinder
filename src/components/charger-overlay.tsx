import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  TbBell,
  TbBellFilled,
  TbBellZ,
  TbCopy,
  TbCopyCheck,
  TbCrosshair,
  TbHeart,
  TbHeartFilled,
  TbNotification,
  TbNotificationOff,
} from 'react-icons/tb';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { Button } from '@/components/button';
import { ChargePoint } from '@/components/charge-point';
import { usePrice } from '@/hooks/use-price';
import { useSubscribeToUpdates } from '@/hooks/use-subscribe-to-updates';
import { useSubscription } from '@/hooks/use-subscriptions';
import { useUnsubscribeFromUpdates } from '@/hooks/use-unsubscribe-from-updates';
import { cn } from '@/lib/utils';
import { markAsFavorite, removeFromFavorites } from '@/services/storage.service';

interface ChargerOverlayProps {
  data: ChargerViewModel;
  onCenterClick: () => void;
}

export function ChargerOverlay({ data, onCenterClick }: ChargerOverlayProps) {
  const subscription = useSubscription(data.id);
  const subscribeToUpdates = useSubscribeToUpdates();
  const unsubscribeFromUpdates = useUnsubscribeFromUpdates();
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

  const onSubscribe = () => {
    if (!subscription.isSuccess) return;
    if (subscription.data) {
      unsubscribeFromUpdates.mutate(data.id);
    } else {
      subscribeToUpdates.mutate(data.id);
    }
  };

  return (
    <div className='absolute bottom-0 left-0 right-0 z-10 p-5 w-full'>
      <div className='shadow-md rounded-xl max-w-full w-fit mx-auto p-2 space-y-2 bg-slate-100'>
        <div className='flex justify-between'>
          <div>
            <h2 className='font-bold'>{data.name}</h2>
            <p className='text-slate-500'>{data.operatorName}</p>
          </div>
          <div className='flex gap-2'>
            <Button className='beta-badge' disabled={!subscription.isSuccess} onClick={onSubscribe}>
              {subscription.data ? <TbBellFilled size={20} /> : <TbBellZ size={20} />}
            </Button>
            <Button onClick={onCenterClick}>
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

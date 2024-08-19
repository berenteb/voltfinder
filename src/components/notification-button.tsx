import { sendGAEvent } from '@next/third-parties/google';
import { TbBellCancel, TbBellFilled, TbBellOff, TbBellZ } from 'react-icons/tb';

import { Button } from '@/components/button';
import { Tooltip } from '@/components/tooltip';
import { useSubscribeToUpdates } from '@/hooks/use-subscribe-to-updates';
import { useUnsubscribeFromUpdates } from '@/hooks/use-unsubscribe-from-updates';

interface NotificationButtonProps {
  hasNotificationTurnedOn: boolean;
  stationId: string;
}

export function NotificationButton({ stationId, hasNotificationTurnedOn }: NotificationButtonProps) {
  const subscribeToUpdates = useSubscribeToUpdates();
  const unsubscribeFromUpdates = useUnsubscribeFromUpdates();

  const onSubscribe = () => {
    if (hasNotificationTurnedOn) {
      sendGAEvent('event', 'unsubscribe', stationId);
      unsubscribeFromUpdates.mutate(stationId);
    } else {
      sendGAEvent('event', 'subscribe', stationId);
      subscribeToUpdates.mutate(stationId);
    }
  };

  const notificationsSupported = typeof Notification !== 'undefined';
  const notificationsDenied = notificationsSupported && Notification.permission === 'denied';
  const notificationsDisabled = !notificationsSupported || notificationsDenied;

  let notificationIcon = hasNotificationTurnedOn ? <TbBellFilled size={20} /> : <TbBellZ size={20} />;
  let tooltipText = 'Kapj értesítéseket 1 órán keresztül a frissítésekről!';

  if (!notificationsSupported) {
    notificationIcon = <TbBellOff size={20} className='text-red-300' />;
    tooltipText = 'Az értesítéseket nem támogatja a böngésződ. Próbáld meg hozzáadni a főképernyőhöz mobilon!';
  }
  if (notificationsDenied) {
    notificationIcon = <TbBellCancel size={20} className='text-red-300' />;
    tooltipText = 'Az értesítéseket letiltottad. Engedélyezd őket a böngésző beállításaiban!';
  }
  if (hasNotificationTurnedOn) {
    tooltipText = 'Az értesítések be vannak kapcsolva erre a töltőpontra!';
  }

  return (
    <Tooltip text={tooltipText}>
      <Button className='beta-badge' disabled={notificationsDisabled} onClick={onSubscribe}>
        {notificationIcon}
      </Button>
    </Tooltip>
  );
}

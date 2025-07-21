import { useMemo } from 'react';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { useChargePoints } from '@/hooks/use-charge-points';
import { useSubscriptions } from '@/hooks/use-subscriptions';

export function useChargers() {
  const chargePoints = useChargePoints();
  const subscriptions = useSubscriptions();

  const chargers: ChargerViewModel[] = useMemo<ChargerViewModel[]>(() => {
    const chargePointsData = chargePoints.data ?? [];

    return chargePointsData.map<ChargerViewModel>((charger) => {
      return {
        ...charger,
        chargePoints: charger.chargePoints.map((cp) => ({
          ...cp,
          status: 'UNKNOWN',
        })),
        hasNotificationTurnedOn: subscriptions.data?.includes(charger.id) ?? false,
      };
    });
  }, [chargePoints.data, subscriptions.data]);

  return {
    chargers,
    chargePointsQuery: chargePoints,
  };
}

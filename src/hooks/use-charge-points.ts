import { useQuery } from '@tanstack/react-query';

import { getMobilitiChargePoints } from '@/services/charge-point.service';
import { ChargerViewModel } from '@/types/charger-view-model.types';

export function useChargePoints() {
  return useQuery<ChargerViewModel[]>({
    queryKey: ['chargePoints'],
    queryFn: () => getMobilitiChargePoints(),
    refetchInterval: 60000,
  });
}

import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getDcsChargePoints } from '@/services/charge-point.service';
import { ChargerViewModel } from '@/types/charger-view-model.types';

export function useChargePoints(): UseQueryResult<ChargerViewModel[]> {
  return useQuery<ChargerViewModel[]>({
    queryKey: ['chargePoints'],
    queryFn: () => getDcsChargePoints(),
    // refetchInterval: 60000,
    initialData: [],
  });
}

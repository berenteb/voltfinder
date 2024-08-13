import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { getDcsChargePoints } from '@/services/charge-point.service';

export function useChargePoints(): UseQueryResult<ChargerViewModel[]> {
  return useQuery<ChargerViewModel[]>({
    queryKey: ['chargePoints'],
    queryFn: () => getDcsChargePoints(),
    // refetchInterval: 60000,
    initialData: [],
  });
}

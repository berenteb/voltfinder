import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { getMobilitiChargePoints } from '@/services/mobiliti.service';

export function useChargePoints(): UseQueryResult<ChargerViewModel[]> {
  return useQuery<ChargerViewModel[]>({
    queryKey: ['chargePoints'],
    queryFn: () => getMobilitiChargePoints(),
    // refetchInterval: 60000,
    initialData: [],
  });
}

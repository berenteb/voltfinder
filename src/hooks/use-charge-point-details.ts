import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getDcsChargePointDetails } from '@/services/charge-point.service';
import { DcsChargePointItemDto } from '@/types/dcs.types';

export function useChargePointDetails(): UseQueryResult<DcsChargePointItemDto[]> {
  return useQuery<DcsChargePointItemDto[]>({
    queryKey: ['chargePointDetails'],
    queryFn: () => getDcsChargePointDetails(),
    refetchInterval: 30000,
    initialData: [],
  });
}

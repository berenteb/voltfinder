import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { DcsChargePointItemDto } from '@/common/types/dcs.types';
import { getDcsChargePointDetails } from '@/services/charge-point.service';

export function useChargePointDetails(): UseQueryResult<DcsChargePointItemDto[]> {
  return useQuery<DcsChargePointItemDto[]>({
    queryKey: ['chargePointDetails'],
    queryFn: () => getDcsChargePointDetails(),
    refetchInterval: 30000,
    initialData: [],
  });
}

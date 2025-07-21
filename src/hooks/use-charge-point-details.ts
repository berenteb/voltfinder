import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { DcsChargePointItemDto } from '@/common/types/dcs.types';

export function useChargePointDetails(): UseQueryResult<DcsChargePointItemDto[]> {
  return useQuery<DcsChargePointItemDto[]>({
    queryKey: ['chargePointDetails'],
    queryFn: () => [],
    refetchInterval: 30000,
    initialData: [],
  });
}

import { useQuery } from '@tanstack/react-query';

import { getMobilitiChargePoints } from '@/services/charge-point.service';

export function useChargePoints() {
  return useQuery({
    queryKey: ['chargePoints'],
    queryFn: () => getMobilitiChargePoints(),
    refetchInterval: 60000,
  });
}

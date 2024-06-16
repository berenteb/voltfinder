import { useQuery } from '@tanstack/react-query';

import { getChargePointDetails } from '@/services/charge-point.service';

export function useChargePointDetails(country: string, provider: string, id: string) {
  return useQuery({
    queryKey: ['chargePointDetails', country, provider, id],
    queryFn: () => getChargePointDetails(country, provider, id),
    refetchInterval: 60000,
  });
}

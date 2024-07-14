import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getDcsPrice } from '@/services/charge-point.service';
import { ChargerViewModel } from '@/types/charger-view-model.types';
import { DcsPriceResponseDto } from '@/types/dcs-price.types';

export function usePrice(charger: ChargerViewModel): UseQueryResult<DcsPriceResponseDto> {
  return useQuery<DcsPriceResponseDto>({
    queryKey: ['price', charger.id],
    queryFn: () => getDcsPrice(charger.chargePoints),
    // refetchInterval: 60000,
  });
}

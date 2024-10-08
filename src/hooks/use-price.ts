import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { DcsPriceResponseDto } from '@/common/types/dcs-price.types';
import { getDcsPrice } from '@/services/charge-point.service';

export function usePrice(charger: ChargerViewModel): UseQueryResult<DcsPriceResponseDto> {
  return useQuery<DcsPriceResponseDto>({
    queryKey: ['price', charger.id],
    queryFn: () => getDcsPrice(charger.chargePoints),
    // refetchInterval: 60000,
  });
}

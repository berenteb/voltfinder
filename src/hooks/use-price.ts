import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { DcsPriceResponseDto } from '@/common/types/dcs-price.types';

export function usePrice(charger: ChargerViewModel): UseQueryResult<DcsPriceResponseDto> {
  return useQuery<DcsPriceResponseDto>({
    queryKey: ['price', charger.id],
    queryFn: () => [],
    // refetchInterval: 60000,
  });
}

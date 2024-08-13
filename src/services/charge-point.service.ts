import { axiosService } from '@/common/services/axios.service';
import { ChargePointViewModel, ChargerViewModel } from '@/common/types/charger-view-model.types';
import { DcsChargePointItemDto } from '@/common/types/dcs.types';
import { DcsPoolDetails } from '@/common/types/dcs-pool-details';
import { ConnectorPriceRequestDto, DcsPriceResponseDto } from '@/common/types/dcs-price.types';
import { mapDcsDataArrayToChargerViewModelArray } from '@/lib/charger.utils';

export const getDcsChargePoints = async (): Promise<ChargerViewModel[]> => {
  const response = await axiosService.get<DcsPoolDetails[]>('/api/dcs/charge-points');
  if (!Array.isArray(response.data)) return [];
  return mapDcsDataArrayToChargerViewModelArray(response.data);
};

export const getDcsChargePointDetails = async () => {
  const response = await axiosService.get<DcsChargePointItemDto[]>('/api/dcs/charge-point-details');
  return response.data;
};

export const getDcsPrice = async (chargePoints: ChargePointViewModel[]) => {
  const response = await axiosService.post<DcsPriceResponseDto>(
    '/api/dcs/price',
    chargePoints.reduce<ConnectorPriceRequestDto[]>((acc, chargePoint) => {
      acc.push(
        ...chargePoint.connectors.map((connector) => ({
          charge_point: chargePoint.id,
          power_type: connector.currentType,
          power: connector.power,
        }))
      );

      return acc;
    }, [])
  );
  return response.data;
};

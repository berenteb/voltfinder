import { mapDcsDataToChargerViewModel } from '@/lib/charger.utils';
import { axiosService } from '@/services/axios.service';
import { ChargerViewModel } from '@/types/charger-view-model.types';
import { DcsChargePointItemDto } from '@/types/dcs';
import { DcsPoolDetails } from '@/types/dcs-pool-details';

export const getDcsChargePoints = async (): Promise<ChargerViewModel[]> => {
  const response = await axiosService.get<DcsPoolDetails[]>('/api/dcs/charge-points');
  if (!Array.isArray(response.data)) return [];
  return response.data.map((data) => mapDcsDataToChargerViewModel(data));
};

export const getDcsChargePointDetails = async () => {
  const response = await axiosService.get<DcsChargePointItemDto[]>('/api/dcs/charge-point-details');
  return response.data;
};

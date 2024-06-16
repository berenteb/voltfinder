import { mapMobilitiDataToChargerViewModel } from '@/lib/charger.utils';
import { axiosService } from '@/services/axios.service';
import { ChargePoint } from '@/types/charge-point.types';
import { ChargerViewModel } from '@/types/charger-view-model.types';
import { MobilitiData } from '@/types/mobiliti.types';

export const getMobilitiChargePoints = async (): Promise<ChargerViewModel[]> => {
  const response = await axiosService.get<MobilitiData[]>('/api/charge-points');
  if (!Array.isArray(response.data)) return [];
  return response.data.map((data) => mapMobilitiDataToChargerViewModel(data));
};

export const getChargePointDetails = async (country: string, provider: string, id: string) => {
  const response = await axiosService.get<ChargePoint>(
    `/api/charge-point-details/${country}/${provider}/${id}?reduced=true`
  );
  return response.data;
};

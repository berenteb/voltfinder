import { axiosService } from '@/services/axios.service';
import { ChargePoint } from '@/types/charge-point.types';
import { MobilitiData } from '@/types/mobiliti.types';

export const getMobilitiChargePoints = async () => {
  const response = await axiosService.get<MobilitiData[]>('/api/charge-points');
  return response.data;
};

export const getChargePointDetails = async (country: string, provider: string, id: string) => {
  const response = await axiosService.get<ChargePoint>(
    `/api/charge-point-details/${country}/${provider}/${id}?reduced=true`
  );
  return response.data;
};

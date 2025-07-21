import { backendAxiosService } from '@/common/services/backend-axios.service';
import { ChargerViewModel } from '@/common/types/charger-view-model.types';

export async function getMobilitiChargePoints(): Promise<ChargerViewModel[]> {
  const response = await backendAxiosService.get<ChargerViewModel[]>('/data');
  return response.data;
}

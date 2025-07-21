import { axiosService } from '@/common/services/axios.service';
import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { MobilitiLocationResponse } from '@/common/types/mobiliti.types';
import { mapMobilitiDataToChargerViewModel } from '@/lib/charger.utils';

export async function getMobilitiLocations(): Promise<MobilitiLocationResponse> {
  const response = await axiosService.get<MobilitiLocationResponse>('/api/mobiliti');
  return response.data;
}

export async function getMobilitiChargePoints(): Promise<ChargerViewModel[]> {
  const data = await getMobilitiLocations();
  return mapMobilitiDataToChargerViewModel(data);
}

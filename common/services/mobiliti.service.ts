import { MobilitiLocationResponse } from '@/common/types/mobiliti.types';

import { axiosService } from './axios.service';

export async function getMobilitiLocations(): Promise<MobilitiLocationResponse> {
  const response = await axiosService.get<MobilitiLocationResponse>(
    'https://api.mobiliti.hu/ocpi-location/api/v1/own-and-foreign-locations'
  );
  return response.data;
}

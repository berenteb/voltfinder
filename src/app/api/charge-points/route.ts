import { NextResponse } from 'next/server';

import { axiosService } from '@/services/axios.service';
import { MobilitiData } from '@/types/mobiliti.types';

export const GET = async () => {
  const response = await axiosService.get<MobilitiData[]>(
    'https://api.mobiliti.hu/ocpi-location/api/v1/own-and-foreign-locations'
  );
  return NextResponse.json(response.data);
};

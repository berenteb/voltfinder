import { NextRequest, NextResponse } from 'next/server';

import { axiosService } from '@/services/axios.service';
import { ChargePoint } from '@/types/charge-point.types';

export const GET = async (
  _: NextRequest,
  { params }: { params: { country: string; provider: string; location: string } }
) => {
  const response = await axiosService.get<ChargePoint>(
    `https://api.mobiliti.hu/ocpi-location/api/v2/public/locations/${params.country}/${params.provider}/${params.location}?reduced=true`
  );
  return NextResponse.json(response.data);
};

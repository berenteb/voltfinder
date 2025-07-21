import { NextResponse } from 'next/server';

import { getMobilitiLocations } from '@/common/services/mobiliti.service';

export async function GET() {
  const data = await getMobilitiLocations();
  return NextResponse.json(data);
}

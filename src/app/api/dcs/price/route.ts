import { NextResponse } from 'next/server';

import { getPricesForConnectors } from '@/common/services/dcs.service';
import { ConnectorPriceRequestDto } from '@/common/types/dcs-price.types';

export async function POST(request: Request) {
  const body = await request.json();
  if (!validateBody(body)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const data = await getPricesForConnectors(body);
  return NextResponse.json(data);
}

function validateBody(body: any): body is ConnectorPriceRequestDto[] {
  if (!body || !Array.isArray(body)) {
    return false;
  }
  for (const item of body) {
    if (!item.charge_point || !item.power_type || !item.power) {
      return false;
    }
  }
  return true;
}

import { NextResponse } from 'next/server';

import { getChargePointsByIds, getPoolList } from '@/common/services/dcs.service';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const pools = await getPoolList();
  const pointsIds = pools.reduce<string[]>((acc, pool) => {
    acc.push(...pool.chargePoints.map((point) => point.id));
    return acc;
  }, []);
  const poolDetails = await getChargePointsByIds(pointsIds);
  return NextResponse.json(poolDetails);
};

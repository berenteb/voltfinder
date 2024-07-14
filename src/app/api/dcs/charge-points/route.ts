import { NextResponse } from 'next/server';

import { getPoolDetails, getPoolList } from '@/services/server/dcs.service';

export const GET = async () => {
  const pools = await getPoolList();
  const poolDetails = await getPoolDetails(pools.map((pool) => pool.id));
  return NextResponse.json(poolDetails);
};

import { NextResponse } from 'next/server';

import { getPoolDetails, getPoolList } from '@/common/services/dcs.service';

export const revalidate = 60 * 60;

export const GET = async () => {
  const pools = await getPoolList();
  const poolDetails = await getPoolDetails(pools.map((pool) => pool.id));
  return NextResponse.json(poolDetails);
};

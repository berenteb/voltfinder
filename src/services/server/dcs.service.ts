import { axiosService } from '@/services/axios.service';
import {
  DcsChargePointItemDto,
  DcsChargePointResponseDto,
  DcsChargePointsRequestDto,
  DcsChargingRequestDto,
  DcsChargingResponseDto,
  DcsPoolItemDto,
} from '@/types/dcs.types';
import { DcsPoolDetails, DcsPoolDetailsRequestDto, DcsPoolDetailsResponseDto } from '@/types/dcs-pool-details';
import { ConnectorPriceRequestDto, DcsPriceRequestDto, DcsPriceResponseDto } from '@/types/dcs-price.types';

type DcsRestApiPath = 'clusters' | 'charge-points' | 'pools';

async function queryDcs<TResponseBody = any, TRequestBody = any>(
  restApiPath: DcsRestApiPath,
  requestBody: TRequestBody
): Promise<TResponseBody> {
  const response = await axiosService.post<TResponseBody>(
    'https://bmw-public-charging.com/api/map/v1/hu/query',
    requestBody,
    {
      headers: {
        'rest-api-path': restApiPath,
        'content-type': 'application/json',
      },
    }
  );
  return response.data;
}

export async function getChargePointsByIds(chargePointIds: string[]) {
  const chunkSize = 500;
  const chunkedChargePointIds = [];
  for (let i = 0; i < chargePointIds.length; i += chunkSize) {
    chunkedChargePointIds.push(chargePointIds.slice(i, i + chunkSize));
  }

  const chargePoints: DcsChargePointItemDto[] = [];
  for (const chunk of chunkedChargePointIds) {
    const chargePointsResponse = await getChargePoints(chunk);
    chargePoints.push(...chargePointsResponse);
  }
  return chargePoints;
}

async function getChargePoints(chargePointIds: string[]) {
  const requestData: DcsChargePointsRequestDto = {
    DCSChargePointDynStatusRequest: chargePointIds.map((id) => ({
      dcsChargePointId: id,
    })),
  };
  const chargePointsResponse = await queryDcs<DcsChargePointResponseDto, DcsChargePointsRequestDto>(
    'charge-points',
    requestData
  );
  return chargePointsResponse.DCSChargePointDynStatusResponse;
}

export async function getPoolList() {
  const requestBody: DcsChargingRequestDto = {
    searchCriteria: {
      latitudeNW: 48.6238540716,
      longitudeNW: 16.2022982113,
      latitudeSE: 45.7594811061,
      longitudeSE: 22.710531447,
      precision: 10,
      unpackClustersWithSinglePool: true,
      unpackSolitudeCluster: true,
    },
    withChargePointIds: true,
    filterCriteria: {
      authenticationMethods: [],
      cableAttachedTypes: [],
      paymentMethods: [],
      plugTypes: [],
      poolLocationTypes: [],
      valueAddedServices: [],
      dcsTcpoIds: [],
    },
  };

  const poolResponse = await queryDcs<DcsChargingResponseDto, DcsChargingRequestDto>('clusters', requestBody);
  return filterPoolsByCountry(poolResponse.pools, 'hu');
}

function filterPoolsByCountry(pools: DcsPoolItemDto[], country: string) {
  return pools.filter((pool) => pool.id.toLowerCase().startsWith(country.toLowerCase()));
}

export async function getPoolDetails(poolIds: string[]) {
  const chunkSize = 100;
  const chunkedPoolIds: string[][] = [];
  for (let i = 0; i < poolIds.length; i += chunkSize) {
    chunkedPoolIds.push(poolIds.slice(i, i + chunkSize));
  }

  const pools: DcsPoolDetails[] = [];
  for (const chunk of chunkedPoolIds) {
    const poolDetailsResponse = await getPoolDetailsByIds(chunk);
    pools.push(...poolDetailsResponse);
  }
  return pools;
}

async function getPoolDetailsByIds(poolIds: string[]) {
  const requestBody: DcsPoolDetailsRequestDto = {
    dcsPoolIds: poolIds,
    filterCriteria: {
      authenticationMethods: [],
      cableAttachedTypes: [],
      dcsTcpoIds: [],
      fallbackLanguage: 'en',
      language: 'hu',
      paymentMethods: [],
      plugTypes: [],
      poolLocationTypes: [],
      valueAddedServices: [],
    },
  };

  return await queryDcs<DcsPoolDetailsResponseDto, DcsPoolDetailsRequestDto>('pools', requestBody);
}

export async function getPricesForConnectors(connectors: ConnectorPriceRequestDto[]) {
  const requestBody: DcsPriceRequestDto = connectors;

  const response = await axiosService.post<DcsPriceResponseDto>(
    'https://bmw-public-charging.com/api/map/v1/hu/tariffs/BMW_CHARGING_AVERAGE/prices',
    requestBody,
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  );

  return response.data;
}

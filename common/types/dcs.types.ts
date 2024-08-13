export type DcsChargingRequestDto = {
  searchCriteria: {
    latitudeNW: number;
    longitudeNW: number;
    latitudeSE: number;
    longitudeSE: number;
    precision: number;
    unpackClustersWithSinglePool: boolean;
    unpackSolitudeCluster: boolean;
  };
  withChargePointIds: boolean;
  filterCriteria: {
    authenticationMethods: string[];
    cableAttachedTypes: string[];
    paymentMethods: string[];
    plugTypes: string[];
    poolLocationTypes: string[];
    valueAddedServices: string[];
    dcsTcpoIds: string[];
  };
};

export type DcsChargingResponseDto = {
  poolClusters: DcsPoolClusterItemDto[];
  pools: DcsPoolItemDto[];
};

export type DcsPoolClusterItemDto = {
  chargePointCount: number;
  longitude: number;
  latitude: number;
  boundingBoxLongitudeNW: number;
  boundingBoxLatitudeNW: number;
  boundingBoxLongitudeSE: number;
  boundingBoxLatitudeSE: number;
};

export type DcsPoolItemDto = {
  longitude: number;
  latitude: number;
  id: string;
  chargePointCount: number;
  chargePoints: DcsPoolChargePointItemDto[];
};

export type DcsPoolChargePointItemDto = {
  id: string;
};

export type DcsChargePointsRequestDto = {
  DCSChargePointDynStatusRequest: { dcsChargePointId: string }[];
};

export type DcsChargePointResponseDto = {
  DCSChargePointDynStatusResponse: DcsChargePointItemDto[];
};

export type DcsChargePointItemDto = {
  dcsChargePointId: string;
  OperationalStateCP: 'AVAILABLE' | 'CHARGING' | 'UNKNOWN' | 'OFFLINE';
  Timestamp: string;
};

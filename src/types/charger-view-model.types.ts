import { PlugType } from '@/types/common.types';

export type ChargerViewModel = {
  id: string;
  countryCode: string;
  partyId: string;
  locationId: string;
  fullAddress: string;
  name: string;
  coordinates: [number, number];
  operatorName: string;
  chargePoints: ChargePointViewModel[];
  plugTypes: PlugType[];
  maxPowerKw: number;
  isFavorite: boolean;
};

export type ChargePointViewModel = {
  id: string;
  evseId: string;
  status: string;
  maxPowerKw: number;
  plugTypes: PlugType[];
  connectors: ConnectorViewModel[];
};

export type ConnectorViewModel = {
  plugType: PlugType;
  power: number;
  currentType: string;
};

import { PlugType } from '@/types/mobiliti.types';

export type ChargerViewModel = {
  id: string;
  countryCode: string;
  partyId: string;
  locationId: string;
  fullAddress: string;
  name: string;
  coordinates: [number, number];
  operatorName: string;
  evses: EvseViewModel[];
  plugTypes: PlugType[];
  maxPowerKw: number;
};

export type EvseViewModel = {
  evseId: string;
  power: number;
  plugType: PlugType;
  currentType: string;
};

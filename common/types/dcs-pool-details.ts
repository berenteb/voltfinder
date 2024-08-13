import { CurrentType } from '@/common/types/common.types';

export type DcsPoolDetailsRequestDto = {
  dcsPoolIds: string[];
  filterCriteria: {
    authenticationMethods: string[];
    cableAttachedTypes: string[];
    paymentMethods: string[];
    plugTypes: string[];
    poolLocationTypes: string[];
    valueAddedServices: string[];
    dcsTcpoIds: string[];
    language: 'hu' | string;
    fallbackLanguage: 'en' | string;
  };
};

export type DcsPoolDetailsResponseDto = DcsPoolDetails[];

export type DcsPoolDetails = {
  poolPaymentMethods: string[];
  poolLocations: Location[];
  poolContacts: PoolContact[];
  chargingStations: ChargingStation[];
  technicalChargePointOperatorName: string;
  dcsPoolId: string;
  poolLocationType: string;
  access: string;
  timeZone: string;
  open24h: boolean;
};

export type ChargingStation = {
  chargePoints: ChargePoint[];
  dcsCsId: string;
  incomingCsId: string;
  chargingStationLocation: Location;
  chargingStationAuthMethods: ('RFID' | 'REMOTE' | string)[];
};

export type ChargePoint = {
  connectors: Connector[];
  dcsCpId: string;
  incomingCpId: string;
  dynamicInfoAvailable: boolean;
  isoNormedId: boolean;
};

export type Connector = {
  id: string;
  plugType: DcsPlugType;
  cableAttached: string;
  phaseType: CurrentType;
  ampere: number;
  powerLevel: number;
  voltage: number;
};

export enum DcsPlugType {
  CHADEMO = 'CHADEMO',
  CCS = 'CCS',
  TYPE2 = 'TYP2',
}

export type Location = {
  type: string;
  coordinates: Coordinates;
  street: string;
  zipCode: string;
  city: string;
  countryCode: string;
  locationNames?: LocationName[];
  poolLocationNames?: LocationName[];
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type LocationName = {
  language: string;
  name: string;
};

export type PoolContact = {
  name: string;
  phone: string;
};

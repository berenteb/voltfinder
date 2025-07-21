export type MobilitiLocationResponse = MobilitiLocationItem[];

export interface MobilitiLocationItem {
  id: string;
  evses: Evse[];
  city: string;
  description?: Description;
  label?: string;
  latitude: string;
  longitude: string;
  name: string;
  openHours?: OpenHours;
  operator: Operator;
  parking?: number;
  parkingSpaces?: number;
  province?: string;
  address: string;
  usageCost?: boolean;
  usageType: string;
  postalCode: string;
  customMarker?: string;
  marker: string;
  ocpi?: Ocpi;
  manufacturer?: string;
  ownerUserId?: string;
  createdAt?: string;
  updatedAt?: string;
  stateInfo?: StateInfo;
}

export interface Evse {
  current: number;
  currentType: string;
  evseId?: string;
  uid?: string;
  plugType: string;
  quantity: number;
  voltage: number;
  power: number;
  cableAttached: boolean;
  label?: string;
}

export interface Description {
  hu?: string;
  en?: string;
}

export interface OpenHours {
  ALLDAYS?: string;
  MONDAY?: string;
  TUESDAY?: string;
  WEDNESDAY?: string;
  THURSDAY?: string;
  FRIDAY?: string;
  SATURDAY?: string;
  SUNDAY?: string;
  WEEKDAYS?: string;
  WEEKENDS?: string;
}

export interface Operator {
  name?: string;
  website?: string;
  phone?: string;
  email?: string;
}

export interface Ocpi {
  stationId: StationId;
}

export interface StationId {
  countryCode: string;
  partyId: string;
  locationId: string;
  uniqueId: string;
}

export interface StateInfo {
  protocol: string;
  url: string;
}

export interface MobilitiLocationDetails {
  evses: EvseDetails[];
  id: string;
  emspDetails: EmspDetails;
  isSessionImitation: boolean;
  isRoaming: boolean;
  isForeign: boolean;
}

export interface EvseDetails {
  connectors: Connector[];
  status: string;
  lastUpdated: string;
  id: string;
  uid: string;
  evseId: string;
  capabilities: string[];
  physicalReference: string;
  coordinates: Coordinates;
}

export interface Connector {
  id: string;
  standard: string;
  format: string;
  powerType: string;
  voltage: number;
  amperage: number;
  power: number;
  tariffId: string;
  lastUpdated: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface EmspDetails {
  chargingEnabled: boolean;
  locationType: string;
  evseLabels: EvseLabels;
  openHours: OpenHours;
  operator: Operator;
  usageCost: boolean;
  customMarker: string;
  isOwnLocation: boolean;
  isVisible: boolean;
  deactivated: boolean;
  allowedByNationalEnergeticOrganization: boolean;
  sendNotificationBeforeClosure: boolean;
  accessibility: string;
  numberOfAccessibleParkingLot: number;
  createdAt: string;
  updatedAt: string;
}

export type EvseLabels = Record<string, string>;

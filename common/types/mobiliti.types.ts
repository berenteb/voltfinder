export type MobilitiLocationResponse = MobilitiLocation[];

export interface MobilitiLocation {
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

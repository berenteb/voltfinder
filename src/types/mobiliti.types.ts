export type MobilitiData = {
  id?: string;
  evses?: Evse[];
  city?: string;
  description?: Description;
  label?: string;
  latitude?: string;
  longitude?: string;
  name?: string;
  openHours?: OpenHours;
  operator?: Operator;
  parking?: number;
  parkingSpaces?: number;
  province?: string;
  address?: string;
  usageCost?: boolean;
  usageType?: UsageType;
  postalCode?: string;
  customMarker?: Marker;
  marker?: string;
  ocpi?: Ocpi;
  ownerUserId?: string;
  manufacturer?: string;
};

export enum Marker {
  Default = 'DEFAULT',
  Ionity = 'IONITY',
  MobilitiFastDc25 = 'MOBILITI_FAST_DC25',
  MobilitiRapid = 'MOBILITI_RAPID',
  MobilitiRapid70 = 'MOBILITI_RAPID_70',
  Private = 'PRIVATE',
  RoamingAC = 'ROAMING_AC',
  RoamingDc = 'ROAMING_DC',
  Shell = 'SHELL',
  Spar = 'SPAR',
}

export type Description = {
  hu?: string;
  en?: string;
};

export type Evse = {
  current?: number;
  currentType?: CurrentType;
  evseId?: string;
  uid?: string;
  label?: string;
  plugType?: string;
  quantity?: number;
  voltage?: number;
  power?: number;
  cableAttached?: boolean;
};

export enum CurrentType {
  AC = 'AC',
  Dc = 'DC',
}

export enum PlugType {
  CHAdeMO = 'chademo',
  Ccs = 'ccs',
  Type2 = 'type2',
}

export type Ocpi = {
  stationId?: StationID;
};

export type StationID = {
  countryCode?: string;
  partyId?: string;
  locationId?: string;
  uniqueId?: string;
};

export type OpenHours = {
  ALLDAYS?: string;
  WEEKDAYS?: string;
};

export type Operator = {
  name?: string;
  website?: string;
  phone?: string;
  email?: string;
};

export enum UsageType {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

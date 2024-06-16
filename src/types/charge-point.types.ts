import { Description, OpenHours } from '@/types/mobiliti.types';

export type ChargePoint = {
  evses?: ChargePointEvse[];
  id?: string;
  emspDetails?: EmspDetails;
};

export type EmspDetails = {
  chargingEnabled?: boolean;
  parkingSensorEnabled?: boolean;
  locationType?: string;
  description?: Description;
  evseLabels?: Record<string, string>;
  firebaseId?: string;
  name?: string;
  openHours?: OpenHours;
  operator?: Operator;
  parking?: number;
  parkingSpaces?: number;
  province?: string;
  usageCost?: boolean;
  isOwnLocation?: boolean;
  isVisible?: boolean;
  deactivated?: boolean;
  topographicalNumber?: string;
  powerUnit?: string;
  locationProductType?: string;
  locationProductId?: string;
  commissionDate?: Date;
  decommissionDate?: Date;
  requiredPowerForOperation?: number;
  electricNetworkConnectionType?: string;
  podId?: string;
  locationStatus?: string;
  evseConnectionPower?: EvseConnectionPower;
  allowedByNationalEnergeticOrganization?: boolean;
  maintenance?: Maintenance;
  partnerLocationGroup?: PartnerLocationGroup;
  sapDeviceId?: string;
  sapCoId?: string;
  isExternallyOwned?: boolean;
  locationTechnicalStatus?: LocationTechnicalStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type EvseConnectionPower = {
  ccs2?: number;
  chademo?: number;
  dc?: number;
  type2?: number;
  ac?: number;
};

export type LocationTechnicalStatus = {
  id?: string;
  countryCode?: string;
  partyId?: string;
  locationId?: string;
  technicalStatus?: string;
  repairStatus?: string;
  description?: string;
  isActual?: boolean;
  statusStartDate?: Date;
  lastUpdatedAt?: Date;
  lastUpdatedBy?: string;
};

export type Maintenance = {
  ownMaintenance?: boolean;
  maintenanceSince?: Date;
  monthlyCost?: number;
  currency?: string;
};

export type Operator = {
  website?: string;
  phone?: string;
  name?: string;
  email?: string;
};

export type PartnerLocationGroup = {
  id?: string;
  partnerName?: string;
  partnerCompanyName?: string;
};

export type ChargePointEvse = {
  connectors?: Connector[];
  status?: string;
  lastUpdated?: Date;
  id?: string;
  uid?: string;
  evseId?: string;
  capabilities?: string[];
  physicalReference?: string;
};

export type Connector = {
  id?: string;
  standard?: string;
  format?: string;
  powerType?: string;
  voltage?: number;
  amperage?: number;
  power?: number;
  tariffId?: string;
  lastUpdated?: Date;
};
